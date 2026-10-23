/** Doğrulanmış satırları veritabanına uygular (upsert, tek işlem); içe aktarma kaydı ve denetim izi yazar. */
import { eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { OrgRow, PersonRow, PositionRow, RoleRow } from "./validators";
import type { RowError } from "./parse";

const { orgUnits, roles, positions, people, assignments, importBatches, importErrors, auditLog } = schema;

export interface ApplyOutcome { batchId: number; inserted: number; updated: number }

async function recordBatch(type: "ORG" | "ROLE" | "POSITION" | "PEOPLE", fileName: string, total: number, validCount: number, errors: RowError[], userId: number | null, apply: boolean) {
  const [b] = await db.insert(importBatches).values({
    type, fileName, status: apply ? "APPLIED" : "VALIDATED", totalRows: total, validRows: validCount, errorRows: errors.length, createdBy: userId, appliedAt: apply ? new Date() : null,
  }).returning({ id: importBatches.id });
  if (errors.length) await db.insert(importErrors).values(errors.slice(0, 2000).map((e) => ({ batchId: b.id, rowNo: e.rowNo, field: e.field ?? null, message: e.message })));
  return b.id;
}

export async function applyOrg(rows: OrgRow[], total: number, errors: RowError[], fileName: string, userId: number | null): Promise<ApplyOutcome> {
  let inserted = 0, updated = 0;
  await db.transaction(async (tx) => {
    // Üst birimler önce gelsin: dosya sırası korunur; mevcut kodlar sözlüğe alınır.
    const codeToId = new Map<string, number>();
    const existing = await tx.select({ id: orgUnits.id, code: orgUnits.code }).from(orgUnits);
    existing.forEach((e) => codeToId.set(e.code, e.id));
    const managerNos = rows.map((r) => r.managerEmployeeNo).filter((x): x is string => !!x);
    const managers = managerNos.length ? await tx.select({ id: people.id, no: people.employeeNo }).from(people).where(inArray(people.employeeNo, managerNos)) : [];
    const noToPerson = new Map(managers.map((m) => [m.no, m.id]));
    // Birden çok geçişte ebeveyni çözülmeyenleri sonraya bırak
    let pending = [...rows]; let guard = 0;
    while (pending.length && guard++ < 20) {
      const next: OrgRow[] = [];
      for (const r of pending) {
        const parentId = r.parentCode ? codeToId.get(r.parentCode) : null;
        if (r.parentCode && parentId == null) { next.push(r); continue; }
        const depth = parentId ? ((await tx.select({ d: orgUnits.depth }).from(orgUnits).where(eq(orgUnits.id, parentId)))[0]?.d ?? 0) + 1 : 0;
        const values = {
          code: r.code, parentId: parentId ?? null, type: r.type as typeof orgUnits.$inferInsert.type, name: r.name,
          managerPersonId: r.managerEmployeeNo ? noToPerson.get(r.managerEmployeeNo) ?? null : null,
          branchClass: (r.branchClass as typeof orgUnits.$inferInsert.branchClass) ?? null, segment: (r.segment as typeof orgUnits.$inferInsert.segment) ?? null, depth, updatedAt: new Date(),
        };
        const id = codeToId.get(r.code);
        if (id) { await tx.update(orgUnits).set(values).where(eq(orgUnits.id, id)); updated++; }
        else { const [ins] = await tx.insert(orgUnits).values(values).returning({ id: orgUnits.id }); codeToId.set(r.code, ins.id); inserted++; }
      }
      pending = next;
    }
    if (pending.length) throw new Error(`Üst birimi çözülemeyen ${pending.length} satır: ${pending.slice(0, 5).map((p) => p.code).join(", ")}`);
    await tx.insert(auditLog).values({ entity: "org_units", entityId: "batch", action: "IMPORT", after: { inserted, updated }, userId });
  });
  const batchId = await recordBatch("ORG", fileName, total, rows.length, errors, userId, true);
  return { batchId, inserted, updated };
}

export async function applyRoles(rows: RoleRow[], total: number, errors: RowError[], fileName: string, userId: number | null): Promise<ApplyOutcome> {
  let inserted = 0, updated = 0;
  await db.transaction(async (tx) => {
    for (const r of rows) {
      const values = { code: r.code, name: r.name, jobFamily: r.jobFamily, grade: r.grade, isManager: r.isManager, network: r.network as typeof roles.$inferInsert.network, segment: (r.segment as typeof roles.$inferInsert.segment) ?? null, description: r.description };
      const res = await tx.insert(roles).values(values).onConflictDoUpdate({ target: roles.code, set: values }).returning({ inserted: sql<boolean>`(xmax = 0)` });
      if (res[0]?.inserted) inserted++; else updated++;
    }
    await tx.insert(auditLog).values({ entity: "roles", entityId: "batch", action: "IMPORT", after: { inserted, updated }, userId });
  });
  const batchId = await recordBatch("ROLE", fileName, total, rows.length, errors, userId, true);
  return { batchId, inserted, updated };
}

export async function applyPositions(rows: PositionRow[], total: number, errors: RowError[], fileName: string, userId: number | null): Promise<ApplyOutcome> {
  let inserted = 0, updated = 0;
  await db.transaction(async (tx) => {
    const roleMap = new Map((await tx.select({ id: roles.id, code: roles.code }).from(roles)).map((r) => [r.code, r.id]));
    const orgMap = new Map((await tx.select({ id: orgUnits.id, code: orgUnits.code }).from(orgUnits)).map((r) => [r.code, r.id]));
    for (const r of rows) {
      const values = { code: r.code, roleId: roleMap.get(r.roleCode)!, orgUnitId: orgMap.get(r.orgCode)!, isCritical: r.isCritical };
      const res = await tx.insert(positions).values(values).onConflictDoUpdate({ target: positions.code, set: values }).returning({ inserted: sql<boolean>`(xmax = 0)` });
      if (res[0]?.inserted) inserted++; else updated++;
    }
    await tx.insert(auditLog).values({ entity: "positions", entityId: "batch", action: "IMPORT", after: { inserted, updated }, userId });
  });
  const batchId = await recordBatch("POSITION", fileName, total, rows.length, errors, userId, true);
  return { batchId, inserted, updated };
}

export async function applyPeople(rows: PersonRow[], total: number, errors: RowError[], fileName: string, userId: number | null): Promise<ApplyOutcome> {
  let inserted = 0, updated = 0;
  await db.transaction(async (tx) => {
    const posMap = new Map((await tx.select({ id: positions.id, code: positions.code }).from(positions)).map((r) => [r.code, r.id]));
    for (const r of rows) {
      const values = { employeeNo: r.employeeNo, fullName: r.fullName, email: r.email, hireDate: r.hireDate };
      const res = await tx.insert(people).values(values).onConflictDoUpdate({ target: people.employeeNo, set: values }).returning({ id: people.id, inserted: sql<boolean>`(xmax = 0)` });
      if (res[0]?.inserted) inserted++; else updated++;
      const personId = res[0].id;
      if (r.positionCode) {
        const positionId = posMap.get(r.positionCode)!;
        const current = await tx.select({ id: assignments.id, positionId: assignments.positionId }).from(assignments)
          .where(sql`${assignments.personId} = ${personId} and ${assignments.isPrimary} = true and ${assignments.endDate} is null`);
        const start = r.startDate ?? new Date().toISOString().slice(0, 10);
        if (!current.length) await tx.insert(assignments).values({ personId, positionId, startDate: start, isPrimary: true });
        else if (current[0].positionId !== positionId) {
          await tx.update(assignments).set({ endDate: start }).where(eq(assignments.id, current[0].id));
          await tx.insert(assignments).values({ personId, positionId, startDate: start, isPrimary: true });
        }
      }
    }
    await tx.insert(auditLog).values({ entity: "people", entityId: "batch", action: "IMPORT", after: { inserted, updated }, userId });
  });
  const batchId = await recordBatch("PEOPLE", fileName, total, rows.length, errors, userId, true);
  return { batchId, inserted, updated };
}

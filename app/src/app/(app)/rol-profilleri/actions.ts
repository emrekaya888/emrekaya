"use server";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { copyWithPlusOne, defaultBehavioralTarget } from "@/domain/profile";

const { roleProfiles, roles, competencies, auditLog } = schema;
export type ActionState = { error?: string; ok?: string } | undefined;

async function admin() {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN")) throw new Error("İK admin yetkisi gerekir.");
  return s;
}
const fail = (e: unknown): ActionState => ({ error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : e instanceof Error ? e.message : "Hata" });
const refresh = (roleId?: number) => { revalidatePath("/rol-profilleri"); if (roleId) revalidatePath(`/rol-profilleri/${roleId}`); revalidatePath("/kisiler"); };

/** Çekirdek yetkinlikleri tüm rollere, liderlik yetkinliklerini yönetici rollerine bağlar (olmayanları ekler; mevcutlara dokunmaz). */
export async function applyBehavioralDefaultsAction(): Promise<ActionState> {
  try {
    const s = await admin();
    const comps = await db.select().from(competencies).where(and(eq(competencies.kind, "DAVRANISSAL"), eq(competencies.status, "AKTIF")));
    const allRoles = await db.select().from(roles).where(eq(roles.active, true));
    const existing = await db.select({ roleId: roleProfiles.roleId, competencyId: roleProfiles.competencyId }).from(roleProfiles);
    const has = new Set(existing.map((e) => `${e.roleId}:${e.competencyId}`));
    const toInsert: typeof roleProfiles.$inferInsert[] = [];
    for (const r of allRoles) for (const c of comps) {
      if (c.subKind === "LIDERLIK" && !r.isManager) continue;
      if (has.has(`${r.id}:${c.id}`)) continue;
      toInsert.push({ roleId: r.id, competencyId: c.id, targetLevel: defaultBehavioralTarget(r.grade, r.isManager, c.subKind === "LIDERLIK" ? "LIDERLIK" : "CEKIRDEK"), weight: 2, mandatory: false, source: "AUTO" });
    }
    if (toInsert.length) await db.insert(roleProfiles).values(toInsert);
    await db.insert(auditLog).values({ entity: "role_profiles", entityId: "auto", action: "APPLY_DEFAULTS", after: { inserted: toInsert.length }, userId: s.userId ?? null });
    refresh(); return { ok: `${toInsert.length} satır eklendi (${allRoles.length} rol, ${comps.length} aktif davranışsal yetkinlik).` };
  } catch (e) { return fail(e); }
}

const rowSchema = z.object({ targetLevel: z.coerce.number().int().min(1).max(5), weight: z.coerce.number().int().min(1).max(3), mandatory: z.boolean() });

export async function addProfileRowAction(roleId: number, _p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const competencyId = z.coerce.number().int().positive().parse(fd.get("competencyId"));
    const d = rowSchema.parse({ targetLevel: fd.get("targetLevel") ?? 3, weight: fd.get("weight") ?? 2, mandatory: fd.get("mandatory") === "on" });
    const comp = await db.query.competencies.findFirst({ where: eq(competencies.id, competencyId) });
    if (!comp || comp.status !== "AKTIF") return { error: "Yalnızca Aktif yetkinlikler profile eklenebilir." };
    await db.insert(roleProfiles).values({ roleId, competencyId, ...d, source: "MANUAL" })
      .onConflictDoUpdate({ target: [roleProfiles.roleId, roleProfiles.competencyId], set: { ...d, source: "MANUAL", updatedAt: new Date() } });
    await db.insert(auditLog).values({ entity: "role_profiles", entityId: `${roleId}:${competencyId}`, action: "UPSERT", after: d, userId: s.userId ?? null });
    refresh(roleId); return { ok: `${comp.name} eklendi.` };
  } catch (e) { return fail(e); }
}

export async function updateProfileRowAction(rowId: number, field: "targetLevel" | "weight" | "mandatory", value: number | boolean): Promise<ActionState> {
  try {
    const s = await admin();
    const row = await db.query.roleProfiles.findFirst({ where: eq(roleProfiles.id, rowId) });
    if (!row) return { error: "Satır bulunamadı." };
    const patch = field === "mandatory" ? { mandatory: Boolean(value) } : field === "weight" ? { weight: rowSchema.shape.weight.parse(value) } : { targetLevel: rowSchema.shape.targetLevel.parse(value) };
    await db.update(roleProfiles).set({ ...patch, source: "MANUAL", updatedAt: new Date() }).where(eq(roleProfiles.id, rowId));
    await db.insert(auditLog).values({ entity: "role_profiles", entityId: String(rowId), action: "UPDATE", before: { [field]: row[field] }, after: patch, userId: s.userId ?? null });
    refresh(row.roleId); return { ok: "Kaydedildi." };
  } catch (e) { return fail(e); }
}

export async function removeProfileRowAction(rowId: number): Promise<ActionState> {
  try {
    const s = await admin();
    const row = await db.query.roleProfiles.findFirst({ where: eq(roleProfiles.id, rowId) });
    if (!row) return { error: "Satır bulunamadı." };
    await db.delete(roleProfiles).where(eq(roleProfiles.id, rowId));
    await db.insert(auditLog).values({ entity: "role_profiles", entityId: String(rowId), action: "DELETE", before: row, userId: s.userId ?? null });
    refresh(row.roleId); return { ok: "Satır kaldırıldı." };
  } catch (e) { return fail(e); }
}

/** Başka bir rolden kopyala: hedef +plus (kademe +1 kuralı). Mevcut satırların üzerine yazılmaz. */
export async function copyFromRoleAction(roleId: number, sourceRoleId: number, plus: number): Promise<ActionState> {
  try {
    const s = await admin();
    if (sourceRoleId === roleId) return { error: "Kaynak rol aynı olamaz." };
    const src = await db.select().from(roleProfiles).where(eq(roleProfiles.roleId, sourceRoleId));
    if (!src.length) return { error: "Kaynak rolün profili boş." };
    const existing = new Set((await db.select({ c: roleProfiles.competencyId }).from(roleProfiles).where(eq(roleProfiles.roleId, roleId))).map((e) => e.c));
    const rows = copyWithPlusOne(src.filter((r) => !existing.has(r.competencyId)), plus)
      .map((r) => ({ roleId, competencyId: r.competencyId, targetLevel: r.targetLevel, weight: r.weight, mandatory: r.mandatory, source: "COPY" as const }));
    if (rows.length) await db.insert(roleProfiles).values(rows);
    await db.insert(auditLog).values({ entity: "role_profiles", entityId: String(roleId), action: "COPY", after: { from: sourceRoleId, plus, inserted: rows.length }, userId: s.userId ?? null });
    refresh(roleId); return { ok: `${rows.length} satır kopyalandı (hedef ${plus >= 0 ? "+" : ""}${plus}).` };
  } catch (e) { return fail(e); }
}

export async function clearProfileAction(roleId: number): Promise<ActionState> {
  try {
    const s = await admin();
    const rows = await db.select({ id: roleProfiles.id }).from(roleProfiles).where(eq(roleProfiles.roleId, roleId));
    if (rows.length) await db.delete(roleProfiles).where(inArray(roleProfiles.id, rows.map((r) => r.id)));
    await db.insert(auditLog).values({ entity: "role_profiles", entityId: String(roleId), action: "CLEAR", after: { removed: rows.length }, userId: s.userId ?? null });
    refresh(roleId); return { ok: `${rows.length} satır temizlendi.` };
  } catch (e) { return fail(e); }
}

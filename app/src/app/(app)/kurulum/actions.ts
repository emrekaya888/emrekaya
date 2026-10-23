"use server";
import bcrypt from "bcryptjs";
import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";

const { orgUnits, roles, positions, people, assignments, users, userRoles, auditLog } = schema;
export type ActionState = { error?: string; ok?: string } | undefined;

async function admin() {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN")) throw new Error("İK admin yetkisi gerekir.");
  return s;
}
function fail(e: unknown): ActionState {
  if (e instanceof z.ZodError) return { error: e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  return { error: e instanceof Error ? e.message : "Bilinmeyen hata" };
}
function slug(s: string): string {
  return s.trim().toUpperCase().replace(/İ/g, "I").replace(/I/g, "I").replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ş/g, "S").replace(/Ö/g, "O").replace(/Ç/g, "C")
    .replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "BIRIM";
}
async function uniqueCode(base: string, exists: (c: string) => Promise<boolean>): Promise<string> {
  let code = base, n = 2;
  while (await exists(code)) code = `${base}-${n++}`;
  return code;
}
const refresh = () => ["/kurulum", "/organizasyon", "/kisiler", "/roller", "/"].forEach((p) => revalidatePath(p));

// ---------- Birimler
const unitSchema = z.object({
  parentId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2, "Ad en az 2 karakter").max(100),
  type: z.enum(["GMY", "DIREKTORLUK", "DEPARTMAN", "SERVIS", "BOLGE", "SUBE", "PORTFOY_EKIBI", "EKIP"]),
  code: z.string().trim().max(40).optional(),
});
export async function addOrgUnitAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const d = unitSchema.parse({ parentId: fd.get("parentId"), name: fd.get("name"), type: fd.get("type"), code: fd.get("code") || undefined });
    const parent = await db.query.orgUnits.findFirst({ where: eq(orgUnits.id, d.parentId) });
    if (!parent) return { error: "Üst birim bulunamadı." };
    const base = d.code ? slug(d.code) : `${parent.code}-${slug(d.name)}`;
    const code = await uniqueCode(base, async (c) => !!(await db.query.orgUnits.findFirst({ where: eq(orgUnits.code, c) })));
    const [u] = await db.insert(orgUnits).values({ code, name: d.name, type: d.type, parentId: parent.id, depth: parent.depth + 1 }).returning();
    await db.insert(auditLog).values({ entity: "org_units", entityId: String(u.id), action: "CREATE", after: u, userId: s.userId ?? null });
    refresh(); return { ok: `${u.name} eklendi (${u.code}).` };
  } catch (e) { return fail(e); }
}
export async function renameOrgUnitAction(id: number, name: string): Promise<ActionState> {
  try {
    const s = await admin();
    const n = z.string().trim().min(2).max(100).parse(name);
    const before = await db.query.orgUnits.findFirst({ where: eq(orgUnits.id, id) });
    await db.update(orgUnits).set({ name: n, updatedAt: new Date() }).where(eq(orgUnits.id, id));
    await db.insert(auditLog).values({ entity: "org_units", entityId: String(id), action: "RENAME", before: { name: before?.name }, after: { name: n }, userId: s.userId ?? null });
    refresh(); return { ok: "Ad güncellendi." };
  } catch (e) { return fail(e); }
}
export async function setOrgManagerAction(id: number, personId: number | null): Promise<ActionState> {
  try {
    const s = await admin();
    await db.update(orgUnits).set({ managerPersonId: personId, updatedAt: new Date() }).where(eq(orgUnits.id, id));
    await db.insert(auditLog).values({ entity: "org_units", entityId: String(id), action: "SET_MANAGER", after: { personId }, userId: s.userId ?? null });
    refresh(); return { ok: "Yönetici güncellendi." };
  } catch (e) { return fail(e); }
}
export async function deleteOrgUnitAction(id: number): Promise<ActionState> {
  try {
    const s = await admin();
    const u = await db.query.orgUnits.findFirst({ where: eq(orgUnits.id, id) });
    if (!u) return { error: "Birim bulunamadı." };
    if (!u.parentId) return { error: "Kök birim silinemez." };
    const [kids] = await db.select({ c: sql<number>`count(*)::int` }).from(orgUnits).where(eq(orgUnits.parentId, id));
    if (kids.c > 0) return { error: `Önce ${kids.c} alt birimi silin.` };
    const [pos] = await db.select({ c: sql<number>`count(*)::int` }).from(positions).where(eq(positions.orgUnitId, id));
    if (pos.c > 0) return { error: `Önce birimdeki ${pos.c} pozisyonu silin.` };
    await db.delete(schema.competencyOrgUnits).where(eq(schema.competencyOrgUnits.orgUnitId, id));
    await db.update(schema.competencies).set({ ownerOrgUnitId: null }).where(eq(schema.competencies.ownerOrgUnitId, id));
    await db.delete(orgUnits).where(eq(orgUnits.id, id));
    await db.insert(auditLog).values({ entity: "org_units", entityId: String(id), action: "DELETE", before: u, userId: s.userId ?? null });
    refresh(); return { ok: `${u.name} silindi.` };
  } catch (e) { return fail(e); }
}

// ---------- Roller
const roleSchema = z.object({
  name: z.string().trim().min(2).max(80), code: z.string().trim().max(30).optional(),
  jobFamily: z.string().trim().max(80).optional(), grade: z.coerce.number().int().min(1).max(9), isManager: z.boolean(),
});
export async function addRoleAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const d = roleSchema.parse({ name: fd.get("name"), code: fd.get("code") || undefined, jobFamily: fd.get("jobFamily") || undefined, grade: fd.get("grade") ?? 1, isManager: fd.get("isManager") === "on" });
    const code = await uniqueCode(d.code ? slug(d.code) : slug(d.name), async (c) => !!(await db.query.roles.findFirst({ where: eq(roles.code, c) })));
    const [r] = await db.insert(roles).values({ code, name: d.name, jobFamily: d.jobFamily ?? null, grade: d.grade, isManager: d.isManager, network: "GM" }).returning();
    await db.insert(auditLog).values({ entity: "roles", entityId: String(r.id), action: "CREATE", after: r, userId: s.userId ?? null });
    refresh(); return { ok: `${r.name} eklendi (${r.code}).` };
  } catch (e) { return fail(e); }
}
export async function deleteRoleAction(id: number): Promise<ActionState> {
  try {
    const s = await admin();
    const [pos] = await db.select({ c: sql<number>`count(*)::int` }).from(positions).where(eq(positions.roleId, id));
    if (pos.c > 0) return { error: `Bu role bağlı ${pos.c} pozisyon var; önce onları silin.` };
    await db.delete(roles).where(eq(roles.id, id));
    await db.insert(auditLog).values({ entity: "roles", entityId: String(id), action: "DELETE", userId: s.userId ?? null });
    refresh(); return { ok: "Rol silindi." };
  } catch (e) { return fail(e); }
}

// ---------- Pozisyonlar
export async function addPositionAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const d = z.object({ orgUnitId: z.coerce.number().int().positive(), roleId: z.coerce.number().int().positive(), count: z.coerce.number().int().min(1).max(50), isCritical: z.boolean() })
      .parse({ orgUnitId: fd.get("orgUnitId"), roleId: fd.get("roleId"), count: fd.get("count") ?? 1, isCritical: fd.get("isCritical") === "on" });
    const unit = await db.query.orgUnits.findFirst({ where: eq(orgUnits.id, d.orgUnitId) });
    const role = await db.query.roles.findFirst({ where: eq(roles.id, d.roleId) });
    if (!unit || !role) return { error: "Birim veya rol bulunamadı." };
    const created: string[] = [];
    for (let i = 0; i < d.count; i++) {
      const code = await uniqueCode(`P-${unit.code}-${role.code}-1`, async (c) => !!(await db.query.positions.findFirst({ where: eq(positions.code, c) })));
      const [p] = await db.insert(positions).values({ code, orgUnitId: unit.id, roleId: role.id, isCritical: d.isCritical }).returning();
      created.push(p.code);
    }
    await db.insert(auditLog).values({ entity: "positions", entityId: created.join(","), action: "CREATE", userId: s.userId ?? null });
    refresh(); return { ok: `${created.length} pozisyon eklendi: ${created.join(", ")}` };
  } catch (e) { return fail(e); }
}
export async function deletePositionAction(id: number): Promise<ActionState> {
  try {
    const s = await admin();
    const [act] = await db.select({ c: sql<number>`count(*)::int` }).from(assignments).where(and(eq(assignments.positionId, id), isNull(assignments.endDate)));
    if (act.c > 0) return { error: "Pozisyonda aktif atama var; önce kişiyi başka pozisyona alın veya pasifleştirin." };
    await db.delete(assignments).where(eq(assignments.positionId, id));
    await db.delete(positions).where(eq(positions.id, id));
    await db.insert(auditLog).values({ entity: "positions", entityId: String(id), action: "DELETE", userId: s.userId ?? null });
    refresh(); return { ok: "Pozisyon silindi." };
  } catch (e) { return fail(e); }
}

// ---------- Kişiler ve atamalar
const personSchema = z.object({
  employeeNo: z.string().trim().min(1).max(20), fullName: z.string().trim().min(3).max(100),
  email: z.string().trim().email("Geçerli e-posta girin").optional().or(z.literal("")), hireDate: z.string().optional(),
  positionId: z.coerce.number().int().positive().optional(),
});
export async function addPersonAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const d = personSchema.parse({ employeeNo: fd.get("employeeNo"), fullName: fd.get("fullName"), email: fd.get("email") ?? "", hireDate: fd.get("hireDate") || undefined, positionId: fd.get("positionId") || undefined });
    const dup = await db.query.people.findFirst({ where: eq(people.employeeNo, d.employeeNo) });
    if (dup) return { error: `Bu sicil zaten kayıtlı: ${d.employeeNo} (${dup.fullName})` };
    const [p] = await db.insert(people).values({ employeeNo: d.employeeNo, fullName: d.fullName, email: d.email ? d.email.toLowerCase() : null, hireDate: d.hireDate ?? null }).returning();
    if (d.positionId) {
      const taken = await db.select({ id: assignments.id }).from(assignments).where(and(eq(assignments.positionId, d.positionId), isNull(assignments.endDate)));
      if (taken.length) return { ok: `${p.fullName} eklendi, ancak seçilen pozisyon dolu olduğu için atanmadı.` };
      await db.insert(assignments).values({ personId: p.id, positionId: d.positionId, startDate: new Date().toISOString().slice(0, 10) });
    }
    await db.insert(auditLog).values({ entity: "people", entityId: String(p.id), action: "CREATE", after: p, userId: s.userId ?? null });
    refresh(); return { ok: `${p.fullName} eklendi.` };
  } catch (e) { return fail(e); }
}
export async function assignPersonAction(personId: number, positionId: number | null): Promise<ActionState> {
  try {
    const s = await admin();
    const today = new Date().toISOString().slice(0, 10);
    const current = await db.select().from(assignments).where(and(eq(assignments.personId, personId), isNull(assignments.endDate)));
    if (positionId) {
      const taken = await db.select({ id: assignments.id, personId: assignments.personId }).from(assignments).where(and(eq(assignments.positionId, positionId), isNull(assignments.endDate)));
      if (taken.length && taken[0].personId !== personId) return { error: "Pozisyon dolu." };
    }
    for (const c of current) if (c.positionId !== positionId) await db.update(assignments).set({ endDate: today }).where(eq(assignments.id, c.id));
    if (positionId && !current.some((c) => c.positionId === positionId)) await db.insert(assignments).values({ personId, positionId, startDate: today });
    await db.insert(auditLog).values({ entity: "assignments", entityId: String(personId), action: "ASSIGN", after: { positionId }, userId: s.userId ?? null });
    refresh(); return { ok: "Atama güncellendi." };
  } catch (e) { return fail(e); }
}
export async function deactivatePersonAction(personId: number): Promise<ActionState> {
  try {
    const s = await admin();
    const today = new Date().toISOString().slice(0, 10);
    await db.update(assignments).set({ endDate: today }).where(and(eq(assignments.personId, personId), isNull(assignments.endDate)));
    await db.update(people).set({ active: false }).where(eq(people.id, personId));
    await db.update(users).set({ active: false }).where(eq(users.personId, personId));
    await db.insert(auditLog).values({ entity: "people", entityId: String(personId), action: "DEACTIVATE", userId: s.userId ?? null });
    refresh(); return { ok: "Kişi pasifleştirildi (kayıtlar korunur)." };
  } catch (e) { return fail(e); }
}

// ---------- Kullanıcılar
const userSchema = z.object({
  personId: z.coerce.number().int().positive(), email: z.string().trim().email(), password: z.string().min(8, "Şifre en az 8 karakter"),
  role: z.enum(["CALISAN", "YONETICI", "UST_DOGRULAYICI", "IK_ADMIN"]), scopeOrgUnitId: z.coerce.number().int().positive().optional(),
});
export async function createUserAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const d = userSchema.parse({ personId: fd.get("personId"), email: fd.get("email"), password: fd.get("password"), role: fd.get("role"), scopeOrgUnitId: fd.get("scopeOrgUnitId") || undefined });
    const dup = await db.query.users.findFirst({ where: eq(users.email, d.email.toLowerCase()) });
    if (dup) return { error: "Bu e-posta ile kullanıcı var." };
    const [u] = await db.insert(users).values({ personId: d.personId, email: d.email.toLowerCase(), passwordHash: await bcrypt.hash(d.password, 10) }).returning();
    await db.insert(userRoles).values({ userId: u.id, role: d.role, scopeOrgUnitId: d.role === "IK_ADMIN" ? null : d.scopeOrgUnitId ?? null });
    await db.insert(auditLog).values({ entity: "users", entityId: String(u.id), action: "CREATE", after: { email: u.email, role: d.role }, userId: s.userId ?? null });
    refresh(); return { ok: `Kullanıcı oluşturuldu: ${u.email}` };
  } catch (e) { return fail(e); }
}
export async function toggleUserAction(userId: number, active: boolean): Promise<ActionState> {
  try {
    const s = await admin();
    if (s.userId === userId && !active) return { error: "Kendi hesabınızı pasifleştiremezsiniz." };
    await db.update(users).set({ active }).where(eq(users.id, userId));
    await db.insert(auditLog).values({ entity: "users", entityId: String(userId), action: active ? "ACTIVATE" : "DEACTIVATE", userId: s.userId ?? null });
    refresh(); return { ok: active ? "Kullanıcı aktif." : "Kullanıcı pasif." };
  } catch (e) { return fail(e); }
}

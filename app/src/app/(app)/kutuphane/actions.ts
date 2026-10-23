"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { canActivate, type LevelSummary } from "@/domain/indicatorLint";

const { competencies, indicators, levelAnchors, auditLog } = schema;

async function requireAdmin() {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN")) throw new Error("Bu işlem için İK admin yetkisi gerekir.");
  return s;
}

const competencySchema = z.object({
  code: z.string().trim().min(2).max(30).regex(/^[A-Z0-9-]+$/i, "Kod yalnızca harf, rakam ve tire içerebilir"),
  name: z.string().trim().min(3).max(80),
  kind: z.enum(["TEKNIK", "DAVRANISSAL"]),
  subKind: z.enum(["CEKIRDEK", "LIDERLIK", "YAZILIM_ARAC", "MEVZUAT_STANDART", "SUREC_METODOLOJI", "URUN_ALAN", "EKIPMAN_ISLEM", "DIL"]).nullable(),
  definition: z.string().trim().max(600),
  boundaryNote: z.string().trim().max(400).nullable(),
  futureTrend: z.enum(["YUKSELEN", "STABIL", "AZALAN"]),
  defaultCriticality: z.coerce.number().int().min(1).max(3),
  ownerOrgUnitId: z.coerce.number().int().positive().nullable(),
});

function parseCompetency(fd: FormData) {
  return competencySchema.parse({
    code: fd.get("code"), name: fd.get("name"), kind: fd.get("kind"),
    subKind: fd.get("subKind") || null, definition: fd.get("definition") ?? "", boundaryNote: fd.get("boundaryNote") || null,
    futureTrend: fd.get("futureTrend") ?? "STABIL", defaultCriticality: fd.get("defaultCriticality") ?? 2,
    ownerOrgUnitId: fd.get("ownerOrgUnitId") || null,
  });
}

export type ActionState = { error?: string; ok?: string } | undefined;

export async function createCompetencyAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const s = await requireAdmin();
  let data: z.infer<typeof competencySchema>;
  try { data = parseCompetency(fd); } catch (e) { return { error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : String(e) }; }
  const dup = await db.select({ id: competencies.id }).from(competencies).where(eq(competencies.code, data.code.toUpperCase()));
  if (dup.length) return { error: `Bu kod zaten var: ${data.code}` };
  const [c] = await db.insert(competencies).values({ ...data, code: data.code.toUpperCase(), createdBy: s.userId ?? null }).returning({ id: competencies.id });
  await db.insert(levelAnchors).values([1, 2, 3, 4, 5].map((level) => ({ competencyId: c.id, level, anchorText: "" })));
  await db.insert(auditLog).values({ entity: "competencies", entityId: String(c.id), action: "CREATE", after: data, userId: s.userId ?? null });
  revalidatePath("/kutuphane");
  redirect(`/kutuphane/${c.id}`);
}

export async function updateCompetencyAction(id: number, _p: ActionState, fd: FormData): Promise<ActionState> {
  const s = await requireAdmin();
  const current = await db.query.competencies.findFirst({ where: eq(competencies.id, id) });
  if (!current) return { error: "Yetkinlik bulunamadı." };
  if (current.status === "EMEKLI") return { error: "Emekli yetkinlik düzenlenemez." };
  let data: z.infer<typeof competencySchema>;
  try { data = parseCompetency(fd); } catch (e) { return { error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : String(e) }; }
  await db.update(competencies).set({ ...data, code: data.code.toUpperCase(), updatedAt: new Date() }).where(eq(competencies.id, id));
  await db.insert(auditLog).values({ entity: "competencies", entityId: String(id), action: "UPDATE", before: current, after: data, userId: s.userId ?? null });
  revalidatePath(`/kutuphane/${id}`); revalidatePath("/kutuphane");
  return { ok: "Kaydedildi." };
}

export async function saveAnchorAction(competencyId: number, level: number, text: string) {
  await requireAdmin();
  await db.insert(levelAnchors).values({ competencyId, level, anchorText: text })
    .onConflictDoUpdate({ target: [levelAnchors.competencyId, levelAnchors.level], set: { anchorText: text } });
  revalidatePath(`/kutuphane/${competencyId}`);
}

const indicatorSchema = z.object({
  level: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(5).max(300),
  mandatory: z.boolean(),
  evidenceTypeCodes: z.array(z.string()).min(1, "En az bir kanıt türü seçin"),
  validityMonths: z.coerce.number().int().min(1).max(120),
});

export async function upsertIndicatorAction(competencyId: number, indicatorId: number | null, _p: ActionState, fd: FormData): Promise<ActionState> {
  const s = await requireAdmin();
  const comp = await db.query.competencies.findFirst({ where: eq(competencies.id, competencyId) });
  if (!comp || comp.status === "EMEKLI") return { error: "Yetkinlik düzenlenemez." };
  let data: z.infer<typeof indicatorSchema>;
  try {
    data = indicatorSchema.parse({ level: fd.get("level"), text: fd.get("text"), mandatory: fd.get("mandatory") === "on", evidenceTypeCodes: fd.getAll("evidenceTypeCodes").map(String), validityMonths: fd.get("validityMonths") ?? 24 });
  } catch (e) { return { error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : String(e) }; }
  if (indicatorId) {
    await db.update(indicators).set(data).where(and(eq(indicators.id, indicatorId), eq(indicators.competencyId, competencyId)));
  } else {
    const siblings = await db.select({ o: indicators.sortOrder }).from(indicators).where(and(eq(indicators.competencyId, competencyId), eq(indicators.level, data.level)));
    await db.insert(indicators).values({ ...data, competencyId, sortOrder: siblings.length + 1 });
  }
  await db.insert(auditLog).values({ entity: "indicators", entityId: String(indicatorId ?? "new"), action: indicatorId ? "UPDATE" : "CREATE", after: data, userId: s.userId ?? null });
  revalidatePath(`/kutuphane/${competencyId}`);
  return { ok: "Gösterge kaydedildi." };
}

export async function deleteIndicatorAction(competencyId: number, indicatorId: number) {
  const s = await requireAdmin();
  await db.delete(indicators).where(and(eq(indicators.id, indicatorId), eq(indicators.competencyId, competencyId)));
  await db.insert(auditLog).values({ entity: "indicators", entityId: String(indicatorId), action: "DELETE", userId: s.userId ?? null });
  revalidatePath(`/kutuphane/${competencyId}`);
}

export async function changeStatusAction(competencyId: number, target: "TASLAK" | "INCELEMEDE" | "AKTIF" | "EMEKLI"): Promise<ActionState> {
  const s = await requireAdmin();
  const comp = await db.query.competencies.findFirst({ where: eq(competencies.id, competencyId), with: { indicators: true } });
  if (!comp) return { error: "Bulunamadı." };
  const allowed: Record<string, string[]> = { TASLAK: ["INCELEMEDE"], INCELEMEDE: ["TASLAK", "AKTIF"], AKTIF: ["EMEKLI"], EMEKLI: [] };
  if (!allowed[comp.status].includes(target)) return { error: `${comp.status} durumundan ${target} durumuna geçilemez.` };
  if (target === "AKTIF") {
    const levels: LevelSummary[] = [1, 2, 3, 4, 5].map((l) => ({ level: l, count: comp.indicators.filter((i) => i.level === l && i.active).length, mandatory: comp.indicators.filter((i) => i.level === l && i.active && i.mandatory).length }));
    if (!canActivate(levels)) return { error: "Aktifleştirme için her seviyede en az 3 gösterge ve en az 1 zorunlu gösterge gerekir." };
    if (!comp.definition.trim()) return { error: "Tanım boş olamaz." };
  }
  await db.update(competencies).set({ status: target, approvedBy: target === "AKTIF" ? s.userId ?? null : comp.approvedBy, updatedAt: new Date() }).where(eq(competencies.id, competencyId));
  await db.insert(auditLog).values({ entity: "competencies", entityId: String(competencyId), action: `STATUS_${target}`, before: { status: comp.status }, after: { status: target }, userId: s.userId ?? null });
  revalidatePath(`/kutuphane/${competencyId}`); revalidatePath("/kutuphane");
  return { ok: `Durum: ${target}` };
}

/** Aktif yetkinlikte anlam değişikliği: yeni sürüm oluştur (eski Emekli olur). */
export async function newVersionAction(competencyId: number): Promise<ActionState> {
  const s = await requireAdmin();
  const comp = await db.query.competencies.findFirst({ where: eq(competencies.id, competencyId), with: { indicators: true, anchors: true } });
  if (!comp || comp.status !== "AKTIF") return { error: "Yalnızca Aktif yetkinlikten yeni sürüm açılır." };
  let newId = 0;
  await db.transaction(async (tx) => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = comp;
    void _id; void _c; void _u;
    const [n] = await tx.insert(competencies).values({ ...rest, version: comp.version + 1, previousVersionId: comp.id, status: "TASLAK", approvedBy: null, createdBy: s.userId ?? null }).returning({ id: competencies.id });
    newId = n.id;
    if (comp.anchors.length) await tx.insert(levelAnchors).values(comp.anchors.map((a) => ({ competencyId: n.id, level: a.level, anchorText: a.anchorText })));
    if (comp.indicators.length) await tx.insert(indicators).values(comp.indicators.map(({ id: _i, ...ind }) => { void _i; return { ...ind, competencyId: n.id }; }));
    await tx.update(competencies).set({ status: "EMEKLI", updatedAt: new Date() }).where(eq(competencies.id, comp.id));
    await tx.insert(auditLog).values({ entity: "competencies", entityId: String(comp.id), action: "NEW_VERSION", after: { newId: n.id, version: comp.version + 1 }, userId: s.userId ?? null });
  });
  revalidatePath("/kutuphane");
  redirect(`/kutuphane/${newId}`);
}

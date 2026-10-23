"use server";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { loadOrgContext, managerOf } from "@/lib/org";

const { evidence, evidenceIndicators, auditLog, indicators } = schema;
export type ActionState = { error?: string; ok?: string } | undefined;
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE = 10 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/png", "image/jpeg", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain"];
const fail = (e: unknown): ActionState => ({ error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : e instanceof Error ? e.message : "Hata" });
const refresh = () => ["/kanit", "/kanit/ekip", "/degerlendirme", "/degerlendirme/ekip"].forEach((p) => revalidatePath(p));

const evidenceSchema = z.object({
  typeCode: z.string().min(1, "Kanıt türü seçin"),
  whatIDid: z.string().trim().min(15, "Ne yaptığınızı en az 15 karakterle, geçmiş zamanda yazın").max(600),
  startDate: z.string().optional(), endDate: z.string().min(1, "Bitiş tarihi zorunlu"),
  result: z.string().trim().max(400).optional(), verifier: z.string().trim().max(120).optional(),
  link: z.string().trim().url("Geçerli bir bağlantı girin").optional().or(z.literal("")),
  indicatorIds: z.array(z.coerce.number().int().positive()).min(1, "En az bir gösterge seçin"),
});

async function saveFile(file: File | null): Promise<{ fileName: string; filePath: string; fileMime: string; fileSize: number } | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_FILE) throw new Error("Dosya 10 MB'ı aşamaz.");
  if (!ALLOWED.includes(file.type)) throw new Error("Desteklenmeyen dosya türü (PDF, PNG, JPG, DOCX, XLSX, PPTX, TXT).");
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}${path.extname(file.name).toLowerCase().slice(0, 10)}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { fileName: file.name.slice(0, 200), filePath: name, fileMime: file.type, fileSize: file.size };
}

/** Çalışan kendi kanıtını ekler (taslak veya sunuldu). */
export async function addEvidenceAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await requireUser();
    if (!s.personId) return { error: "Hesabınız bir kişiye bağlı değil." };
    const d = evidenceSchema.parse({ typeCode: fd.get("typeCode"), whatIDid: fd.get("whatIDid"), startDate: fd.get("startDate") || undefined, endDate: fd.get("endDate"),
      result: fd.get("result") || undefined, verifier: fd.get("verifier") || undefined, link: fd.get("link") || "", indicatorIds: fd.getAll("indicatorIds") });
    if (new Date(d.endDate) > new Date()) return { error: "Bitiş tarihi gelecekte olamaz; kanıt yapılmış bir işi anlatır." };
    const file = await saveFile(fd.get("file") as File | null);
    const submit = fd.get("mode") === "submit";
    const [e] = await db.insert(evidence).values({ personId: s.personId, typeCode: d.typeCode, whatIDid: d.whatIDid, startDate: d.startDate ?? null, endDate: d.endDate, result: d.result ?? null,
      verifier: d.verifier ?? null, link: d.link || null, ...(file ?? {}), status: submit ? "SUNULDU" : "TASLAK", createdByPersonId: s.personId }).returning();
    const valid = await db.select({ id: indicators.id }).from(indicators).where(inArray(indicators.id, d.indicatorIds));
    await db.insert(evidenceIndicators).values(valid.map((v) => ({ evidenceId: e.id, indicatorId: v.id })));
    await db.insert(auditLog).values({ entity: "evidence", entityId: String(e.id), action: submit ? "SUBMIT" : "DRAFT", after: { indicators: valid.length }, userId: s.userId ?? null });
    refresh(); return { ok: submit ? "Kanıt sunuldu; yöneticiniz inceleyecek." : "Taslak kaydedildi." };
  } catch (e) { return fail(e); }
}

export async function submitEvidenceAction(id: number): Promise<ActionState> {
  try {
    const s = await requireUser();
    const e = await db.query.evidence.findFirst({ where: eq(evidence.id, id) });
    if (!e || e.personId !== s.personId) return { error: "Kanıt bulunamadı." };
    if (!["TASLAK", "EK_BILGI"].includes(e.status)) return { error: "Bu durumda sunulamaz." };
    await db.update(evidence).set({ status: "SUNULDU", updatedAt: new Date() }).where(eq(evidence.id, id));
    refresh(); return { ok: "Sunuldu." };
  } catch (e) { return fail(e); }
}

export async function updateEvidenceTextAction(id: number, whatIDid: string, result: string): Promise<ActionState> {
  try {
    const s = await requireUser();
    const e = await db.query.evidence.findFirst({ where: eq(evidence.id, id) });
    if (!e || e.personId !== s.personId) return { error: "Kanıt bulunamadı." };
    if (!["TASLAK", "EK_BILGI"].includes(e.status)) return { error: "Yalnızca taslak veya ek bilgi istenen kanıt düzenlenir." };
    const w = z.string().trim().min(15).max(600).parse(whatIDid);
    await db.update(evidence).set({ whatIDid: w, result: result.trim() || null, updatedAt: new Date() }).where(eq(evidence.id, id));
    refresh(); return { ok: "Güncellendi." };
  } catch (e) { return fail(e); }
}

export async function deleteEvidenceAction(id: number): Promise<ActionState> {
  try {
    const s = await requireUser();
    const e = await db.query.evidence.findFirst({ where: eq(evidence.id, id) });
    if (!e || e.personId !== s.personId) return { error: "Kanıt bulunamadı." };
    if (e.status === "KABUL") return { error: "Kabul edilmiş kanıt silinemez." };
    if (e.filePath) await unlink(path.join(UPLOAD_DIR, e.filePath)).catch(() => undefined);
    await db.delete(evidence).where(eq(evidence.id, id));
    await db.insert(auditLog).values({ entity: "evidence", entityId: String(id), action: "DELETE", userId: s.userId ?? null });
    refresh(); return { ok: "Silindi." };
  } catch (e) { return fail(e); }
}

async function canDecide(personId: number): Promise<{ ok: boolean; deciderPersonId: number | null; userId: number | null }> {
  const s = await requireUser();
  if (hasRole(s, "IK_ADMIN")) return { ok: true, deciderPersonId: s.personId ?? null, userId: s.userId ?? null };
  if (!s.personId) return { ok: false, deciderPersonId: null, userId: s.userId ?? null };
  const ctx = await loadOrgContext();
  return { ok: managerOf(ctx, personId) === s.personId, deciderPersonId: s.personId, userId: s.userId ?? null };
}

/** Yönetici kararı: Kabul / Ek bilgi / Red (gerekçe zorunlu). */
export async function decideEvidenceAction(id: number, decision: "KABUL" | "EK_BILGI" | "RED", note: string): Promise<ActionState> {
  try {
    const e = await db.query.evidence.findFirst({ where: eq(evidence.id, id) });
    if (!e) return { error: "Kanıt bulunamadı." };
    const c = await canDecide(e.personId);
    if (!c.ok) return { error: "Bu kanıt için karar yetkiniz yok (kişinin yöneticisi veya İK admin olmalı)." };
    if (e.status !== "SUNULDU" && !(e.status === "KABUL" && decision !== "KABUL")) return { error: "Yalnızca sunulmuş kanıt karara bağlanır." };
    if (decision !== "KABUL" && note.trim().length < 5) return { error: "Ek bilgi veya red için gerekçe zorunludur (kanıt kalitesi kılavuzu)." };
    await db.update(evidence).set({ status: decision, managerNote: note.trim() || null, decidedBy: c.deciderPersonId, decidedAt: new Date(), updatedAt: new Date() }).where(eq(evidence.id, id));
    await db.insert(auditLog).values({ entity: "evidence", entityId: String(id), action: `DECIDE_${decision}`, before: { status: e.status }, after: { status: decision, note }, userId: c.userId });
    refresh(); return { ok: `Karar: ${decision}` };
  } catch (e) { return fail(e); }
}

/** Yönetici gözlem notu: ekip üyesi için doğrudan kabul edilmiş kanıt. */
export async function addObservationAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const personId = z.coerce.number().int().positive().parse(fd.get("personId"));
    const c = await canDecide(personId);
    if (!c.ok || !c.deciderPersonId) return { error: "Gözlem notu için kişinin yöneticisi olmalısınız." };
    const d = z.object({ whatIDid: z.string().trim().min(15, "Gözlemi tarihli ve somut yazın (en az 15 karakter)").max(600), endDate: z.string().min(1), result: z.string().trim().max(400).optional(), indicatorIds: z.array(z.coerce.number().int().positive()).min(1, "En az bir gösterge seçin") })
      .parse({ whatIDid: fd.get("whatIDid"), endDate: fd.get("endDate"), result: fd.get("result") || undefined, indicatorIds: fd.getAll("indicatorIds") });
    const [e] = await db.insert(evidence).values({ personId, typeCode: "GOZLEM_NOTU", whatIDid: d.whatIDid, endDate: d.endDate, result: d.result ?? null, isObservation: true, status: "KABUL",
      decidedBy: c.deciderPersonId, decidedAt: new Date(), createdByPersonId: c.deciderPersonId }).returning();
    await db.insert(evidenceIndicators).values(d.indicatorIds.map((i) => ({ evidenceId: e.id, indicatorId: i })));
    await db.insert(auditLog).values({ entity: "evidence", entityId: String(e.id), action: "OBSERVATION", userId: c.userId });
    refresh(); return { ok: "Gözlem notu eklendi (kabul edilmiş kanıt)." };
  } catch (e) { return fail(e); }
}

export async function linkEvidenceIndicatorsAction(id: number, indicatorIds: number[]): Promise<ActionState> {
  try {
    const s = await requireUser();
    const e = await db.query.evidence.findFirst({ where: eq(evidence.id, id) });
    if (!e || e.personId !== s.personId) return { error: "Kanıt bulunamadı." };
    if (e.status === "KABUL") return { error: "Kabul edilmiş kanıtın gösterge bağları değiştirilemez." };
    await db.delete(evidenceIndicators).where(eq(evidenceIndicators.evidenceId, id));
    if (indicatorIds.length) await db.insert(evidenceIndicators).values(indicatorIds.map((i) => ({ evidenceId: id, indicatorId: i })));
    refresh(); return { ok: "Gösterge bağları güncellendi." };
  } catch (e) { return fail(e); }
}

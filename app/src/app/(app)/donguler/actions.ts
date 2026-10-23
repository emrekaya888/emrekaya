"use server";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { loadOrgContext, managerOf } from "@/lib/org";
import { assessmentView } from "@/lib/cycle";
import { clampAgreedLevel, gap } from "@/domain/level";

const { cycles, assessments, assessmentLines, roleProfiles, auditLog } = schema;
export type ActionState = { error?: string; ok?: string } | undefined;
const fail = (e: unknown): ActionState => ({ error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : e instanceof Error ? e.message : "Hata" });
const refresh = () => ["/donguler", "/degerlendirme", "/degerlendirme/ekip", "/degerlendirme/ust", "/asamalar", "/", "/raporlar"].forEach((p) => revalidatePath(p));
async function admin() { const s = await requireUser(); if (!hasRole(s, "IK_ADMIN")) throw new Error("İK admin yetkisi gerekir."); return s; }

export async function createCycleAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const s = await admin();
    const d = z.object({ name: z.string().trim().min(3), type: z.enum(["ANA", "ARA", "ISE_GIRIS"]), selfDeadline: z.string().optional(), managerDeadline: z.string().optional(), agreementDeadline: z.string().optional() })
      .parse({ name: fd.get("name"), type: fd.get("type") ?? "ANA", selfDeadline: fd.get("selfDeadline") || undefined, managerDeadline: fd.get("managerDeadline") || undefined, agreementDeadline: fd.get("agreementDeadline") || undefined });
    const open = await db.select({ id: cycles.id }).from(cycles).where(sql`${cycles.status} <> 'KILITLI'`);
    if (open.length) return { error: "Kilitlenmemiş bir döngü zaten var; önce onu kilitleyin." };
    const [c] = await db.insert(cycles).values({ ...d, selfDeadline: d.selfDeadline ?? null, managerDeadline: d.managerDeadline ?? null, agreementDeadline: d.agreementDeadline ?? null, createdBy: s.userId ?? null }).returning();
    await db.insert(auditLog).values({ entity: "cycles", entityId: String(c.id), action: "CREATE", after: d, userId: s.userId ?? null });
    refresh(); return { ok: `${c.name} oluşturuldu (hazırlık).` };
  } catch (e) { return fail(e); }
}

/** Döngüyü açar: profilli role sahip tüm aktif kişiler için değerlendirme ve satırlar üretir. */
export async function openCycleAction(cycleId: number): Promise<ActionState> {
  try {
    const s = await admin();
    const c = await db.query.cycles.findFirst({ where: eq(cycles.id, cycleId) });
    if (!c || c.status !== "HAZIRLIK") return { error: "Yalnızca hazırlıktaki döngü açılır." };
    const ctx = await loadOrgContext();
    const profiles = await db.select().from(roleProfiles);
    const byRole = new Map<number, typeof profiles>();
    profiles.forEach((p) => byRole.set(p.roleId, [...(byRole.get(p.roleId) ?? []), p]));
    let created = 0, skipped = 0;
    await db.transaction(async (tx) => {
      for (const [pid, roleId] of ctx.personRole) {
        const rows = byRole.get(roleId);
        if (!rows?.length) { skipped++; continue; }
        const [a] = await tx.insert(assessments).values({ cycleId, personId: pid, positionId: ctx.personPosition.get(pid) ?? null, roleId, managerPersonId: managerOf(ctx, pid) }).returning();
        await tx.insert(assessmentLines).values(rows.map((r) => ({ assessmentId: a.id, competencyId: r.competencyId, targetLevel: r.targetLevel, weight: r.weight, mandatory: r.mandatory })));
        created++;
      }
      await tx.update(cycles).set({ status: "OZ_BEYAN", openedAt: new Date() }).where(eq(cycles.id, cycleId));
      await tx.insert(auditLog).values({ entity: "cycles", entityId: String(cycleId), action: "OPEN", after: { created, skipped }, userId: s.userId ?? null });
    });
    refresh(); return { ok: `Döngü açıldı: ${created} değerlendirme oluşturuldu${skipped ? `, ${skipped} kişi profilsiz rol nedeniyle atlandı` : ""}.` };
  } catch (e) { return fail(e); }
}

export async function advanceCycleAction(cycleId: number, target: "YONETICI" | "MUTABAKAT" | "KALIBRASYON"): Promise<ActionState> {
  try {
    const s = await admin();
    const c = await db.query.cycles.findFirst({ where: eq(cycles.id, cycleId) });
    if (!c) return { error: "Döngü yok." };
    const order = ["HAZIRLIK", "OZ_BEYAN", "YONETICI", "MUTABAKAT", "KALIBRASYON", "KILITLI"];
    if (order.indexOf(target) !== order.indexOf(c.status) + 1) return { error: `${c.status} → ${target} geçişi sıralı değil.` };
    await db.update(cycles).set({ status: target }).where(eq(cycles.id, cycleId));
    await db.insert(auditLog).values({ entity: "cycles", entityId: String(cycleId), action: `PHASE_${target}`, userId: s.userId ?? null });
    refresh(); return { ok: `Aşama: ${target}` };
  } catch (e) { return fail(e); }
}

/** Kilit: satırlardaki kanıtlanmış/mutabık seviyeler dondurulur, metrikler anlık görüntüye yazılır. */
export async function lockCycleAction(cycleId: number): Promise<ActionState> {
  try {
    const s = await admin();
    const c = await db.query.cycles.findFirst({ where: eq(cycles.id, cycleId) });
    if (!c || c.status !== "KALIBRASYON") return { error: "Kilit için döngü kalibrasyon aşamasında olmalı." };
    const as = await db.select().from(assessments).where(eq(assessments.cycleId, cycleId));
    let lines = 0, agreed = 0, selfSum = 0, selfN = 0, appeals = 0;
    await db.transaction(async (tx) => {
      for (const a of as) {
        const v = await assessmentView(a.id);
        if (!v) continue;
        for (const l of v.lines) {
          const proven = l.provenLevel;
          const agreedLevel = l.agreedLevel != null ? clampAgreedLevel(l.agreedLevel, proven) : proven;
          await tx.update(assessmentLines).set({ provenLevel: proven, agreedLevel, nextProgress: Math.round(l.nextLevelProgress * 100), level5Candidate: l.level5Candidate }).where(eq(assessmentLines.id, l.lineId));
          lines++; if (l.agreedLevel != null) agreed++; if (l.selfLevel != null) { selfSum += l.selfLevel - proven; selfN++; } if (l.appealFlag || l.appealDecision) appeals++;
        }
        await tx.update(assessments).set({ status: "KILITLI", finalizedAt: a.finalizedAt ?? new Date() }).where(eq(assessments.id, a.id));
      }
      const metrics = { lockedAt: new Date().toISOString(), assessments: as.length, lines, agreedRatio: lines ? agreed / lines : 0, selfMinusProven: selfN ? selfSum / selfN : 0, appeals, appealRatio: lines ? appeals / lines : 0 };
      await tx.update(cycles).set({ status: "KILITLI", lockedAt: new Date(), metrics }).where(eq(cycles.id, cycleId));
      await tx.insert(auditLog).values({ entity: "cycles", entityId: String(cycleId), action: "LOCK", after: metrics, userId: s.userId ?? null });
    });
    refresh(); return { ok: "Döngü kilitlendi; anlık görüntü alındı." };
  } catch (e) { return fail(e); }
}

// ---------- Çalışan
export async function completeSelfAction(assessmentId: number): Promise<ActionState> {
  try {
    const s = await requireUser();
    const v = await assessmentView(assessmentId);
    if (!v || v.assessment.personId !== s.personId) return { error: "Değerlendirme bulunamadı." };
    if (v.assessment.cycle.status !== "OZ_BEYAN" && v.assessment.cycle.status !== "YONETICI") return { error: "Öz-beyan aşaması kapalı." };
    if (v.assessment.status !== "ACILDI") return { error: "Öz-beyan zaten tamamlanmış." };
    await db.transaction(async (tx) => {
      for (const l of v.lines) await tx.update(assessmentLines).set({ selfLevel: l.claimedLevel }).where(eq(assessmentLines.id, l.lineId));
      await tx.update(assessments).set({ status: "OZ_BEYAN_TAMAM", selfCompletedAt: new Date() }).where(eq(assessments.id, assessmentId));
      await tx.insert(auditLog).values({ entity: "assessments", entityId: String(assessmentId), action: "SELF_COMPLETE", userId: s.userId ?? null });
    });
    refresh(); return { ok: "Öz-beyan tamamlandı. Yöneticiniz kanıtları doğrulayacak." };
  } catch (e) { return fail(e); }
}

export async function employeeRespondAction(assessmentId: number, decision: "ONAY" | "ITIRAZ", appeals: { lineId: number; reason: string }[]): Promise<ActionState> {
  try {
    const s = await requireUser();
    const v = await assessmentView(assessmentId);
    if (!v || v.assessment.personId !== s.personId) return { error: "Değerlendirme bulunamadı." };
    if (v.assessment.status !== "MUTABAKATTA") return { error: "Mutabakat aşamasında değil." };
    if (decision === "ITIRAZ") {
      const valid = appeals.filter((a) => a.reason.trim().length >= 10);
      if (!valid.length) return { error: "İtiraz için en az bir satırda gerekçe (≥ 10 karakter) yazın." };
      await db.transaction(async (tx) => {
        for (const a of valid) await tx.update(assessmentLines).set({ appealFlag: true, appealReason: a.reason.trim() }).where(and(eq(assessmentLines.id, a.lineId), eq(assessmentLines.assessmentId, assessmentId)));
        await tx.update(assessments).set({ status: "ITIRAZDA" }).where(eq(assessments.id, assessmentId));
        await tx.insert(auditLog).values({ entity: "assessments", entityId: String(assessmentId), action: "APPEAL", after: { lines: valid.length }, userId: s.userId ?? null });
      });
      refresh(); return { ok: `${valid.length} satır için itiraz iletildi; grup müdürü karar verecek.` };
    }
    await db.update(assessments).set({ status: "KESINLESTI", employeeApprovedAt: new Date(), finalizedAt: new Date() }).where(eq(assessments.id, assessmentId));
    await db.insert(auditLog).values({ entity: "assessments", entityId: String(assessmentId), action: "EMPLOYEE_APPROVE", userId: s.userId ?? null });
    refresh(); return { ok: "Mutabakat onaylandı; değerlendirme kesinleşti." };
  } catch (e) { return fail(e); }
}

// ---------- Yönetici
async function managerOrAdmin(assessmentId: number) {
  const s = await requireUser();
  const v = await assessmentView(assessmentId);
  if (!v) throw new Error("Değerlendirme bulunamadı.");
  if (!hasRole(s, "IK_ADMIN") && v.assessment.managerPersonId !== s.personId) throw new Error("Bu değerlendirme için yönetici yetkiniz yok.");
  return { s, v };
}

export async function completeManagerAction(assessmentId: number): Promise<ActionState> {
  try {
    const { s, v } = await managerOrAdmin(assessmentId);
    if (!["OZ_BEYAN_TAMAM", "ACILDI"].includes(v.assessment.status)) return { error: "Bu durumda doğrulama tamamlanamaz." };
    const pending = v.lines.reduce((a, l) => a + l.indicators.reduce((b, i) => b + i.pendingCount, 0), 0);
    if (pending > 0) return { error: `${pending} gösterge için bekleyen kanıt var; önce Ekibimin kanıtları sayfasında karara bağlayın.` };
    const needsL5 = v.lines.some((l) => l.level5Candidate && l.level5Validated == null);
    await db.transaction(async (tx) => {
      for (const l of v.lines) {
        const meeting = Math.abs((l.selfLevel ?? l.claimedLevel) - l.provenLevel) >= 2 || l.rejectedMandatory;
        await tx.update(assessmentLines).set({ provenLevel: l.provenLevel, nextProgress: Math.round(l.nextLevelProgress * 100), level5Candidate: l.level5Candidate, rejectedMandatory: l.rejectedMandatory, meetingRequired: meeting, selfLevel: l.selfLevel ?? l.claimedLevel }).where(eq(assessmentLines.id, l.lineId));
      }
      await tx.update(assessments).set({ status: needsL5 ? "UST_DOGRULAMADA" : "YONETICI_TAMAM", managerCompletedAt: new Date() }).where(eq(assessments.id, assessmentId));
      await tx.insert(auditLog).values({ entity: "assessments", entityId: String(assessmentId), action: "MANAGER_COMPLETE", after: { needsL5 }, userId: s.userId ?? null });
    });
    refresh(); return { ok: needsL5 ? "Doğrulama tamamlandı; seviye 5 iddiası üst doğrulamaya gitti." : "Doğrulama tamamlandı." };
  } catch (e) { return fail(e); }
}

export async function sendAgreementAction(assessmentId: number, rows: { lineId: number; agreedLevel: number; note: string }[], meetingNote: string): Promise<ActionState> {
  try {
    const { s, v } = await managerOrAdmin(assessmentId);
    if (v.assessment.cycle.status !== "MUTABAKAT" && v.assessment.cycle.status !== "YONETICI") return { error: "Mutabakat aşaması açık değil." };
    if (!["YONETICI_TAMAM", "MUTABAKATTA", "ITIRAZDA"].includes(v.assessment.status)) return { error: "Önce doğrulamayı tamamlayın (seviye 5 üst onayı bekliyorsa onu)." };
    const anyMeeting = v.lines.some((l) => l.meetingRequired);
    if (anyMeeting && meetingNote.trim().length < 10) return { error: "Görüşme zorunlu satırlar var; görüşme notu (≥ 10 karakter) yazın." };
    await db.transaction(async (tx) => {
      for (const r of rows) {
        const l = v.lines.find((x) => x.lineId === r.lineId); if (!l) continue;
        const agreed = clampAgreedLevel(r.agreedLevel, l.provenLevel);
        await tx.update(assessmentLines).set({ agreedLevel: agreed, managerNote: r.note.trim() || null, appealFlag: false, appealReason: null }).where(eq(assessmentLines.id, r.lineId));
      }
      await tx.update(assessments).set({ status: "MUTABAKATTA", meetingNote: meetingNote.trim() || null, agreementSentAt: new Date() }).where(eq(assessments.id, assessmentId));
      await tx.insert(auditLog).values({ entity: "assessments", entityId: String(assessmentId), action: "AGREEMENT_SENT", userId: s.userId ?? null });
    });
    refresh(); return { ok: "Mutabakat çalışana gönderildi; onay veya itiraz bekleniyor." };
  } catch (e) { return fail(e); }
}

// ---------- Üst doğrulayıcı
async function upper() { const s = await requireUser(); if (!hasRole(s, "IK_ADMIN", "UST_DOGRULAYICI")) throw new Error("Üst doğrulayıcı veya İK admin yetkisi gerekir."); return s; }

export async function validateLevel5Action(lineId: number, approve: boolean, note: string): Promise<ActionState> {
  try {
    const s = await upper();
    const l = await db.query.assessmentLines.findFirst({ where: eq(assessmentLines.id, lineId), with: { assessment: { with: { lines: true } } } });
    if (!l) return { error: "Satır yok." };
    if (!approve && note.trim().length < 5) return { error: "Red için gerekçe yazın." };
    await db.update(assessmentLines).set({ level5Validated: approve, level5ValidatedBy: s.personId ?? null, managerNote: note.trim() ? `[Üst doğrulama] ${note.trim()}` : l.managerNote }).where(eq(assessmentLines.id, lineId));
    const remaining = l.assessment.lines.filter((x) => x.id !== lineId && x.level5Candidate && x.level5Validated == null).length;
    if (remaining === 0 && l.assessment.status === "UST_DOGRULAMADA") await db.update(assessments).set({ status: "YONETICI_TAMAM" }).where(eq(assessments.id, l.assessmentId));
    await db.insert(auditLog).values({ entity: "assessment_lines", entityId: String(lineId), action: approve ? "L5_APPROVE" : "L5_REJECT", after: { note }, userId: s.userId ?? null });
    refresh(); return { ok: approve ? "Seviye 5 onaylandı." : "Seviye 5 reddedildi (mutabık en fazla 4)." };
  } catch (e) { return fail(e); }
}

export async function decideAppealAction(lineId: number, newAgreedLevel: number, note: string): Promise<ActionState> {
  try {
    const s = await upper();
    if (note.trim().length < 10) return { error: "İtiraz kararı gerekçeli olmalı (≥ 10 karakter): hangi kanıt nasıl değerlendirildi?" };
    const l = await db.query.assessmentLines.findFirst({ where: eq(assessmentLines.id, lineId), with: { assessment: { with: { lines: true } } } });
    if (!l || !l.appealFlag) return { error: "İtirazlı satır bulunamadı." };
    const v = await assessmentView(l.assessmentId);
    const live = v?.lines.find((x) => x.lineId === lineId);
    const agreed = clampAgreedLevel(newAgreedLevel, live?.provenLevel ?? l.provenLevel ?? 0);
    await db.update(assessmentLines).set({ agreedLevel: agreed, appealDecision: agreed === l.agreedLevel ? "KORUNDU" : "DEGISTI", appealDecidedBy: s.personId ?? null, appealNote: note.trim(), appealFlag: false }).where(eq(assessmentLines.id, lineId));
    const remaining = l.assessment.lines.filter((x) => x.id !== lineId && x.appealFlag).length;
    if (remaining === 0) await db.update(assessments).set({ status: "KESINLESTI", finalizedAt: new Date() }).where(eq(assessments.id, l.assessmentId));
    await db.insert(auditLog).values({ entity: "assessment_lines", entityId: String(lineId), action: "APPEAL_DECIDE", after: { agreed, note }, userId: s.userId ?? null });
    refresh(); return { ok: `Karar kaydedildi (mutabık ${agreed}).${remaining === 0 ? " Değerlendirme kesinleşti." : ""}` };
  } catch (e) { return fail(e); }
}

export { gap };

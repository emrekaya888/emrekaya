"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { loadOrgContext, managerOf } from "@/lib/org";
import { latestCycleId } from "@/lib/development";

const { developmentPlans, planActions, auditLog } = schema;
export type ActionState = { error?: string; ok?: string } | undefined;
const fail = (e: unknown): ActionState => ({ error: e instanceof z.ZodError ? e.issues.map((i) => i.message).join("; ") : e instanceof Error ? e.message : "Hata" });
const refresh = () => ["/gelisim", "/gelisim/ekip", "/asamalar", "/raporlar"].forEach((p) => revalidatePath(p));

async function ensurePlan(personId: number) {
  const cycleId = await latestCycleId();
  const existing = await db.query.developmentPlans.findFirst({ where: and(eq(developmentPlans.personId, personId), cycleId ? eq(developmentPlans.cycleId, cycleId) : undefined) });
  if (existing) return existing;
  const [p] = await db.insert(developmentPlans).values({ personId, cycleId }).returning();
  return p;
}

async function canEditPlan(personId: number) {
  const s = await requireUser();
  if (hasRole(s, "IK_ADMIN") || s.personId === personId) return s;
  const ctx = await loadOrgContext();
  if (s.personId && managerOf(ctx, personId) === s.personId) return s;
  throw new Error("Bu plan için yetkiniz yok.");
}

export async function addActionAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const personId = z.coerce.number().int().positive().parse(fd.get("personId"));
    const s = await canEditPlan(personId);
    const d = z.object({ competencyId: z.coerce.number().int().positive(), indicatorId: z.coerce.number().int().positive().optional(), currentLevel: z.coerce.number().int().min(0).max(5), targetLevel: z.coerce.number().int().min(1).max(5),
      priorityScore: z.coerce.number().int().min(0), actionType: z.enum(["ISBASINDA", "ILISKI", "EGITIM"]), description: z.string().trim().min(10, "Eylemi somut yazın: hangi göstergeyi hangi işle kanıtlayacaksınız?").max(400),
      mentorPersonId: z.coerce.number().int().positive().optional(), dueDate: z.string().optional() })
      .parse({ competencyId: fd.get("competencyId"), indicatorId: fd.get("indicatorId") || undefined, currentLevel: fd.get("currentLevel") ?? 0, targetLevel: fd.get("targetLevel") ?? 1, priorityScore: fd.get("priorityScore") ?? 0,
        actionType: fd.get("actionType") ?? "ISBASINDA", description: fd.get("description"), mentorPersonId: fd.get("mentorPersonId") || undefined, dueDate: fd.get("dueDate") || undefined });
    const plan = await ensurePlan(personId);
    if (plan.status === "TAMAMLANDI") return { error: "Tamamlanmış plana eylem eklenmez." };
    const [a] = await db.insert(planActions).values({ planId: plan.id, ...d, indicatorId: d.indicatorId ?? null, mentorPersonId: d.mentorPersonId ?? null, dueDate: d.dueDate ?? null }).returning();
    if (plan.status === "ONAYLI") await db.update(developmentPlans).set({ status: "DEVAM" }).where(eq(developmentPlans.id, plan.id));
    await db.insert(auditLog).values({ entity: "plan_actions", entityId: String(a.id), action: "CREATE", after: d, userId: s.userId ?? null });
    refresh(); return { ok: "Eylem eklendi." };
  } catch (e) { return fail(e); }
}

export async function updateActionAction(actionId: number, status: "PLANLANDI" | "DEVAM" | "TAMAMLANDI" | "IPTAL", progress: number): Promise<ActionState> {
  try {
    const a = await db.query.planActions.findFirst({ where: eq(planActions.id, actionId), with: { plan: true } });
    if (!a) return { error: "Eylem yok." };
    const s = await canEditPlan(a.plan.personId);
    await db.update(planActions).set({ status, progress: status === "TAMAMLANDI" ? 100 : Math.max(0, Math.min(100, progress)) }).where(eq(planActions.id, actionId));
    await db.insert(auditLog).values({ entity: "plan_actions", entityId: String(actionId), action: `STATUS_${status}`, userId: s.userId ?? null });
    refresh(); return { ok: status === "TAMAMLANDI" ? "Tamamlandı. Kanıtını kanıt kasasına ekleyin; ara döngüde yeniden değerlendirilir." : "Güncellendi." };
  } catch (e) { return fail(e); }
}

export async function deleteActionAction(actionId: number): Promise<ActionState> {
  try {
    const a = await db.query.planActions.findFirst({ where: eq(planActions.id, actionId), with: { plan: true } });
    if (!a) return { error: "Eylem yok." };
    const s = await canEditPlan(a.plan.personId);
    await db.delete(planActions).where(eq(planActions.id, actionId));
    await db.insert(auditLog).values({ entity: "plan_actions", entityId: String(actionId), action: "DELETE", userId: s.userId ?? null });
    refresh(); return { ok: "Silindi." };
  } catch (e) { return fail(e); }
}

/** Yönetici planı onaylar: kaynak (görev, proje) taahhüdü anlamına gelir. */
export async function approvePlanAction(planId: number): Promise<ActionState> {
  try {
    const s = await requireUser();
    const p = await db.query.developmentPlans.findFirst({ where: eq(developmentPlans.id, planId), with: { actions: true } });
    if (!p) return { error: "Plan yok." };
    const ctx = await loadOrgContext();
    if (!hasRole(s, "IK_ADMIN") && managerOf(ctx, p.personId) !== s.personId) return { error: "Planı yalnızca kişinin yöneticisi onaylar." };
    if (p.actions.filter((a) => a.status !== "IPTAL").length === 0) return { error: "Eylemi olmayan plan onaylanamaz." };
    await db.update(developmentPlans).set({ status: "ONAYLI", approvedBy: s.personId ?? null, approvedAt: new Date() }).where(eq(developmentPlans.id, planId));
    await db.insert(auditLog).values({ entity: "development_plans", entityId: String(planId), action: "APPROVE", userId: s.userId ?? null });
    refresh(); return { ok: "Plan onaylandı." };
  } catch (e) { return fail(e); }
}

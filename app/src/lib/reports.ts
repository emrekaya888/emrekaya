/** Raporlar: ısı haritası, dağılım, bus factor, kalite metrikleri, kalibrasyon bayrakları (01 §4.6, 13 §2, 13 §7). */
import { and, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { leniencyIndex } from "@/domain/analytics";
import { loadOrgContext, managerOf, type OrgContext } from "./org";

const { cycles, assessments, assessmentLines, competencies, evidence, developmentPlans, planActions } = schema;

export interface ReportLine { personId: number; unitId: number; competencyId: number; code: string; name: string; kind: string; target: number; self: number | null; proven: number | null; agreed: number | null; weight: number; managerId: number | null; status: string; appeal: boolean }

/** Kişinin raporlama birimi: DEPARTMAN (müdürlük) seviyesindeki atası; yoksa kendi birimi. */
export function reportingUnit(ctx: OrgContext, personId: number): number | null {
  const own = ctx.personUnit.get(personId) ?? null; let id = own; let guard = 0;
  while (id != null && guard++ < 50) { const u = ctx.units.get(id); if (!u) break; if (u.type === "DEPARTMAN" || u.type === "SUBE") return u.id; id = u.parentId ?? null; }
  return own;
}

export async function buildReport(cycleId: number) {
  const ctx = await loadOrgContext();
  const cycle = await db.query.cycles.findFirst({ where: eq(cycles.id, cycleId) });
  const rows = await db.select({ personId: assessments.personId, managerId: assessments.managerPersonId, status: assessments.status, competencyId: assessmentLines.competencyId, code: competencies.code, name: competencies.name, kind: competencies.kind,
    target: assessmentLines.targetLevel, self: assessmentLines.selfLevel, proven: assessmentLines.provenLevel, agreed: assessmentLines.agreedLevel, weight: assessmentLines.weight, appeal: sql<boolean>`(${assessmentLines.appealFlag} or ${assessmentLines.appealDecision} is not null)` })
    .from(assessmentLines).innerJoin(assessments, eq(assessments.id, assessmentLines.assessmentId)).innerJoin(competencies, eq(competencies.id, assessmentLines.competencyId)).where(eq(assessments.cycleId, cycleId));
  const lines: ReportLine[] = rows.map((r) => ({ ...r, unitId: reportingUnit(ctx, r.personId) ?? 0, appeal: !!r.appeal }));
  const level = (l: ReportLine) => l.agreed ?? l.proven ?? 0;
  const comps = [...new Map(lines.map((l) => [l.competencyId, { id: l.competencyId, code: l.code, name: l.name, kind: l.kind }])).values()].sort((a, b) => a.code.localeCompare(b.code));
  const units = [...new Set(lines.map((l) => l.unitId))].map((id) => ({ id, name: ctx.units.get(id)?.name ?? "—" })).sort((a, b) => a.name.localeCompare(b.name));
  const cell = (unitId: number, compId: number) => { const ls = lines.filter((l) => l.unitId === unitId && l.competencyId === compId); if (!ls.length) return null; return { n: ls.length, avg: ls.reduce((a, l) => a + level(l), 0) / ls.length, met: ls.filter((l) => level(l) >= l.target).length / ls.length, avgTarget: ls.reduce((a, l) => a + l.target, 0) / ls.length }; };
  const heatmap = units.map((u) => ({ unit: u, cells: comps.map((c) => cell(u.id, c.id)) }));
  const distribution = comps.map((c) => { const ls = lines.filter((l) => l.competencyId === c.id); const counts = [0, 1, 2, 3, 4, 5].map((n) => ls.filter((l) => level(l) === n).length);
    return { ...c, n: ls.length, counts, busFactor: ls.filter((l) => level(l) >= 3).length, met: ls.length ? ls.filter((l) => level(l) >= l.target).length / ls.length : 0, avgGap: ls.length ? ls.reduce((a, l) => a + (l.target - level(l)), 0) / ls.length : 0, maxShare: ls.length ? Math.max(...counts) / ls.length : 0 }; });
  const assessRows = await db.select({ id: assessments.id, status: assessments.status, personId: assessments.personId, managerId: assessments.managerPersonId }).from(assessments).where(eq(assessments.cycleId, cycleId));
  const completion = { total: assessRows.length, selfDone: assessRows.filter((a) => a.status !== "ACILDI").length, managerDone: assessRows.filter((a) => ["YONETICI_TAMAM", "MUTABAKATTA", "ITIRAZDA", "KESINLESTI", "KILITLI"].includes(a.status)).length, finalized: assessRows.filter((a) => ["KESINLESTI", "KILITLI"].includes(a.status)).length };
  const withSelf = lines.filter((l) => l.self != null && l.proven != null);
  const selfMinusProven = withSelf.length ? withSelf.reduce((a, l) => a + (l.self! - l.proven!), 0) / withSelf.length : 0;
  const agreedRatio = lines.length ? lines.filter((l) => l.agreed != null).length / lines.length : 0;
  const appealRatio = lines.length ? lines.filter((l) => l.appeal).length / lines.length : 0;
  // yönetici cömertlik: yöneticinin ekibindeki ortalama seviye − kurum ortalaması; kanıt kabul oranı
  const overallMean = lines.length ? lines.reduce((a, l) => a + level(l), 0) / lines.length : 0;
  const managerIds = [...new Set(lines.map((l) => l.managerId).filter((x): x is number => x != null))];
  const decided = managerIds.length ? await db.select({ by: evidence.decidedBy, status: evidence.status, c: sql<number>`count(*)::int` }).from(evidence).where(inArray(evidence.decidedBy, managerIds)).groupBy(evidence.decidedBy, evidence.status) : [];
  const managers = managerIds.map((m) => { const ls = lines.filter((l) => l.managerId === m); const mean = ls.length ? ls.reduce((a, l) => a + level(l), 0) / ls.length : 0; const dec = decided.filter((d) => d.by === m); const tot = dec.reduce((a, d) => a + d.c, 0); const acc = dec.filter((d) => d.status === "KABUL").reduce((a, d) => a + d.c, 0);
    return { personId: m, name: ctx.people.get(m)?.fullName ?? "—", team: new Set(ls.map((l) => l.personId)).size, mean, leniency: leniencyIndex(mean, overallMean), acceptRate: tot ? acc / tot : null, decided: tot }; });
  const flags: { kind: string; text: string }[] = [];
  lines.filter((l) => l.agreed != null && l.proven != null && l.agreed > l.proven).forEach((l) => flags.push({ kind: "KURAL", text: `${ctx.people.get(l.personId)?.fullName}: ${l.code} mutabık (${l.agreed}) kanıtlanmışı (${l.proven}) aşıyor` }));
  lines.filter((l) => l.self != null && l.proven != null && l.self - l.proven >= 2).forEach((l) => flags.push({ kind: "OZ_BEYAN", text: `${ctx.people.get(l.personId)?.fullName}: ${l.code} öz-beyan ${l.self}, kanıtlanmış ${l.proven} (fark ≥ 2)` }));
  managers.filter((m) => Math.abs(m.leniency) > 0.5 && m.team >= 2).forEach((m) => flags.push({ kind: "COMERTLIK", text: `${m.name}: cömertlik endeksi ${m.leniency > 0 ? "+" : ""}${m.leniency}` }));
  distribution.filter((d) => d.n >= 5 && d.maxShare > 0.6).forEach((d) => flags.push({ kind: "YIGILMA", text: `${d.code}: dağılımın %${Math.round(d.maxShare * 100)}'i tek seviyede` }));
  distribution.filter((d) => d.busFactor <= 1 && d.kind === "TEKNIK").forEach((d) => flags.push({ kind: "BUS_FACTOR", text: `${d.code}: seviye ≥ 3 kişi sayısı ${d.busFactor} (tek kişiye bağımlılık)` }));
  // gelişim planı oranı
  const plans = await db.select({ personId: developmentPlans.personId, status: developmentPlans.status, actions: sql<number>`(select count(*) from plan_actions pa where pa.plan_id = ${developmentPlans.id} and pa.status <> 'IPTAL')::int` }).from(developmentPlans).where(eq(developmentPlans.cycleId, cycleId));
  const planRatio = completion.finalized ? plans.filter((p) => p.actions > 0 && assessRows.some((a) => a.personId === p.personId && ["KESINLESTI", "KILITLI"].includes(a.status))).length / completion.finalized : 0;
  const approvedRatio = completion.finalized ? plans.filter((p) => p.status !== "TASLAK").length / completion.finalized : 0;
  const [pending] = await db.select({ c: sql<number>`count(*)::int` }).from(evidence).where(eq(evidence.status, "SUNULDU"));
  void managerOf; void planActions; void and;
  return { ctx, cycle, lines, comps, units, heatmap, distribution, completion, selfMinusProven, agreedRatio, appealRatio, overallMean, managers, flags, planRatio, approvedRatio, pendingEvidence: pending.c };
}

/** Döngü yardımcıları: aktif döngü, kişinin değerlendirmesi, satırların canlı kanıt durumuyla birleştirilmesi. */
import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { computeProvenLevel, type IndicatorStatus } from "@/domain/level";
import { provenForPerson, type CompetencyProven } from "./proven";

const { cycles, assessments, assessmentLines, evidence, evidenceIndicators, indicators } = schema;

export async function activeCycle() {
  const [c] = await db.select().from(cycles).where(ne(cycles.status, "KILITLI")).orderBy(desc(cycles.id)).limit(1);
  return c ?? null;
}

export interface LineView extends CompetencyProven { lineId: number; selfLevel: number | null; provenSnapshot: number | null; agreedLevel: number | null; meetingRequired: boolean; managerNote: string | null; appealFlag: boolean; appealReason: string | null; appealDecision: string | null; appealNote: string | null; level5Candidate: boolean; level5Validated: boolean | null; rejectedMandatory: boolean }

/** Kişinin değerlendirmesini canlı kanıt durumuyla birlikte getirir. */
export async function assessmentView(assessmentId: number) {
  const a = await db.query.assessments.findFirst({ where: eq(assessments.id, assessmentId), with: { lines: true, cycle: true, person: true } });
  if (!a) return null;
  const live = await provenForPerson(a.personId, a.roleId);
  const byComp = new Map(live.map((c) => [c.competencyId, c]));
  // reddedilmiş zorunlu kanıt var mı (yetkinlik bazında)
  const rejected = await db.select({ competencyId: indicators.competencyId }).from(evidence)
    .innerJoin(evidenceIndicators, eq(evidenceIndicators.evidenceId, evidence.id)).innerJoin(indicators, eq(indicators.id, evidenceIndicators.indicatorId))
    .where(and(eq(evidence.personId, a.personId), eq(evidence.status, "RED"), eq(indicators.mandatory, true)));
  const rejectedComps = new Set(rejected.map((r) => r.competencyId));
  const lines: LineView[] = a.lines.map((l) => {
    const c = byComp.get(l.competencyId);
    const base: CompetencyProven = c ?? { competencyId: l.competencyId, code: "?", name: "(profil değişmiş)", kind: "TEKNIK", subKind: null, targetLevel: l.targetLevel, weight: l.weight, mandatory: l.mandatory, provenLevel: 0, claimedLevel: 0, nextLevelProgress: 0, indicators: [] };
    const l5 = c ? computeProvenLevel(c.indicators.map((i): IndicatorStatus => ({ level: i.level as 1 | 2 | 3 | 4 | 5, mandatory: i.mandatory, proven: i.proven })), { coverageThreshold: 0.7, requireLevel5Validation: false }).level === 5 : false;
    const provenNow = c ? (l5 && l.level5Validated ? 5 : c.provenLevel) : 0;
    return { ...base, targetLevel: l.targetLevel, weight: l.weight, mandatory: l.mandatory, provenLevel: provenNow, lineId: l.id, selfLevel: l.selfLevel, provenSnapshot: l.provenLevel, agreedLevel: l.agreedLevel,
      meetingRequired: l.meetingRequired, managerNote: l.managerNote, appealFlag: l.appealFlag, appealReason: l.appealReason, appealDecision: l.appealDecision, appealNote: l.appealNote,
      level5Candidate: l5, level5Validated: l.level5Validated, rejectedMandatory: rejectedComps.has(l.competencyId) };
  }).sort((x, y) => (x.kind + (x.subKind ?? "") + x.code).localeCompare(y.kind + (y.subKind ?? "") + y.code));
  return { assessment: a, lines };
}

export async function assessmentsOfCycle(cycleId: number, personIds?: number[]) {
  return db.select().from(assessments).where(personIds ? and(eq(assessments.cycleId, cycleId), inArray(assessments.personId, personIds)) : eq(assessments.cycleId, cycleId)).orderBy(asc(assessments.id));
}
export { assessmentLines };

/** Kişi için gösterge kanıt durumları ve kanıtlanmış seviye hesabı (kabul edilmiş ve geçerli kanıtlar). */
import { and, asc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { computeProvenLevel, isEvidenceValid, type IndicatorStatus } from "@/domain/level";

export interface CompetencyProven {
  competencyId: number; code: string; name: string; kind: "TEKNIK" | "DAVRANISSAL"; subKind: string | null;
  targetLevel: number; weight: number; mandatory: boolean;
  provenLevel: number; claimedLevel: number; nextLevelProgress: number;
  indicators: { id: number; level: number; text: string; mandatory: boolean; proven: boolean; claimed: boolean; evidenceCount: number; pendingCount: number }[];
}

export async function provenForPerson(personId: number, roleId: number, today = new Date()): Promise<CompetencyProven[]> {
  const { roleProfiles, competencies, indicators, evidence, evidenceIndicators } = schema;
  const rows = await db.select({ competencyId: competencies.id, code: competencies.code, name: competencies.name, kind: competencies.kind, subKind: competencies.subKind,
    targetLevel: roleProfiles.targetLevel, weight: roleProfiles.weight, mandatory: roleProfiles.mandatory })
    .from(roleProfiles).innerJoin(competencies, eq(competencies.id, roleProfiles.competencyId)).where(eq(roleProfiles.roleId, roleId))
    .orderBy(asc(competencies.kind), asc(competencies.subKind), asc(competencies.code));
  if (!rows.length) return [];
  const inds = await db.select().from(indicators).where(and(inArray(indicators.competencyId, rows.map((r) => r.competencyId)), eq(indicators.active, true))).orderBy(asc(indicators.level), asc(indicators.sortOrder));
  const links = await db.select({ indicatorId: evidenceIndicators.indicatorId, status: evidence.status, endDate: evidence.endDate })
    .from(evidenceIndicators).innerJoin(evidence, eq(evidence.id, evidenceIndicators.evidenceId)).where(eq(evidence.personId, personId));
  const byInd = new Map<number, typeof links>();
  links.forEach((l) => byInd.set(l.indicatorId, [...(byInd.get(l.indicatorId) ?? []), l]));
  return rows.map((r) => {
    const ci = inds.filter((i) => i.competencyId === r.competencyId);
    const statuses = ci.map((i) => {
      const ls = byInd.get(i.id) ?? [];
      const proven = ls.some((l) => l.status === "KABUL" && isEvidenceValid(new Date(l.endDate), i.validityMonths, today));
      const claimed = ls.some((l) => l.status !== "RED");
      return { id: i.id, level: i.level, text: i.text, mandatory: i.mandatory, proven, claimed, evidenceCount: ls.length, pendingCount: ls.filter((l) => l.status === "SUNULDU" || l.status === "EK_BILGI").length };
    });
    const provenCalc = computeProvenLevel(statuses.map((s): IndicatorStatus => ({ level: s.level as 1 | 2 | 3 | 4 | 5, mandatory: s.mandatory, proven: s.proven })), undefined, false);
    const claimedCalc = computeProvenLevel(statuses.map((s): IndicatorStatus => ({ level: s.level as 1 | 2 | 3 | 4 | 5, mandatory: s.mandatory, proven: s.claimed })), undefined, true);
    return { ...r, provenLevel: provenCalc.level, claimedLevel: claimedCalc.level, nextLevelProgress: provenCalc.nextLevelProgress, indicators: statuses };
  });
}

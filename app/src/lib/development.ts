/** Gelişim planı önerileri: öncelik puanı, eksik göstergeler, mentor adayları (09 P13, 13 §2). */
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { priorityScore } from "@/domain/level";
import { provenForPerson, type CompetencyProven } from "./proven";

export interface Priority extends CompetencyProven { criticality: number; agreedLevel: number; score: number; missing: CompetencyProven["indicators"]; mentors: { personId: number; name: string; level: number; load: number }[] }

export async function latestCycleId(): Promise<number | null> {
  const [c] = await db.select({ id: schema.cycles.id }).from(schema.cycles).orderBy(desc(schema.cycles.id)).limit(1);
  return c?.id ?? null;
}

export async function prioritiesFor(personId: number, roleId: number, cycleId: number | null): Promise<Priority[]> {
  const comps = await provenForPerson(personId, roleId);
  if (!comps.length) return [];
  const crit = new Map((await db.select({ id: schema.competencies.id, c: schema.competencies.defaultCriticality }).from(schema.competencies).where(inArray(schema.competencies.id, comps.map((c) => c.competencyId)))).map((r) => [r.id, r.c]));
  // mutabık seviyeler (döngüden) — yoksa kanıtlanmış
  const agreedMap = new Map<number, number>();
  if (cycleId) {
    const a = await db.query.assessments.findFirst({ where: and(eq(schema.assessments.cycleId, cycleId), eq(schema.assessments.personId, personId)), with: { lines: true } });
    a?.lines.forEach((l) => { if (l.agreedLevel != null) agreedMap.set(l.competencyId, l.agreedLevel); });
  }
  // mentor adayları: aynı yetkinlikte mutabık ≥ 4 (son döngü) ve yük ≤ 3
  const mentorRows = cycleId ? await db.select({ competencyId: schema.assessmentLines.competencyId, personId: schema.assessments.personId, level: schema.assessmentLines.agreedLevel, name: schema.people.fullName })
    .from(schema.assessmentLines).innerJoin(schema.assessments, eq(schema.assessments.id, schema.assessmentLines.assessmentId)).innerJoin(schema.people, eq(schema.people.id, schema.assessments.personId))
    .where(and(eq(schema.assessments.cycleId, cycleId), sql`${schema.assessmentLines.agreedLevel} >= 4`, ne(schema.assessments.personId, personId))) : [];
  const loads = new Map((await db.select({ m: schema.planActions.mentorPersonId, c: sql<number>`count(*)::int` }).from(schema.planActions).where(sql`${schema.planActions.mentorPersonId} is not null and ${schema.planActions.status} in ('PLANLANDI','DEVAM')`).groupBy(schema.planActions.mentorPersonId)).map((r) => [r.m!, r.c]));
  return comps.map((c) => {
    const agreed = agreedMap.get(c.competencyId) ?? c.provenLevel;
    const criticality = (crit.get(c.competencyId) ?? 2) as 1 | 2 | 3;
    const score = priorityScore(c.targetLevel, agreed, c.weight as 1 | 2 | 3, criticality);
    const missing = c.indicators.filter((i) => i.level <= c.targetLevel && !i.proven);
    const mentors = mentorRows.filter((m) => m.competencyId === c.competencyId).map((m) => ({ personId: m.personId, name: m.name, level: m.level ?? 0, load: loads.get(m.personId) ?? 0 })).filter((m) => m.load < 3);
    return { ...c, criticality, agreedLevel: agreed, score, missing, mentors };
  }).sort((a, b) => b.score - a.score);
}

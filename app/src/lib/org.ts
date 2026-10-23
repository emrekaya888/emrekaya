/** Organizasyon bağlamı: kişinin birimi, yöneticisi ve bir yöneticinin ekibi (küçük kurulum için bellekte çözülür). */
import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";

export interface OrgContext {
  units: Map<number, typeof schema.orgUnits.$inferSelect>;
  personUnit: Map<number, number>; // personId -> orgUnitId (birincil atama)
  personRole: Map<number, number>; // personId -> roleId
  personPosition: Map<number, number>;
  people: Map<number, typeof schema.people.$inferSelect>;
}

export async function loadOrgContext(): Promise<OrgContext> {
  const { orgUnits, assignments, positions, people } = schema;
  const [units, asg, persons] = await Promise.all([
    db.select().from(orgUnits),
    db.select({ personId: assignments.personId, orgUnitId: positions.orgUnitId, roleId: positions.roleId, positionId: positions.id })
      .from(assignments).innerJoin(positions, eq(positions.id, assignments.positionId)).where(and(isNull(assignments.endDate), eq(assignments.isPrimary, true))),
    db.select().from(people).where(eq(people.active, true)),
  ]);
  return {
    units: new Map(units.map((u) => [u.id, u])),
    personUnit: new Map(asg.map((a) => [a.personId, a.orgUnitId])),
    personRole: new Map(asg.map((a) => [a.personId, a.roleId])),
    personPosition: new Map(asg.map((a) => [a.personId, a.positionId])),
    people: new Map(persons.map((p) => [p.id, p])),
  };
}

/** Kişinin yöneticisi: kendi biriminden yukarı çıkarken yönetici atanmış ilk birimin yöneticisi (kendisi değilse). */
export function managerOf(ctx: OrgContext, personId: number): number | null {
  let unitId = ctx.personUnit.get(personId) ?? null;
  let guard = 0;
  while (unitId != null && guard++ < 50) {
    const u = ctx.units.get(unitId);
    if (!u) return null;
    if (u.managerPersonId && u.managerPersonId !== personId) return u.managerPersonId;
    unitId = u.parentId ?? null;
  }
  return null;
}

/** Yöneticinin ekibi: yöneticisi bu kişi olan herkes. */
export function teamOf(ctx: OrgContext, managerPersonId: number): number[] {
  const team: number[] = [];
  for (const pid of ctx.personUnit.keys()) if (pid !== managerPersonId && managerOf(ctx, pid) === managerPersonId) team.push(pid);
  return team;
}

export function unitPathName(ctx: OrgContext, unitId: number | null | undefined): string {
  const parts: string[] = []; let id = unitId ?? null; let guard = 0;
  while (id != null && guard++ < 50) { const u = ctx.units.get(id); if (!u) break; parts.unshift(u.name); id = u.parentId ?? null; }
  return parts.join(" › ");
}

/** Yetki kapsamı: kullanıcının rolleri ve kapsam birimlerinin alt ağacı. */
import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { SessionData } from "./session";

const GLOBAL_ROLES = ["IK_ADMIN", "IK_IS_ORTAGI", "UST_YONETIM", "ALAN_UZMANI"];

/** Kullanıcının görebileceği birim id'leri; null = tüm kurum. */
export async function visibleOrgUnitIds(s: SessionData): Promise<number[] | null> {
  const roles = s.roles ?? [];
  if (roles.some((r) => GLOBAL_ROLES.includes(r.role) && r.scopeOrgUnitId == null)) return null;
  const scopes = roles.map((r) => r.scopeOrgUnitId).filter((x): x is number => x != null);
  if (!scopes.length) return [];
  const rows = await db.execute(sql`
    with recursive t as (
      select id from org_units where id in (${sql.join(scopes.map((x) => sql`${x}`), sql`, `)})
      union all
      select o.id from org_units o join t on o.parent_id = t.id
    ) select id from t`);
  return rows.rows.map((r) => Number((r as { id: number }).id));
}

import Link from "next/link";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { profileWarnings } from "@/domain/profile";
import { ApplyDefaultsButton } from "./controls";

export default async function RolProfilleriPage() {
  const session = await requireUser();
  const isAdmin = hasRole(session, "IK_ADMIN");
  const { roles, roleProfiles, competencies, positions, assignments } = schema;
  const roleRows = await db.select().from(roles).where(eq(roles.active, true)).orderBy(asc(roles.jobFamily), asc(roles.grade), asc(roles.name));
  const profRows = await db.select({ roleId: roleProfiles.roleId, kind: competencies.kind, subKind: competencies.subKind, targetLevel: roleProfiles.targetLevel, weight: roleProfiles.weight, mandatory: roleProfiles.mandatory })
    .from(roleProfiles).innerJoin(competencies, eq(competencies.id, roleProfiles.competencyId));
  const posCounts = await db.select({ roleId: positions.roleId, c: sql<number>`count(*)::int` }).from(positions).groupBy(positions.roleId);
  const posByRole = new Map(posCounts.map((p) => [p.roleId, p.c]));
  const unprofiled = await db.select({ code: positions.code, role: roles.name, person: schema.people.fullName }).from(positions)
    .innerJoin(roles, eq(roles.id, positions.roleId))
    .leftJoin(assignments, and(eq(assignments.positionId, positions.id), isNull(assignments.endDate)))
    .leftJoin(schema.people, eq(schema.people.id, assignments.personId))
    .where(sql`not exists (select 1 from role_profiles rp where rp.role_id = ${positions.roleId})`);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[var(--brand)]">Rol profilleri</h1>
        {isAdmin && <ApplyDefaultsButton />}
      </div>
      <p className="text-sm text-slate-600">Her rol için gereken yetkinlikler, hedef seviye (bu rolde beklenen), ağırlık (1 destekleyici · 2 önemli · 3 çekirdek) ve zorunluluk. Çekirdek davranışsal yetkinlikler tüm rollere, liderlik yetkinlikleri yönetici rollerine otomatik bağlanır.</p>
      <div className="card overflow-x-auto">
        <table className="table"><thead><tr><th>Rol</th><th>İş ailesi</th><th>Kademe</th><th>Pozisyon</th><th>Teknik</th><th>Davranışsal</th><th>Toplam satır</th><th>Uyarılar</th></tr></thead>
          <tbody>
            {roleRows.map((r) => {
              const rows = profRows.filter((p) => p.roleId === r.id);
              const w = profileWarnings(rows, { isManager: r.isManager, hasPositions: (posByRole.get(r.id) ?? 0) > 0 });
              const tech = rows.filter((x) => x.kind === "TEKNIK").length;
              return (
                <tr key={r.id}>
                  <td><Link href={`/rol-profilleri/${r.id}`} className="font-medium text-[var(--brand-2)] underline">{r.name}</Link>{r.isManager && <span className="badge ml-1 bg-sky-100 text-sky-800">yönetici</span>}</td>
                  <td>{r.jobFamily ?? "—"}</td><td>{r.grade}</td><td>{posByRole.get(r.id) ?? 0}</td><td>{tech}</td><td>{rows.length - tech}</td>
                  <td className={rows.length > 30 ? "text-red-700 font-semibold" : ""}>{rows.length}</td>
                  <td className="text-xs">{w.length === 0 ? <span className="text-green-700">Temiz</span> : w.map((x) => <div key={x.code} className={x.severity === "HATA" ? "text-red-700" : "text-amber-700"}>{x.message}</div>)}</td>
                </tr>
              );
            })}
            {roleRows.length === 0 && <tr><td colSpan={8} className="text-slate-500">Rol yok. Önce Kurulum sayfasından rol ekleyin.</td></tr>}
          </tbody></table>
      </div>
      <div className="card">
        <h2 className="font-semibold">Profilsiz pozisyonlar ({unprofiled.length})</h2>
        {unprofiled.length === 0 ? <p className="text-sm text-green-700">Tüm pozisyonlar profilli bir role bağlı.</p> : (
          <ul className="mt-2 text-sm">{unprofiled.map((u) => <li key={u.code}>{u.code} · {u.role}{u.person ? ` · ${u.person}` : " · boş"}</li>)}</ul>
        )}
        <p className="mt-2 text-xs text-slate-500">Döngü açılmadan önce bu liste boş olmalıdır (çıkış kriteri, P5).</p>
      </div>
    </div>
  );
}

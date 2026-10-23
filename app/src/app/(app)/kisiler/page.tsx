import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { visibleOrgUnitIds } from "@/lib/scope";

export default async function KisilerPage({ searchParams }: { searchParams: Promise<{ q?: string; sayfa?: string }> }) {
  const session = await requireUser();
  const visible = await visibleOrgUnitIds(session);
  const { q = "", sayfa = "1" } = await searchParams;
  const page = Math.max(1, Number(sayfa) || 1); const pageSize = 50;
  const { people, assignments, positions, roles, orgUnits } = schema;
  const where = and(
    eq(people.active, true),
    q ? or(ilike(people.fullName, `%${q}%`), ilike(people.employeeNo, `%${q}%`), ilike(people.email, `%${q}%`)) : undefined,
    visible ? (visible.length ? sql`${orgUnits.id} in (${sql.join(visible.map((v) => sql`${v}`), sql`, `)})` : sql`false`) : undefined,
  );
  const rows = await db.select({
    id: people.id, no: people.employeeNo, name: people.fullName, email: people.email, hireDate: people.hireDate,
    role: roles.name, unit: orgUnits.name, unitType: orgUnits.type, position: positions.code,
  }).from(people)
    .leftJoin(assignments, and(eq(assignments.personId, people.id), isNull(assignments.endDate), eq(assignments.isPrimary, true)))
    .leftJoin(positions, eq(positions.id, assignments.positionId))
    .leftJoin(roles, eq(roles.id, positions.roleId))
    .leftJoin(orgUnits, eq(orgUnits.id, positions.orgUnitId))
    .where(where).orderBy(desc(people.id)).limit(pageSize).offset((page - 1) * pageSize);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--brand)]">Kişiler</h1>
      <form className="flex gap-2"><input name="q" defaultValue={q} placeholder="Ad, sicil veya e-posta ara" className="input max-w-sm" /><button className="btn-primary">Ara</button></form>
      <div className="card overflow-x-auto">
        <table className="table"><thead><tr><th>Sicil</th><th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Birim</th><th>Pozisyon</th><th>İşe giriş</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="text-slate-500">Kayıt yok.</td></tr>}
            {rows.map((r) => <tr key={r.id}><td>{r.no}</td><td className="font-medium">{r.name}</td><td>{r.email ?? "—"}</td><td>{r.role ?? <span className="text-amber-700">Atama yok</span>}</td><td>{r.unit ?? "—"}</td><td>{r.position ?? "—"}</td><td>{r.hireDate ?? "—"}</td></tr>)}
          </tbody></table>
      </div>
      <div className="flex gap-2 text-sm">
        {page > 1 && <a className="btn-ghost" href={`?q=${encodeURIComponent(q)}&sayfa=${page - 1}`}>Önceki</a>}
        {rows.length === pageSize && <a className="btn-ghost" href={`?q=${encodeURIComponent(q)}&sayfa=${page + 1}`}>Sonraki</a>}
      </div>
    </div>
  );
}

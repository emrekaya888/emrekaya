import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { levelNames } from "@/db/labels";
import { requireUser } from "@/lib/auth";

export default async function KisiDetayPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id: idStr } = await params; const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();
  const { people, assignments, positions, roles, orgUnits, roleProfiles, competencies } = schema;
  const person = await db.query.people.findFirst({ where: eq(people.id, id) });
  if (!person) notFound();
  const [cur] = await db.select({ positionCode: positions.code, roleId: roles.id, roleName: roles.name, grade: roles.grade, unit: orgUnits.name, start: assignments.startDate })
    .from(assignments).innerJoin(positions, eq(positions.id, assignments.positionId)).innerJoin(roles, eq(roles.id, positions.roleId)).innerJoin(orgUnits, eq(orgUnits.id, positions.orgUnitId))
    .where(and(eq(assignments.personId, id), isNull(assignments.endDate), eq(assignments.isPrimary, true)));
  const rows = cur ? await db.select({ code: competencies.code, name: competencies.name, kind: competencies.kind, subKind: competencies.subKind, target: roleProfiles.targetLevel, weight: roleProfiles.weight, mandatory: roleProfiles.mandatory })
    .from(roleProfiles).innerJoin(competencies, eq(competencies.id, roleProfiles.competencyId)).where(eq(roleProfiles.roleId, cur.roleId))
    .orderBy(asc(competencies.kind), asc(competencies.subKind), asc(competencies.code)) : [];
  return (
    <div className="space-y-4">
      <Link href="/kisiler" className="text-sm text-[var(--brand-2)] underline">← Kişiler</Link>
      <h1 className="text-2xl font-bold text-[var(--brand)]">{person.fullName}</h1>
      <div className="card text-sm">
        <div>Sicil: {person.employeeNo} · E-posta: {person.email ?? "—"} · İşe giriş: {person.hireDate ?? "—"}</div>
        {cur ? <div>Pozisyon: {cur.positionCode} · Rol: <Link href={`/rol-profilleri/${cur.roleId}`} className="underline">{cur.roleName}</Link> (kademe {cur.grade}) · Birim: {cur.unit} · Başlangıç: {cur.start}</div> : <div className="text-amber-700">Aktif atama yok.</div>}
      </div>
      <div className="card">
        <h2 className="mb-2 font-semibold">Değerlendirme satırları ({rows.length})</h2>
        <p className="mb-2 text-xs text-slate-500">Rol profilinden türetilir; döngü açıldığında bu satırlar için öz-beyan ve kanıt istenir.</p>
        <table className="table"><thead><tr><th>Kod</th><th>Yetkinlik</th><th>Tür</th><th>Hedef</th><th>Ağırlık</th><th>Zorunlu</th></tr></thead>
          <tbody>
            {rows.map((r) => <tr key={r.code}><td className="text-xs">{r.code}</td><td>{r.name}</td><td className="text-xs">{r.kind === "TEKNIK" ? "Teknik" : r.subKind === "LIDERLIK" ? "Liderlik" : "Çekirdek"}</td><td>{r.target} · {levelNames[r.kind][r.target]}</td><td>{r.weight}</td><td>{r.mandatory ? "Evet" : "—"}</td></tr>)}
            {rows.length === 0 && <tr><td colSpan={6} className="text-slate-500">{cur ? "Bu rolün profili henüz tanımlı değil." : "Atama olmadan satır üretilemez."}</td></tr>}
          </tbody></table>
      </div>
    </div>
  );
}

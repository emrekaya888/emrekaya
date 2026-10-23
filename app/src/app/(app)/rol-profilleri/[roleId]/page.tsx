import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { competencyKindLabel, competencySubKindLabel, levelNames } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { profileWarnings } from "@/domain/profile";
import { AddRowForm, CopyControls, RowControls } from "../controls";

export default async function RolProfiliPage({ params }: { params: Promise<{ roleId: string }> }) {
  const session = await requireUser();
  const isAdmin = hasRole(session, "IK_ADMIN");
  const { roleId: idStr } = await params; const roleId = Number(idStr);
  if (!Number.isInteger(roleId)) notFound();
  const { roles, roleProfiles, competencies, positions } = schema;
  const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
  if (!role) notFound();
  const rows = await db.select({ id: roleProfiles.id, competencyId: competencies.id, code: competencies.code, name: competencies.name, kind: competencies.kind, subKind: competencies.subKind,
    targetLevel: roleProfiles.targetLevel, weight: roleProfiles.weight, mandatory: roleProfiles.mandatory, source: roleProfiles.source, status: competencies.status })
    .from(roleProfiles).innerJoin(competencies, eq(competencies.id, roleProfiles.competencyId)).where(eq(roleProfiles.roleId, roleId))
    .orderBy(asc(competencies.kind), asc(competencies.subKind), asc(competencies.code));
  const [posCount] = await db.select({ c: sql<number>`count(*)::int` }).from(positions).where(eq(positions.roleId, roleId));
  const active = await db.select({ id: competencies.id, code: competencies.code, name: competencies.name, kind: competencies.kind, subKind: competencies.subKind }).from(competencies)
    .where(and(eq(competencies.status, "AKTIF"))).orderBy(asc(competencies.kind), asc(competencies.code));
  const inProfile = new Set(rows.map((r) => r.competencyId));
  const options = active.filter((c) => !inProfile.has(c.id)).map((c) => ({ id: c.id, label: `${c.code} · ${c.name} (${c.kind === "TEKNIK" ? competencySubKindLabel[c.subKind ?? ""] ?? "Teknik" : competencySubKindLabel[c.subKind ?? ""] ?? "Davranışsal"})` }));
  const otherRoles = (await db.select().from(roles).where(eq(roles.active, true)).orderBy(asc(roles.grade))).filter((r) => r.id !== roleId).map((r) => ({ id: r.id, label: `${r.name} (kademe ${r.grade})` }));
  const warnings = profileWarnings(rows, { isManager: role.isManager, hasPositions: posCount.c > 0 });
  const groups: { title: string; filter: (r: typeof rows[number]) => boolean }[] = [
    { title: "Davranışsal · Çekirdek", filter: (r) => r.kind === "DAVRANISSAL" && r.subKind !== "LIDERLIK" },
    { title: "Davranışsal · Liderlik", filter: (r) => r.kind === "DAVRANISSAL" && r.subKind === "LIDERLIK" },
    { title: "Teknik beceriler", filter: (r) => r.kind === "TEKNIK" },
  ];
  return (
    <div className="space-y-4">
      <div>
        <Link href="/rol-profilleri" className="text-sm text-[var(--brand-2)] underline">← Rol profilleri</Link>
        <h1 className="text-2xl font-bold text-[var(--brand)]">{role.name}</h1>
        <p className="text-sm text-slate-500">{role.jobFamily ?? "—"} · kademe {role.grade} · {role.isManager ? "yönetici rolü" : "uzman rolü"} · {posCount.c} pozisyon · {rows.length} satır</p>
      </div>
      {warnings.length > 0 && <div className="card text-sm">{warnings.map((w) => <div key={w.code} className={w.severity === "HATA" ? "text-red-700" : "text-amber-700"}>• {w.message}</div>)}</div>}
      {isAdmin && <div className="card"><CopyControls roleId={roleId} sources={otherRoles} /></div>}
      {groups.map((g) => {
        const grs = rows.filter(g.filter);
        return (
          <section key={g.title} className="card">
            <h2 className="mb-2 font-semibold">{g.title} <span className="text-xs font-normal text-slate-500">({grs.length})</span></h2>
            <table className="table"><thead><tr><th>Kod</th><th>Yetkinlik</th><th>Hedef seviye</th><th>Ağırlık</th><th>Zorunlu</th><th></th></tr></thead>
              <tbody>
                {grs.map((r) => (
                  <tr key={r.id}>
                    <td className="text-xs">{r.code}{r.source === "AUTO" && <span className="badge ml-1 bg-slate-100 text-slate-600">oto</span>}{r.status !== "AKTIF" && <span className="badge ml-1 bg-red-100 text-red-700">{r.status}</span>}</td>
                    <td><Link href={`/kutuphane/${r.competencyId}`} className="underline">{r.name}</Link><div className="text-xs text-slate-500">{levelNames[r.kind][r.targetLevel]}</div></td>
                    <RowControls rowId={r.id} targetLevel={r.targetLevel} weight={r.weight} mandatory={r.mandatory} editable={isAdmin} />
                  </tr>
                ))}
                {grs.length === 0 && <tr><td colSpan={6} className="text-slate-500">Satır yok.</td></tr>}
              </tbody></table>
          </section>
        );
      })}
      {isAdmin && <div className="card"><h2 className="mb-2 font-semibold">Satır ekle</h2><AddRowForm roleId={roleId} options={options} /><p className="mt-2 text-xs text-slate-500">Yalnızca Aktif yetkinlikler listelenir. Hedef: &quot;bu rolde 2 yıldır çalışan, işini beklendiği gibi yapan kişi hangi seviyededir?&quot;</p></div>}
      <p className="text-xs text-slate-500">{competencyKindLabel.TEKNIK} için önerilen sayı 12–18; kişi başı toplam satır en fazla 30.</p>
    </div>
  );
}

import { asc, count, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { networkLabel, segmentLabel } from "@/db/labels";

export default async function RollerPage() {
  const { roles, positions } = schema;
  const rows = await db.select({ id: roles.id, code: roles.code, name: roles.name, family: roles.jobFamily, grade: roles.grade, isManager: roles.isManager, network: roles.network, segment: roles.segment, posCount: count(positions.id) })
    .from(roles).leftJoin(positions, eq(positions.roleId, roles.id)).groupBy(roles.id).orderBy(asc(roles.network), asc(roles.jobFamily), asc(roles.grade));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--brand)]">Roller ve pozisyonlar</h1>
      <p className="text-sm text-slate-500">Rol = iş ailesi + kademe. Pozisyon = rolün bir birimdeki kadrosu. Rol profilleri (hedef seviyeler) sprint 3 kapsamında eklenecek.</p>
      <div className="card overflow-x-auto">
        <table className="table"><thead><tr><th>Kod</th><th>Rol</th><th>İş ailesi</th><th>Kademe</th><th>Yönetici</th><th>Ağ</th><th>Segment</th><th>Pozisyon sayısı</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={8} className="text-slate-500">Henüz rol yüklenmedi.</td></tr>}
            {rows.map((r) => <tr key={r.id}><td>{r.code}</td><td className="font-medium">{r.name}</td><td>{r.family ?? "—"}</td><td>{r.grade}</td><td>{r.isManager ? "Evet" : "Hayır"}</td><td>{networkLabel[r.network]}</td><td>{r.segment ? segmentLabel[r.segment] : "—"}</td><td>{r.posCount}</td></tr>)}
          </tbody></table>
      </div>
    </div>
  );
}

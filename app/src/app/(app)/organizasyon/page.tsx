import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { orgUnitTypeLabel, branchClassLabel, segmentLabel } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { visibleOrgUnitIds } from "@/lib/scope";

type Unit = typeof schema.orgUnits.$inferSelect & { managerName?: string | null; headcount: number };

export default async function OrganizasyonPage() {
  const session = await requireUser();
  const visible = await visibleOrgUnitIds(session);
  const units = await db.select().from(schema.orgUnits).orderBy(asc(schema.orgUnits.depth), asc(schema.orgUnits.name));
  const managers = await db.select({ id: schema.people.id, name: schema.people.fullName }).from(schema.people);
  const managerMap = new Map(managers.map((m) => [m.id, m.name]));
  // Birim başına aktif atama sayısı
  const counts = await db.execute(`select p.org_unit_id as id, count(*)::int as c from assignments a join positions p on p.id = a.position_id where a.end_date is null group by p.org_unit_id`);
  const countMap = new Map((counts.rows as { id: number; c: number }[]).map((r) => [Number(r.id), Number(r.c)]));
  const all: Unit[] = units.map((u) => ({ ...u, managerName: u.managerPersonId ? managerMap.get(u.managerPersonId) : null, headcount: countMap.get(u.id) ?? 0 }));
  const children = new Map<number | null, Unit[]>();
  all.forEach((u) => { const k = u.parentId ?? null; children.set(k, [...(children.get(k) ?? []), u]); });
  const allowed = visible ? new Set(visible) : null;

  function Node({ u }: { u: Unit }) {
    const kids = children.get(u.id) ?? [];
    const hidden = allowed ? !allowed.has(u.id) : false;
    return (
      <li className="mt-1">
        <div className={`flex flex-wrap items-center gap-2 rounded-md px-2 py-1 ${hidden ? "opacity-40" : "hover:bg-slate-100"}`}>
          <span className="badge bg-slate-200 text-slate-700">{orgUnitTypeLabel[u.type] ?? u.type}</span>
          <span className="font-medium">{u.name}</span>
          <span className="text-xs text-slate-500">{u.code}</span>
          {u.branchClass && <span className="badge bg-amber-100 text-amber-800">{branchClassLabel[u.branchClass]}</span>}
          {u.segment && <span className="badge bg-sky-100 text-sky-800">{segmentLabel[u.segment]}</span>}
          {u.managerName && <span className="text-xs text-slate-500">Yönetici: {u.managerName}</span>}
          {u.headcount > 0 && <span className="text-xs text-slate-500">{u.headcount} kişi</span>}
        </div>
        {kids.length > 0 && <ul className="ml-5 border-l border-slate-200 pl-2">{kids.map((k) => <Node key={k.id} u={k} />)}</ul>}
      </li>
    );
  }
  const roots = children.get(null) ?? [];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--brand)]">Organizasyon</h1>
      <p className="text-sm text-slate-500">{all.length} birim. Serbest derinlikte ağaç; departman ve servis tür etiketidir (bkz. tasarım 01 §3).</p>
      {roots.length === 0 ? <div className="card text-sm text-slate-500">Henüz organizasyon yüklenmedi. İçe aktarma sayfasından organizasyon CSV dosyasını yükleyin.</div>
        : <div className="card"><ul>{roots.map((r) => <Node key={r.id} u={r} />)}</ul></div>}
    </div>
  );
}

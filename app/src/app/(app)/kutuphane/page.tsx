import Link from "next/link";
import { asc, count, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { competencyKindLabel, competencyStatusLabel, competencySubKindLabel } from "@/db/labels";

export default async function KutuphanePage({ searchParams }: { searchParams: Promise<{ tur?: string; durum?: string }> }) {
  const { tur = "", durum = "" } = await searchParams;
  const { competencies, indicators } = schema;
  const rows = await db.select({
    id: competencies.id, code: competencies.code, name: competencies.name, kind: competencies.kind, subKind: competencies.subKind,
    status: competencies.status, version: competencies.version, trend: competencies.futureTrend,
    indicatorCount: count(indicators.id), mandatoryCount: sql<number>`coalesce(sum(case when ${indicators.mandatory} then 1 else 0 end), 0)::int`,
  }).from(competencies).leftJoin(indicators, eq(indicators.competencyId, competencies.id))
    .groupBy(competencies.id).orderBy(asc(competencies.kind), asc(competencies.code), asc(competencies.version));
  const filtered = rows.filter((r) => (!tur || r.kind === tur) && (!durum || r.status === durum));
  const statusColor: Record<string, string> = { TASLAK: "bg-slate-200 text-slate-700", INCELEMEDE: "bg-amber-100 text-amber-800", AKTIF: "bg-green-100 text-green-800", EMEKLI: "bg-slate-100 text-slate-400" };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[var(--brand)]">Yetkinlik kütüphanesi</h1>
        <Link href="/kutuphane/yeni" className="btn-primary">Yeni yetkinlik</Link>
      </div>
      <form className="flex flex-wrap gap-2 text-sm">
        <select name="tur" defaultValue={tur} className="input max-w-xs"><option value="">Tüm türler</option><option value="DAVRANISSAL">Davranışsal</option><option value="TEKNIK">Teknik</option></select>
        <select name="durum" defaultValue={durum} className="input max-w-xs"><option value="">Tüm durumlar</option>{Object.entries(competencyStatusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <button className="btn-ghost">Filtrele</button>
      </form>
      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr><th>Kod</th><th>Yetkinlik</th><th>Tür</th><th>Alt tür</th><th>Durum</th><th>Sürüm</th><th>Gösterge (zorunlu)</th><th>Eğilim</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8} className="text-slate-500">Kayıt yok. Yeni yetkinlik ekleyin veya tohum verisini yükleyin.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><Link className="text-[var(--brand-2)] underline" href={`/kutuphane/${r.id}`}>{r.code}</Link></td>
                <td className="font-medium">{r.name}</td>
                <td>{competencyKindLabel[r.kind]}</td>
                <td>{r.subKind ? competencySubKindLabel[r.subKind] : "—"}</td>
                <td><span className={`badge ${statusColor[r.status]}`}>{competencyStatusLabel[r.status]}</span></td>
                <td>v{r.version}</td>
                <td>{r.indicatorCount} ({r.mandatoryCount})</td>
                <td>{r.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">Kural: Aktif duruma geçmek için her seviyede en az 3 gösterge ve en az 1 zorunlu gösterge gerekir. Aktif yetkinlikte anlam değişikliği yeni sürüm açar.</p>
    </div>
  );
}

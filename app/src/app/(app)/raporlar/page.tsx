import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { cycleStatusLabel } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { buildReport } from "@/lib/reports";

function heat(avg: number, target: number) { const g = target - avg; return g <= 0 ? "bg-green-100" : g < 1 ? "bg-amber-100" : "bg-red-100"; }

export default async function RaporlarPage({ searchParams }: { searchParams: Promise<{ dongu?: string }> }) {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN", "UST_DOGRULAYICI", "UST_YONETIM", "YONETICI")) return <div className="card text-sm">Raporlar yönetici, üst yönetici ve İK içindir.</div>;
  const all = await db.select().from(schema.cycles).orderBy(desc(schema.cycles.id));
  if (!all.length) return <div className="card text-sm">Henüz döngü yok.</div>;
  const { dongu } = await searchParams;
  const cycle = all.find((c) => String(c.id) === dongu) ?? all[0];
  const r = await buildReport(cycle.id);
  const pct = (x: number) => `%${Math.round(x * 100)}`;
  const learning = [
    { q: "Öz-beyan şişiyor mu?", v: r.selfMinusProven.toFixed(2), ok: r.selfMinusProven <= 0.5, t: "≤ 0,5" },
    { q: "Mutabakat çalışıyor mu?", v: pct(r.agreedRatio), ok: r.agreedRatio >= 0.85, t: "≥ %85" },
    { q: "İtiraz oranı", v: pct(r.appealRatio), ok: r.appealRatio <= 0.1, t: "≤ %10" },
    { q: "Tamamlanma (kesinleşen)", v: r.completion.total ? pct(r.completion.finalized / r.completion.total) : "—", ok: r.completion.total > 0 && r.completion.finalized / r.completion.total >= 0.9, t: "≥ %90" },
    { q: "Seviye dağılımı makul mu?", v: `${r.distribution.filter((d) => d.n >= 5 && d.maxShare > 0.6).length} yetkinlikte yığılma`, ok: !r.distribution.some((d) => d.n >= 5 && d.maxShare > 0.6), t: "tek seviyede > %60 yok" },
    { q: "Gelişim planı oranı", v: pct(r.planRatio), ok: r.planRatio >= 0.8, t: "≥ %80" },
    { q: "Yönetici tutarlılığı (|cömertlik| ≤ 0,5)", v: r.managers.length ? pct(r.managers.filter((m) => Math.abs(m.leniency) <= 0.5).length / r.managers.length) : "—", ok: r.managers.length > 0 && r.managers.filter((m) => Math.abs(m.leniency) <= 0.5).length / r.managers.length >= 0.8, t: "≥ %80" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h1 className="text-2xl font-bold text-[var(--brand)]">Raporlar · {cycle.name}</h1><p className="text-sm text-slate-600">Durum: {cycleStatusLabel[cycle.status]} · {r.completion.total} değerlendirme · {r.lines.length} satır. Seviye = mutabık (yoksa kanıtlanmış). Birimler arası sıralama yayımlanmaz; &quot;gelişim alanı&quot; dili kullanılır.</p></div>
        <form className="text-sm"><select name="dongu" defaultValue={cycle.id} className="input">{all.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button className="btn-ghost ml-2">Göster</button></form>
      </div>
      <section className="card"><h2 className="mb-2 font-semibold">Tamamlanma</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-sm">{[["Açılan", r.completion.total], ["Öz-beyan tamam", r.completion.selfDone], ["Yönetici doğrulaması tamam", r.completion.managerDone], ["Kesinleşen", r.completion.finalized]].map(([k, v]) => <div key={String(k)} className="rounded-md bg-slate-50 p-3"><div className="text-xs text-slate-500">{k}</div><div className="text-xl font-bold">{v}</div></div>)}</div>
        {r.pendingEvidence > 0 && <p className="mt-2 text-xs text-amber-700">{r.pendingEvidence} kanıt karar bekliyor.</p>}
      </section>
      <section className="card overflow-x-auto"><h2 className="mb-2 font-semibold">Isı haritası · müdürlük × yetkinlik</h2>
        <table className="table"><thead><tr><th>Müdürlük</th>{r.comps.map((c) => <th key={c.id} title={c.name} className="text-xs">{c.code}</th>)}</tr></thead>
          <tbody>{r.heatmap.map((h) => <tr key={h.unit.id}><td className="font-medium">{h.unit.name}</td>{h.cells.map((c, i) => <td key={i} className={`text-center text-xs ${c ? heat(c.avg, c.avgTarget) : ""}`}>{c ? <><div className="font-semibold">{c.avg.toFixed(1)}</div><div className="text-slate-500">hedef {c.avgTarget.toFixed(1)} · {pct(c.met)}</div></> : "—"}</td>)}</tr>)}</tbody></table>
        <p className="mt-1 text-xs text-slate-500">Hücre: ortalama seviye · ortalama hedef · hedefi karşılayan oran. Yeşil ≥ hedef, sarı &lt; 1 açık, kırmızı ≥ 1 açık.</p>
      </section>
      <section className="card overflow-x-auto"><h2 className="mb-2 font-semibold">Yetkinlik dağılımı, hedef karşılama ve bus factor</h2>
        <table className="table"><thead><tr><th>Yetkinlik</th><th>n</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>Hedef karşılama</th><th>Ort. açık</th><th>Seviye ≥ 3 kişi</th></tr></thead>
          <tbody>{r.distribution.map((d) => <tr key={d.id}><td><span className="text-xs text-slate-500">{d.code}</span> {d.name}</td><td>{d.n}</td>{d.counts.map((c, i) => <td key={i} className={d.n && c / d.n > 0.6 ? "bg-amber-100" : ""}>{c}</td>)}<td className={d.met >= 0.6 ? "" : "text-red-700"}>{pct(d.met)}</td><td>{d.avgGap.toFixed(1)}</td><td className={d.busFactor <= 1 && d.kind === "TEKNIK" ? "font-semibold text-red-700" : ""}>{d.busFactor}</td></tr>)}</tbody></table>
      </section>
      <section className="card"><h2 className="mb-2 font-semibold">Yönetici tutarlılığı (kalibrasyon girdisi)</h2>
        <table className="table"><thead><tr><th>Yönetici</th><th>Ekip</th><th>Ort. seviye</th><th>Cömertlik endeksi</th><th>Kanıt kabul oranı</th><th>Karar sayısı</th></tr></thead>
          <tbody>{r.managers.map((m) => <tr key={m.personId}><td>{m.name}</td><td>{m.team}</td><td>{m.mean.toFixed(2)}</td><td className={Math.abs(m.leniency) > 0.5 ? "text-amber-700 font-semibold" : ""}>{m.leniency > 0 ? "+" : ""}{m.leniency}</td><td>{m.acceptRate == null ? "—" : pct(m.acceptRate)}</td><td>{m.decided}</td></tr>)}{r.managers.length === 0 && <tr><td colSpan={6} className="text-slate-500">Veri yok.</td></tr>}</tbody></table>
        <p className="mt-1 text-xs text-slate-500">Kurum ortalaması {r.overallMean.toFixed(2)}. Cömertlik = yöneticinin ekip ortalaması − kurum ortalaması; ±0,5 dışı kalibrasyonda incelenir. Kalibrasyon seviye yükseltmez, kanıt görevi açar.</p>
      </section>
      <section className="card"><h2 className="mb-2 font-semibold">Kalibrasyon bayrakları ({r.flags.length})</h2>
        {r.flags.length === 0 ? <p className="text-sm text-green-700">Bayrak yok.</p> : <ul className="space-y-1 text-sm">{r.flags.map((f, i) => <li key={i}><span className="badge mr-2 bg-slate-200 text-slate-700">{f.kind}</span>{f.text}</li>)}</ul>}
      </section>
      <section className="card"><h2 className="mb-2 font-semibold">Öğrenim ölçütleri (13 §7)</h2>
        <table className="table"><thead><tr><th>Soru</th><th>Değer</th><th>Hedef</th><th></th></tr></thead>
          <tbody>{learning.map((l) => <tr key={l.q}><td>{l.q}</td><td>{l.v}</td><td className="text-xs text-slate-500">{l.t}</td><td>{l.ok ? <span className="text-green-700">✓</span> : <span className="text-amber-700">△</span>}</td></tr>)}</tbody></table>
        <p className="mt-1 text-xs text-slate-500">Gösterge anlaşılırlığı, kanıt yükü ve adalet algısı anket/ölçümle (10 §4.9) ayrıca toplanır. Genişleme kriteri: dokuz hedefin en az yedisi.</p>
      </section>
    </div>
  );
}

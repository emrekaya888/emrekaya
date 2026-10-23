import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { evidenceStatusLabel, levelNames } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { loadOrgContext } from "@/lib/org";
import { provenForPerson } from "@/lib/proven";
import { EvidenceForm, EvidenceRowActions } from "./forms";

export default async function KanitPage() {
  const s = await requireUser();
  if (!s.personId) return <div className="card text-sm">Hesabınız bir kişiye bağlı değil; kanıt kasası kişiye bağlı hesaplarda açılır.</div>;
  const ctx = await loadOrgContext();
  const roleId = ctx.personRole.get(s.personId) ?? null;
  const comps = roleId ? await provenForPerson(s.personId, roleId) : [];
  const evTypes = await db.select().from(schema.evidenceTypes).where(eq(schema.evidenceTypes.active, true));
  const typeName = new Map(evTypes.map((t) => [t.code, t.name]));
  const mine = await db.query.evidence.findMany({ where: eq(schema.evidence.personId, s.personId), with: { links: { with: { indicator: true } } }, orderBy: [desc(schema.evidence.createdAt)] });
  const statusColor: Record<string, string> = { TASLAK: "bg-slate-200 text-slate-700", SUNULDU: "bg-amber-100 text-amber-800", KABUL: "bg-green-100 text-green-800", EK_BILGI: "bg-orange-100 text-orange-800", RED: "bg-red-100 text-red-800" };
  const missing = comps.reduce((a, c) => a + c.indicators.filter((i) => i.level <= c.targetLevel && !i.proven).length, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--brand)]">Kanıt kasam</h1>
        <p className="text-sm text-slate-600">İlke: &quot;yaparım / bilirim&quot; değil, <strong>yaptım</strong>. Her kanıt bir veya birden çok göstergeye bağlanır; yöneticiniz kabul edince gösterge kanıtlanmış sayılır. Seviye sayı seçilerek değil, kanıtlı göstergelerden hesaplanır.</p>
      </div>
      <section className="card">
        <h2 className="mb-2 font-semibold">Yetkinlik durumum <span className="text-xs font-normal text-slate-500">· hedefe kadar kanıtlanmamış gösterge: {missing}</span></h2>
        {comps.length === 0 ? <p className="text-sm text-amber-700">Rol profiliniz tanımlı değil. İK ekibi <Link href="/rol-profilleri" className="underline">rol profilini</Link> oluşturunca göstergeler burada görünür.</p> : (
          <table className="table"><thead><tr><th>Yetkinlik</th><th>Hedef</th><th>Kanıtlanmış</th><th>Beyan (bekleyen dahil)</th><th>Sonraki seviye</th><th>Eksik gösterge (hedefe kadar)</th></tr></thead>
            <tbody>{comps.map((c) => { const miss = c.indicators.filter((i) => i.level <= c.targetLevel && !i.proven); return (
              <tr key={c.competencyId}><td><span className="text-xs text-slate-500">{c.code}</span> {c.name}</td><td>{c.targetLevel} · {levelNames[c.kind][c.targetLevel]}</td>
                <td className={c.provenLevel >= c.targetLevel ? "text-green-700 font-semibold" : ""}>{c.provenLevel}</td><td>{c.claimedLevel}</td>
                <td><div className="h-2 w-24 rounded bg-slate-200"><div className="h-2 rounded bg-[var(--brand-2)]" style={{ width: `${Math.round(c.nextLevelProgress * 100)}%` }} /></div></td>
                <td className="text-xs">{miss.length === 0 ? <span className="text-green-700">Yok</span> : miss.slice(0, 3).map((m) => <div key={m.id}>S{m.level}{m.mandatory ? " (Z)" : ""}: {m.text}</div>)}{miss.length > 3 && <div>… +{miss.length - 3}</div>}</td></tr>); })}
            </tbody></table>
        )}
      </section>
      <section className="card">
        <h2 className="mb-2 font-semibold">Yeni kanıt</h2>
        <EvidenceForm comps={comps} evTypes={evTypes} />
      </section>
      <section className="card">
        <h2 className="mb-2 font-semibold">Kanıtlarım ({mine.length})</h2>
        <table className="table"><thead><tr><th>Durum</th><th>Ne yaptım</th><th>Tarih</th><th>Tür</th><th>Göstergeler</th><th>Yönetici notu</th><th></th></tr></thead>
          <tbody>
            {mine.map((e) => (
              <tr key={e.id}>
                <td><span className={`badge ${statusColor[e.status]}`}>{evidenceStatusLabel[e.status]}</span>{e.isObservation && <div className="text-xs text-slate-500">gözlem notu</div>}</td>
                <td>{e.whatIDid}{e.result && <div className="text-xs text-slate-500">Sonuç: {e.result}</div>}{e.link && <a href={e.link} target="_blank" className="text-xs underline">bağlantı</a>}{e.filePath && <a href={`/api/kanit/${e.id}/dosya`} target="_blank" className="ml-2 text-xs underline">{e.fileName}</a>}</td>
                <td className="text-xs">{e.startDate ? `${e.startDate} → ` : ""}{e.endDate}</td>
                <td className="text-xs">{typeName.get(e.typeCode) ?? e.typeCode}</td>
                <td className="text-xs">{e.links.map((l) => <div key={l.id}>S{l.indicator.level}: {l.indicator.text.slice(0, 60)}{l.indicator.text.length > 60 ? "…" : ""}</div>)}</td>
                <td className="text-xs">{e.managerNote ?? "—"}</td>
                <td><EvidenceRowActions id={e.id} status={e.status} whatIDid={e.whatIDid} result={e.result} /></td>
              </tr>
            ))}
            {mine.length === 0 && <tr><td colSpan={7} className="text-slate-500">Henüz kanıt yok.</td></tr>}
          </tbody></table>
      </section>
    </div>
  );
}

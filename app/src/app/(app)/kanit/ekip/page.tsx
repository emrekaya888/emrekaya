import { and, desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { evidenceStatusLabel } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { loadOrgContext, teamOf, unitPathName } from "@/lib/org";
import { provenForPerson } from "@/lib/proven";
import { DecideControls, ObservationForm } from "../forms";

export default async function EkipKanitPage() {
  const s = await requireUser();
  const ctx = await loadOrgContext();
  const isAdmin = hasRole(s, "IK_ADMIN");
  const teamIds = isAdmin ? [...ctx.personUnit.keys()] : s.personId ? teamOf(ctx, s.personId) : [];
  if (!teamIds.length) return <div className="card text-sm">Ekibinizde kimse yok veya bir birimin yöneticisi olarak atanmadınız (Kurulum → Birimler → Yönetici).</div>;
  const evTypes = await db.select().from(schema.evidenceTypes);
  const typeName = new Map(evTypes.map((t) => [t.code, t.name]));
  const pending = await db.query.evidence.findMany({ where: and(inArray(schema.evidence.personId, teamIds), eq(schema.evidence.status, "SUNULDU")), with: { links: { with: { indicator: true } } }, orderBy: [desc(schema.evidence.createdAt)] });
  const members = await Promise.all(teamIds.map(async (pid) => {
    const roleId = ctx.personRole.get(pid);
    const comps = roleId ? await provenForPerson(pid, roleId) : [];
    return { pid, person: ctx.people.get(pid)!, unit: unitPathName(ctx, ctx.personUnit.get(pid)), comps, pendingCount: pending.filter((e) => e.personId === pid).length };
  }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--brand)]">Ekibimin kanıtları</h1>
        <p className="text-sm text-slate-600">Kanıt kalitesi kılavuzu: <strong>Kabul</strong> = somut, tarihli, doğrulanabilir ve göstergenin seviyesinde · <strong>Ek bilgi</strong> = ne/ne zaman/sonuç eksik · <strong>Red</strong> = beyan, yargı veya başka seviyeye ait. Red ve ek bilgi gerekçesiz olamaz. &quot;Hak ediyor ama kanıt yok&quot; seviye vermez; gözlem notu ekleyin veya kanıt isteyin.</p>
      </div>
      <section className="card">
        <h2 className="mb-2 font-semibold">Bekleyen kanıtlar ({pending.length})</h2>
        <table className="table"><thead><tr><th>Kişi</th><th>Ne yaptı</th><th>Tarih</th><th>Tür</th><th>Göstergeler</th><th>Karar</th></tr></thead>
          <tbody>
            {pending.map((e) => (
              <tr key={e.id}>
                <td className="font-medium">{ctx.people.get(e.personId)?.fullName}</td>
                <td>{e.whatIDid}{e.result && <div className="text-xs text-slate-500">Sonuç: {e.result}</div>}{e.verifier && <div className="text-xs text-slate-500">Doğrular: {e.verifier}</div>}{e.link && <a href={e.link} target="_blank" className="text-xs underline">bağlantı</a>}{e.filePath && <a href={`/api/kanit/${e.id}/dosya`} target="_blank" className="ml-2 text-xs underline">{e.fileName}</a>}</td>
                <td className="text-xs">{e.endDate}</td><td className="text-xs">{typeName.get(e.typeCode)}</td>
                <td className="text-xs">{e.links.map((l) => <div key={l.id}>S{l.indicator.level}{l.indicator.mandatory ? " (Z)" : ""}: {l.indicator.text}</div>)}</td>
                <td className="w-72"><DecideControls id={e.id} /></td>
              </tr>
            ))}
            {pending.length === 0 && <tr><td colSpan={6} className="text-slate-500">Bekleyen kanıt yok.</td></tr>}
          </tbody></table>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Ekip üyeleri ({members.length})</h2>
        {members.map((m) => (
          <div key={m.pid} className="card space-y-2">
            <div className="flex flex-wrap items-baseline gap-2"><span className="font-medium">{m.person.fullName}</span><span className="text-xs text-slate-500">{m.unit}</span>{m.pendingCount > 0 && <span className="badge bg-amber-100 text-amber-800">{m.pendingCount} bekleyen</span>}</div>
            {m.comps.length === 0 ? <p className="text-xs text-amber-700">Rol profili yok.</p> : (
              <div className="flex flex-wrap gap-2 text-xs">{m.comps.map((c) => <span key={c.competencyId} className={`badge ${c.provenLevel >= c.targetLevel ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"}`}>{c.code}: {c.provenLevel}/{c.targetLevel}</span>)}</div>
            )}
            {<ObservationForm personId={m.pid} personName={m.person.fullName} comps={m.comps} />}
          </div>
        ))}
      </section>
      <p className="text-xs text-slate-500">Durumlar: {Object.values(evidenceStatusLabel).join(" · ")}</p>
    </div>
  );
}

import { and, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { activeCycle, assessmentView } from "@/lib/cycle";
import { loadOrgContext } from "@/lib/org";
import { AppealDecision, Level5Decision } from "../controls";

export default async function UstDogrulamaPage() {
  const s = await requireUser();
  if (!hasRole(s, "IK_ADMIN", "UST_DOGRULAYICI")) return <div className="card text-sm">Bu sayfa üst doğrulayıcı (grup müdürü) ve İK admin içindir.</div>;
  const cycle = await activeCycle();
  if (!cycle) return <div className="card text-sm">Açık döngü yok.</div>;
  const ctx = await loadOrgContext();
  const { assessmentLines, assessments } = schema;
  const l5 = await db.select({ lineId: assessmentLines.id, assessmentId: assessmentLines.assessmentId }).from(assessmentLines).innerJoin(assessments, eq(assessments.id, assessmentLines.assessmentId))
    .where(and(eq(assessments.cycleId, cycle.id), eq(assessmentLines.level5Candidate, true), isNull(assessmentLines.level5Validated)));
  const appeals = await db.select({ lineId: assessmentLines.id, assessmentId: assessmentLines.assessmentId }).from(assessmentLines).innerJoin(assessments, eq(assessments.id, assessmentLines.assessmentId))
    .where(and(eq(assessments.cycleId, cycle.id), eq(assessmentLines.appealFlag, true)));
  const viewCache = new Map<number, Awaited<ReturnType<typeof assessmentView>>>();
  const getView = async (id: number) => { if (!viewCache.has(id)) viewCache.set(id, await assessmentView(id)); return viewCache.get(id)!; };
  const l5Rows = await Promise.all(l5.map(async (r) => { const v = await getView(r.assessmentId); return { ...r, v, line: v?.lines.find((x) => x.lineId === r.lineId) }; }));
  const apRows = await Promise.all(appeals.map(async (r) => { const v = await getView(r.assessmentId); return { ...r, v, line: v?.lines.find((x) => x.lineId === r.lineId) }; }));
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--brand)]">Üst doğrulama ve itirazlar · {cycle.name}</h1><p className="text-sm text-slate-600">Seviye 5 iddiaları üst onay olmadan verilmez. İtiraz kararı kanıt üzerinden ve gerekçeli olur; kanıtsız yükseltme yapılamaz.</p></div>
      <section className="card"><h2 className="mb-2 font-semibold">Seviye 5 onay bekleyenler ({l5Rows.length})</h2>
        <table className="table"><thead><tr><th>Kişi</th><th>Yetkinlik</th><th>Kanıtlı göstergeler (S5)</th><th>Karar</th></tr></thead>
          <tbody>{l5Rows.map((r) => <tr key={r.lineId}><td>{ctx.people.get(r.v!.assessment.personId)?.fullName}</td><td>{r.line?.code} · {r.line?.name}</td><td className="text-xs">{r.line?.indicators.filter((i) => i.level === 5 && i.proven).map((i) => <div key={i.id}>{i.text}</div>)}</td><td><Level5Decision lineId={r.lineId} /></td></tr>)}
            {l5Rows.length === 0 && <tr><td colSpan={4} className="text-slate-500">Bekleyen yok.</td></tr>}</tbody></table></section>
      <section className="card"><h2 className="mb-2 font-semibold">İtirazlar ({apRows.length})</h2>
        <table className="table"><thead><tr><th>Kişi</th><th>Yetkinlik</th><th>Öz-beyan / Kanıtlanmış / Mutabık</th><th>İtiraz gerekçesi</th><th>Karar</th></tr></thead>
          <tbody>{apRows.map((r) => <tr key={r.lineId}><td>{ctx.people.get(r.v!.assessment.personId)?.fullName}</td><td>{r.line?.code} · {r.line?.name}</td><td>{r.line?.selfLevel} / {r.line?.provenLevel} / {r.line?.agreedLevel}</td><td className="text-xs">{r.line?.appealReason}</td><td><AppealDecision lineId={r.lineId} provenLevel={r.line?.provenLevel ?? 0} agreedLevel={r.line?.agreedLevel ?? 0} /></td></tr>)}
            {apRows.length === 0 && <tr><td colSpan={5} className="text-slate-500">İtiraz yok.</td></tr>}</tbody></table></section>
    </div>
  );
}

import Link from "next/link";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { assessmentStatusLabel, cycleStatusLabel } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { loadOrgContext, teamOf } from "@/lib/org";
import { activeCycle, assessmentView } from "@/lib/cycle";
import { AgreementForm, ManagerComplete } from "../controls";

export default async function EkipDegerlendirmePage() {
  const s = await requireUser();
  const cycle = await activeCycle();
  if (!cycle) return <div className="card text-sm">Açık döngü yok.</div>;
  const ctx = await loadOrgContext();
  const isAdmin = hasRole(s, "IK_ADMIN");
  const team = isAdmin ? [...ctx.personUnit.keys()] : s.personId ? teamOf(ctx, s.personId) : [];
  const as = team.length ? await db.select().from(schema.assessments).where(and(eq(schema.assessments.cycleId, cycle.id), inArray(schema.assessments.personId, team))) : [];
  const views = await Promise.all(as.map((a) => assessmentView(a.id)));
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--brand)]">Ekibimin değerlendirmeleri · {cycle.name}</h1>
        <p className="text-sm text-slate-600">Döngü aşaması: <strong>{cycleStatusLabel[cycle.status]}</strong>. Sıra: kanıtları karara bağla (<Link href="/kanit/ekip" className="underline">Ekibimin kanıtları</Link>) → doğrulamayı tamamla → mutabakat görüşmesi → mutabakatı gönder. Mutabık seviye kanıtlanmış seviyeyi aşamaz; &quot;hak ediyor ama kanıt yok&quot; seviye vermez.</p></div>
      {views.filter(Boolean).map((v) => {
        const a = v!.assessment; const lines = v!.lines;
        const pendingEv = lines.reduce((x, l) => x + l.indicators.reduce((y, i) => y + i.pendingCount, 0), 0);
        return (
          <section key={a.id} className="card space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-semibold">{ctx.people.get(a.personId)?.fullName}</h2><span className="badge bg-slate-200 text-slate-700">{assessmentStatusLabel[a.status]}</span></div>
            <div className="flex flex-wrap gap-2 text-xs">{lines.map((l) => <span key={l.lineId} className={`badge ${l.provenLevel >= l.targetLevel ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"}`}>{l.code}: beyan {l.selfLevel ?? l.claimedLevel} · kanıtlı {l.provenLevel} / hedef {l.targetLevel}{l.agreedLevel != null ? ` · mutabık ${l.agreedLevel}` : ""}</span>)}</div>
            <ManagerComplete assessmentId={a.id} pendingEvidence={pendingEv} status={a.status} />
            {a.status === "UST_DOGRULAMADA" && <p className="text-xs text-amber-700">Seviye 5 iddiası üst doğrulamada; onay gelince mutabakat açılır.</p>}
            {["YONETICI_TAMAM", "MUTABAKATTA", "ITIRAZDA"].includes(a.status) && (cycle.status === "YONETICI" || cycle.status === "MUTABAKAT") && (
              <details open={a.status === "YONETICI_TAMAM"}><summary className="cursor-pointer text-sm font-medium">Mutabakat {a.status === "MUTABAKATTA" ? "(gönderildi; çalışan yanıtı bekleniyor)" : a.status === "ITIRAZDA" ? "(itirazda)" : ""}</summary><div className="mt-2"><AgreementForm assessmentId={a.id} lines={lines} initialNote={a.meetingNote ?? ""} /></div></details>
            )}
            {a.status === "KESINLESTI" && <p className="text-xs text-green-700">Kesinleşti{a.employeeApprovedAt ? " (çalışan onayıyla)" : " (itiraz kararıyla)"}.</p>}
          </section>
        );
      })}
      {as.length === 0 && <p className="text-sm text-slate-500">Ekibinizde bu döngüde değerlendirme yok.</p>}
    </div>
  );
}

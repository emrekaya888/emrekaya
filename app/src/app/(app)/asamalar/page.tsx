import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { computeStages } from "@/lib/stages";
import { StageControls } from "./controls";

export default async function AsamalarPage() {
  const s = await requireUser();
  const isAdmin = hasRole(s, "IK_ADMIN");
  const { stages, currentIndex } = await computeStages();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--brand)]">Aşamalar</h1>
        <p className="text-sm text-slate-600">Sistem etap etap kurulur. Her aşamanın çıkış kriterleri otomatik kontrol edilir; sağlanınca İK &quot;Aşamayı tamamla&quot; der ve sıradaki aşama açılır. Zorunlu kontroller sağlanmadan geçmek gerekçe ister ve denetim izine yazılır.</p>
      </div>
      <ol className="flex flex-wrap gap-2 text-xs">
        {stages.map((st, i) => (
          <li key={st.key} className={`rounded-full px-3 py-1 ${st.confirmed ? "bg-green-100 text-green-800" : i === currentIndex ? "bg-[var(--brand)] text-white" : "bg-slate-200 text-slate-600"}`}>{st.order}. {st.title}</li>
        ))}
      </ol>
      {stages.map((st, i) => {
        const isCurrent = i === currentIndex && !st.confirmed;
        return (
          <section key={st.key} className={`card space-y-3 ${isCurrent ? "border-[var(--brand-2)] ring-1 ring-[var(--brand-2)]" : ""}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold">{st.order}. {st.title} {isCurrent && <span className="badge bg-sky-100 text-sky-800">şu an buradasınız</span>}{st.confirmed && <span className="badge bg-green-100 text-green-800">tamamlandı</span>}{!st.implemented && <span className="badge bg-slate-200 text-slate-600">ekranlar sonraki sprintte</span>}</h2>
              {st.confirmed && <span className="text-xs text-slate-500">{new Date(st.confirmed.at).toLocaleDateString("tr-TR")} · {st.confirmed.byEmail}{st.confirmed.note ? ` · ${st.confirmed.note}` : ""}</span>}
            </div>
            <p className="text-sm text-slate-600">{st.summary}</p>
            {st.checks.length > 0 && (
              <ul className="space-y-1 text-sm">
                {st.checks.map((c) => <li key={c.label} className="flex items-start gap-2"><span className={c.ok ? "text-green-700" : c.required ? "text-red-700" : "text-amber-700"}>{c.ok ? "✓" : c.required ? "✗" : "△"}</span><span>{c.label} <span className="text-xs text-slate-500">— {c.detail}{!c.required && !c.ok ? " (öneri)" : ""}</span></span></li>)}
              </ul>
            )}
            <div className="rounded-md bg-slate-50 p-3 text-sm">
              <div className="mb-1 font-medium">Bu aşamada yapılacaklar</div>
              <ul className="list-disc space-y-1 pl-5">{st.guidance.map((g) => <li key={g}>{g}</li>)}</ul>
              {st.links.length > 0 && <div className="mt-2 flex gap-3 text-xs">{st.links.map((l) => <Link key={l.href} href={l.href} className="underline">{l.label} →</Link>)}</div>}
            </div>
            {(isCurrent || st.confirmed) && <StageControls stageKey={st.key} confirmed={!!st.confirmed} autoOk={st.autoOk} canEdit={isAdmin} implemented={st.implemented} />}
          </section>
        );
      })}
    </div>
  );
}

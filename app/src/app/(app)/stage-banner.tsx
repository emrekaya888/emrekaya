import Link from "next/link";
import { computeStages } from "@/lib/stages";

export async function StageBanner() {
  const { stages, currentIndex } = await computeStages();
  const st = stages[currentIndex];
  const next = st.checks.find((c) => !c.ok && c.required) ?? st.checks.find((c) => !c.ok);
  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 border-[var(--brand-2)]">
      <div className="text-sm">
        <div className="text-xs uppercase tracking-wide text-[var(--brand-2)]">Aşama {st.order} / {stages.length}</div>
        <div className="font-semibold">{st.title}</div>
        <div className="text-slate-600">{next ? `Sıradaki adım: ${next.label} (${next.detail})` : st.autoOk ? "Çıkış kriterleri sağlandı; İK aşamayı tamamlayabilir." : st.guidance[0]}</div>
      </div>
      <Link href="/asamalar" className="btn-primary">Aşamalar ve rehber</Link>
    </div>
  );
}

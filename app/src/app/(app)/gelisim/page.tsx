import { requireUser } from "@/lib/auth";
import { loadOrgContext } from "@/lib/org";
import { PlanView } from "./plan-view";

export default async function GelisimPage() {
  const s = await requireUser();
  if (!s.personId) return <div className="card text-sm">Hesabınız bir kişiye bağlı değil.</div>;
  const ctx = await loadOrgContext();
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-[var(--brand)]">Gelişim planım</h1><p className="text-sm text-slate-600">Eksik gösterge = yapılacak iş. 3–5 öncelikle sınırlı kalın; eylemlerin çoğu iş başında (%70), bir kısmı mentorla (%20), azı eğitimle (%10). Yöneticiniz planı onaylayınca kaynak (görev, proje) taahhüdü verilmiş olur.</p></div>
      <PlanView personId={s.personId} roleId={ctx.personRole.get(s.personId) ?? null} canApprove={false} title="Planım" />
    </div>
  );
}

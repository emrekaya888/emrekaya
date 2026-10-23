import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { loadOrgContext, teamOf } from "@/lib/org";
import { PlanView } from "../plan-view";

export default async function EkipGelisimPage() {
  const s = await requireUser();
  const ctx = await loadOrgContext();
  const team = hasRole(s, "IK_ADMIN") ? [...ctx.personUnit.keys()] : s.personId ? teamOf(ctx, s.personId) : [];
  if (!team.length) return <div className="card text-sm">Ekibinizde kimse yok.</div>;
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--brand)]">Ekibimin gelişim planları</h1><p className="text-sm text-slate-600">Planı onaylamak, eylemler için iş vermeyi (görev, proje, gölgeleme) taahhüt etmektir. Yönetici iş vermezse plan kâğıtta kalır (09 P13).</p></div>
      {team.map((pid) => <section key={pid} className="card"><PlanView personId={pid} roleId={ctx.personRole.get(pid) ?? null} canApprove title={ctx.people.get(pid)?.fullName ?? String(pid)} /></section>)}
    </div>
  );
}

import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { actionStatusLabel, actionTypeLabel, planStatusLabel } from "@/db/labels";
import { latestCycleId, prioritiesFor } from "@/lib/development";
import { ActionRowControls, AddActionForm, ApproveButton } from "./forms";

export async function PlanView({ personId, roleId, canApprove, title }: { personId: number; roleId: number | null; canApprove: boolean; title: string }) {
  const cycleId = await latestCycleId();
  const prios = roleId ? await prioritiesFor(personId, roleId, cycleId) : [];
  const plan = await db.query.developmentPlans.findFirst({ where: and(eq(schema.developmentPlans.personId, personId), cycleId ? eq(schema.developmentPlans.cycleId, cycleId) : undefined), with: { actions: { with: { competency: true, indicator: true } } } });
  const mentorName = new Map((await db.select({ id: schema.people.id, name: schema.people.fullName }).from(schema.people)).map((p) => [p.id, p.name]));
  const top = prios.filter((p) => p.score > 0).slice(0, 3);
  const byType = (t: string) => (plan?.actions ?? []).filter((a) => a.actionType === t && a.status !== "IPTAL").length;
  const total = (plan?.actions ?? []).filter((a) => a.status !== "IPTAL").length;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-semibold">{title}</h2>{plan && <span className="badge bg-slate-200 text-slate-700">Plan: {planStatusLabel[plan.status]}</span>}</div>
      <div className="card">
        <h3 className="mb-1 font-medium">İlk 3 öncelik <span className="text-xs text-slate-500">(açık × ağırlık × kritiklik)</span></h3>
        {top.length === 0 ? <p className="text-sm text-green-700">Hedefe kadar açık yok ya da rol profili tanımlı değil.</p> : (
          <div className="space-y-3">{top.map((p, i) => (
            <div key={p.competencyId} className="rounded-md border border-slate-200 p-2 text-sm">
              <div className="flex flex-wrap items-baseline gap-2"><span className="font-semibold">{i + 1}. {p.code} · {p.name}</span><span className="text-xs text-slate-500">mevcut {p.agreedLevel} → hedef {p.targetLevel} · öncelik {p.score} · eksik gösterge {p.missing.length}</span></div>
              {p.mentors.length > 0 && <div className="text-xs text-slate-600">Mentor adayları: {p.mentors.map((m) => `${m.name} (${m.level})`).join(", ")}</div>}
              <AddActionForm personId={personId} priority={p} mentors={p.mentors} />
            </div>))}</div>
        )}
      </div>
      <div className="card">
        <h3 className="mb-1 font-medium">Plan eylemleri ({total}) <span className="text-xs font-normal text-slate-500">· iş başında {byType("ISBASINDA")} · mentor {byType("ILISKI")} · eğitim {byType("EGITIM")}</span></h3>
        <table className="table"><thead><tr><th>Yetkinlik</th><th>Gösterge</th><th>Eylem</th><th>Tür</th><th>Mentor</th><th>Bitiş</th><th>Durum</th></tr></thead>
          <tbody>{(plan?.actions ?? []).map((a) => <tr key={a.id}><td className="text-xs">{a.competency.code}<div>{a.currentLevel}→{a.targetLevel}</div></td><td className="text-xs">{a.indicator ? `S${a.indicator.level}: ${a.indicator.text}` : "—"}</td><td>{a.description}</td><td className="text-xs">{actionTypeLabel[a.actionType]}</td><td className="text-xs">{a.mentorPersonId ? mentorName.get(a.mentorPersonId) : "—"}</td><td className="text-xs">{a.dueDate ?? "—"}</td><td><ActionRowControls id={a.id} status={a.status} progress={a.progress} /></td></tr>)}
            {total === 0 && <tr><td colSpan={7} className="text-slate-500">Eylem yok. Önceliklerden eylem ekleyin (eksik gösterge = yapılacak iş).</td></tr>}</tbody></table>
        <p className="mt-1 text-xs text-slate-500">Durumlar: {Object.values(actionStatusLabel).join(" · ")}. Eylem tamamlanınca kanıtı kanıt kasasına ekleyin; ara döngüde yeniden değerlendirilir.</p>
        {canApprove && plan && plan.status === "TASLAK" && total > 0 && <div className="mt-2"><ApproveButton planId={plan.id} /></div>}
      </div>
    </div>
  );
}

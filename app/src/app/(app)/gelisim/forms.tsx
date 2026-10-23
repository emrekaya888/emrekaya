"use client";
import { useActionState, useState, useTransition } from "react";
import type { Priority } from "@/lib/development";
import { actionTypeLabel } from "@/db/labels";
import { addActionAction, approvePlanAction, deleteActionAction, updateActionAction, type ActionState } from "./actions";

export function AddActionForm({ personId, priority, mentors }: { personId: number; priority: Priority; mentors: { personId: number; name: string; level: number; load: number }[] }) {
  const [state, action, pending] = useActionState(addActionAction, undefined);
  const [indicatorId, setIndicatorId] = useState<string>(priority.missing[0] ? String(priority.missing[0].id) : "");
  const chosen = priority.missing.find((m) => String(m.id) === indicatorId);
  return (
    <form action={action} className="space-y-2 rounded-md border border-dashed border-slate-300 p-2 text-sm">
      <input type="hidden" name="personId" value={personId} /><input type="hidden" name="competencyId" value={priority.competencyId} />
      <input type="hidden" name="currentLevel" value={priority.agreedLevel} /><input type="hidden" name="targetLevel" value={priority.targetLevel} /><input type="hidden" name="priorityScore" value={priority.score} />
      <label className="block">Hangi göstergeyi kanıtlayacak?<select name="indicatorId" value={indicatorId} onChange={(e) => setIndicatorId(e.target.value)} className="input"><option value="">(genel)</option>{priority.missing.map((m) => <option key={m.id} value={m.id}>S{m.level}{m.mandatory ? " (Z)" : ""}: {m.text}</option>)}</select></label>
      <label className="block">Eylem (somut iş; &quot;eğitime git&quot; değil)<input name="description" required className="input" defaultValue={chosen ? `${chosen.text} — bunu kanıtlayacak iş: ` : ""} /></label>
      <div className="flex flex-wrap gap-2">
        <label>Tür<select name="actionType" className="input">{Object.entries(actionTypeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>Mentor<select name="mentorPersonId" className="input"><option value="">—</option>{mentors.map((m) => <option key={m.personId} value={m.personId}>{m.name} (seviye {m.level}, {m.load} menti)</option>)}</select></label>
        <label>Bitiş<input name="dueDate" type="date" className="input" /></label>
      </div>
      {state?.error && <p className="text-red-700">{state.error}</p>}{state?.ok && <p className="text-green-700">{state.ok}</p>}
      <button disabled={pending} className="btn-primary">Eylem ekle</button>
    </form>
  );
}

export function ActionRowControls({ id, status, progress }: { id: number; status: string; progress: number }) {
  const [p, setP] = useState(progress); const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <select defaultValue={status} disabled={pending} className="input w-32 py-1" onChange={(e) => start(async () => setMsg(await updateActionAction(id, e.target.value as "PLANLANDI" | "DEVAM" | "TAMAMLANDI" | "IPTAL", p)))}>{["PLANLANDI", "DEVAM", "TAMAMLANDI", "IPTAL"].map((s) => <option key={s} value={s}>{s}</option>)}</select>
      <input type="number" min={0} max={100} value={p} onChange={(e) => setP(Number(e.target.value))} onBlur={() => start(async () => setMsg(await updateActionAction(id, status as "PLANLANDI" | "DEVAM" | "TAMAMLANDI" | "IPTAL", p)))} className="input w-16 py-1" />%
      <button className="text-red-700 underline" disabled={pending} onClick={() => { if (confirm("Eylem silinsin mi?")) start(async () => setMsg(await deleteActionAction(id))); }}>sil</button>
      {msg?.error && <span className="text-red-700">{msg.error}</span>}{msg?.ok && <span className="text-green-700">{msg.ok}</span>}
    </div>
  );
}

export function ApproveButton({ planId }: { planId: number }) {
  const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  return <span className="inline-flex items-center gap-2"><button className="btn-primary py-1" disabled={pending} onClick={() => start(async () => setMsg(await approvePlanAction(planId)))}>Planı onayla (kaynak taahhüdü)</button>{msg?.error && <span className="text-xs text-red-700">{msg.error}</span>}{msg?.ok && <span className="text-xs text-green-700">{msg.ok}</span>}</span>;
}

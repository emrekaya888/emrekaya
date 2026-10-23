"use client";
import { useActionState, useState, useTransition } from "react";
import { addProfileRowAction, applyBehavioralDefaultsAction, clearProfileAction, copyFromRoleAction, removeProfileRowAction, updateProfileRowAction, type ActionState } from "./actions";

export function ApplyDefaultsButton() {
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [pending, start] = useTransition();
  return (
    <span className="flex items-center gap-2 text-sm">
      <button className="btn-primary" disabled={pending} onClick={() => start(async () => setMsg(await applyBehavioralDefaultsAction()))}>Çekirdek ve liderlik yetkinliklerini rollere uygula</button>
      {msg?.ok && <span className="text-green-700">{msg.ok}</span>}{msg?.error && <span className="text-red-700">{msg.error}</span>}
    </span>
  );
}

export function RowControls({ rowId, targetLevel, weight, mandatory, editable }: { rowId: number; targetLevel: number; weight: number; mandatory: boolean; editable: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<ActionState>(undefined);
  const upd = (field: "targetLevel" | "weight" | "mandatory", v: number | boolean) => start(async () => setMsg(await updateProfileRowAction(rowId, field, v)));
  if (!editable) return <><td>{targetLevel}</td><td>{weight}</td><td>{mandatory ? "Evet" : "—"}</td><td></td></>;
  return (
    <>
      <td><select defaultValue={targetLevel} disabled={pending} className="input w-16 py-1" onChange={(e) => upd("targetLevel", Number(e.target.value))}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></td>
      <td><select defaultValue={weight} disabled={pending} className="input w-16 py-1" onChange={(e) => upd("weight", Number(e.target.value))}>{[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}</select></td>
      <td><input type="checkbox" defaultChecked={mandatory} disabled={pending} onChange={(e) => upd("mandatory", e.target.checked)} /></td>
      <td className="whitespace-nowrap text-xs">
        <button className="text-red-700 underline" disabled={pending} onClick={() => { if (confirm("Satır kaldırılsın mı?")) start(async () => setMsg(await removeProfileRowAction(rowId))); }}>kaldır</button>
        {msg?.error && <span className="ml-2 text-red-700">{msg.error}</span>}
      </td>
    </>
  );
}

export function AddRowForm({ roleId, options }: { roleId: number; options: { id: number; label: string }[] }) {
  const [state, action, pending] = useActionState(addProfileRowAction.bind(null, roleId), undefined);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2 text-sm">
      <label>Yetkinlik<select name="competencyId" required className="input w-80">{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
      <label>Hedef<select name="targetLevel" defaultValue={3} className="input w-16">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      <label>Ağırlık<select name="weight" defaultValue={2} className="input w-16">{[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      <label className="flex items-center gap-1 pb-2"><input type="checkbox" name="mandatory" /> Zorunlu</label>
      <button disabled={pending || options.length === 0} className="btn-primary">Ekle</button>
      {state?.ok && <span className="text-green-700">{state.ok}</span>}{state?.error && <span className="text-red-700">{state.error}</span>}
    </form>
  );
}

export function CopyControls({ roleId, sources }: { roleId: number; sources: { id: number; label: string }[] }) {
  const [src, setSrc] = useState<number>(sources[0]?.id ?? 0);
  const [plus, setPlus] = useState(1);
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span>Başka rolden kopyala:</span>
      <select value={src} onChange={(e) => setSrc(Number(e.target.value))} className="input w-72 py-1">{sources.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
      <span>hedef</span>
      <select value={plus} onChange={(e) => setPlus(Number(e.target.value))} className="input w-20 py-1"><option value={-1}>−1</option><option value={0}>aynı</option><option value={1}>+1</option></select>
      <button className="btn-ghost" disabled={pending || !src} onClick={() => start(async () => setMsg(await copyFromRoleAction(roleId, src, plus)))}>Kopyala</button>
      <button className="text-xs text-red-700 underline" disabled={pending} onClick={() => { if (confirm("Bu rolün tüm profil satırları silinsin mi?")) start(async () => setMsg(await clearProfileAction(roleId))); }}>profili temizle</button>
      {msg?.ok && <span className="text-green-700">{msg.ok}</span>}{msg?.error && <span className="text-red-700">{msg.error}</span>}
    </div>
  );
}

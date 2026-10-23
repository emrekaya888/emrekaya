"use client";
import { useActionState, useState, useTransition, type ReactNode } from "react";
import type { ActionState } from "./actions";

export function ActionForm({ action, children, submit, className }: { action: (p: ActionState, fd: FormData) => Promise<ActionState>; children: ReactNode; submit: string; className?: string }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className ?? "grid gap-2 md:grid-cols-4 items-end text-sm"}>
      {children}
      <div className="flex items-center gap-2"><button disabled={pending} className="btn-primary">{pending ? "…" : submit}</button></div>
      {state?.error && <p className="rounded-md bg-red-50 p-2 text-red-700 md:col-span-4">{state.error}</p>}
      {state?.ok && <p className="rounded-md bg-green-50 p-2 text-green-700 md:col-span-4">{state.ok}</p>}
    </form>
  );
}

export function ConfirmButton({ label, confirmText, onConfirm, className }: { label: string; confirmText: string; onConfirm: () => Promise<ActionState>; className?: string }) {
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" disabled={pending} className={className ?? "text-xs text-red-700 underline"} onClick={() => { if (confirm(confirmText)) start(async () => setMsg(await onConfirm())); }}>{label}</button>
      {msg?.error && <span className="text-xs text-red-700">{msg.error}</span>}
    </span>
  );
}

export function InlineRename({ initial, onSave }: { initial: string; onSave: (name: string) => Promise<ActionState> }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const [pending, start] = useTransition();
  if (!editing) return <button type="button" className="text-xs text-slate-500 underline" onClick={() => setEditing(true)}>yeniden adlandır</button>;
  return (
    <span className="inline-flex items-center gap-1">
      <input value={value} onChange={(e) => setValue(e.target.value)} className="input w-56 py-1" />
      <button type="button" disabled={pending} className="btn-ghost py-1" onClick={() => start(async () => { await onSave(value); setEditing(false); })}>Kaydet</button>
      <button type="button" className="text-xs underline" onClick={() => { setValue(initial); setEditing(false); }}>vazgeç</button>
    </span>
  );
}

export function SelectAction({ options, value, onChange, emptyLabel }: { options: { id: number; label: string }[]; value: number | null; onChange: (id: number | null) => Promise<ActionState>; emptyLabel: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<ActionState>(undefined);
  return (
    <span className="inline-flex items-center gap-1">
      <select disabled={pending} defaultValue={value ?? ""} className="input w-56 py-1" onChange={(e) => start(async () => setMsg(await onChange(e.target.value ? Number(e.target.value) : null)))}>
        <option value="">{emptyLabel}</option>
        {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      {msg?.error && <span className="text-xs text-red-700">{msg.error}</span>}
    </span>
  );
}

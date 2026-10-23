"use client";
import { useActionState } from "react";
import type { ActionState } from "./actions";
import { competencySubKindLabel, futureTrendLabel } from "@/db/labels";

export interface CompetencyFormValues { code: string; name: string; kind: "TEKNIK" | "DAVRANISSAL"; subKind: string | null; definition: string; boundaryNote: string | null; futureTrend: string; defaultCriticality: number; ownerOrgUnitId: number | null }

export function CompetencyForm({ action, initial, units, submitLabel }: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  initial?: Partial<CompetencyFormValues>; units: { id: number; name: string }[]; submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const kind = initial?.kind ?? "TEKNIK";
  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <label className="text-sm"><span className="mb-1 block">Kod</span><input name="code" defaultValue={initial?.code ?? ""} required className="input" placeholder="T-IK-001 veya D-C-01" /></label>
      <label className="text-sm"><span className="mb-1 block">Ad (isim tamlaması, araç adı değil)</span><input name="name" defaultValue={initial?.name ?? ""} required className="input" /></label>
      <label className="text-sm"><span className="mb-1 block">Tür</span>
        <select name="kind" defaultValue={kind} className="input"><option value="TEKNIK">Teknik beceri</option><option value="DAVRANISSAL">Davranışsal yetkinlik</option></select></label>
      <label className="text-sm"><span className="mb-1 block">Alt tür / kategori</span>
        <select name="subKind" defaultValue={initial?.subKind ?? ""} className="input"><option value="">—</option>{Object.entries(competencySubKindLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="text-sm md:col-span-2"><span className="mb-1 block">Tanım (1–2 cümle; ne ve ne için; yargı sözcüğü yok)</span><textarea name="definition" defaultValue={initial?.definition ?? ""} rows={2} className="input" /></label>
      <label className="text-sm md:col-span-2"><span className="mb-1 block">Sınır cümlesi (komşu yetkinlikten farkı)</span><textarea name="boundaryNote" defaultValue={initial?.boundaryNote ?? ""} rows={2} className="input" /></label>
      <label className="text-sm"><span className="mb-1 block">Gelecek eğilimi</span>
        <select name="futureTrend" defaultValue={initial?.futureTrend ?? "STABIL"} className="input">{Object.entries(futureTrendLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="text-sm"><span className="mb-1 block">Varsayılan kritiklik (1 destekleyici · 2 önemli · 3 çekirdek)</span>
        <select name="defaultCriticality" defaultValue={String(initial?.defaultCriticality ?? 2)} className="input"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label>
      <label className="text-sm md:col-span-2"><span className="mb-1 block">Sahip birim (teknik beceriler için müdürlük)</span>
        <select name="ownerOrgUnitId" defaultValue={initial?.ownerOrgUnitId ? String(initial.ownerOrgUnitId) : ""} className="input"><option value="">—</option>{units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
      {state?.error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700 md:col-span-2">{state.error}</p>}
      {state?.ok && <p className="rounded-md bg-green-50 p-2 text-sm text-green-700 md:col-span-2">{state.ok}</p>}
      <div className="md:col-span-2"><button disabled={pending} className="btn-primary">{pending ? "Kaydediliyor…" : submitLabel}</button></div>
    </form>
  );
}

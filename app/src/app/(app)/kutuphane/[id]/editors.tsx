"use client";
import { useActionState, useState, useTransition } from "react";
import type { LintIssue } from "@/domain/indicatorLint";
import { lintIndicatorText } from "@/domain/indicatorLint";
import { changeStatusAction, deleteIndicatorAction, newVersionAction, saveAnchorAction, upsertIndicatorAction, type ActionState } from "../actions";

type EvType = { id: number; code: string; name: string };
type Ind = { id: number; level: number; text: string; mandatory: boolean; evidenceTypeCodes: string[]; validityMonths: number };

export function StatusBar({ id, status, structureIssues }: { id: number; status: string; structureIssues: LintIssue[] }) {
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [pending, start] = useTransition();
  const hasErrors = structureIssues.some((i) => i.severity === "HATA");
  const go = (t: "TASLAK" | "INCELEMEDE" | "AKTIF" | "EMEKLI") => start(async () => setMsg(await changeStatusAction(id, t)));
  return (
    <div className="card flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold">Durum: {status}</span>
      {status === "TASLAK" && <button className="btn-ghost" disabled={pending} onClick={() => go("INCELEMEDE")}>İncelemeye gönder</button>}
      {status === "INCELEMEDE" && <><button className="btn-ghost" disabled={pending} onClick={() => go("TASLAK")}>Taslağa geri al</button><button className="btn-primary" disabled={pending || hasErrors} title={hasErrors ? "Yapısal hatalar var" : ""} onClick={() => go("AKTIF")}>Aktifleştir</button></>}
      {status === "AKTIF" && <><button className="btn-ghost" disabled={pending} onClick={() => start(async () => setMsg(await newVersionAction(id)))}>Yeni sürüm aç</button><button className="btn-ghost" disabled={pending} onClick={() => go("EMEKLI")}>Emekli et</button></>}
      {hasErrors && <span className="text-xs text-red-700">{structureIssues.filter((i) => i.severity === "HATA").length} yapısal hata</span>}
      {msg?.error && <span className="text-red-700">{msg.error}</span>}
      {msg?.ok && <span className="text-green-700">{msg.ok}</span>}
    </div>
  );
}

export function AnchorEditor({ competencyId, level, initial, editable }: { competencyId: number; level: number; initial: string; editable: boolean }) {
  const [text, setText] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-600">Seviye çıpası:</span>
      <input value={text} onChange={(e) => setText(e.target.value)} disabled={!editable} className="input max-w-xl" placeholder="Bu seviyede genel olarak ne yapar?" />
      {editable && <button className="btn-ghost" disabled={pending || text === initial} onClick={() => start(() => saveAnchorAction(competencyId, level, text))}>Kaydet</button>}
    </div>
  );
}

function LintBadges({ lint }: { lint: LintIssue[] }) {
  if (!lint.length) return <span className="badge bg-green-100 text-green-800">Temiz</span>;
  return <div className="flex flex-wrap gap-1">{lint.map((i) => <span key={i.code} title={i.message} className={`badge ${i.severity === "HATA" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{i.code}</span>)}</div>;
}

export function IndicatorRow({ competencyId, indicator, index, evTypes, lint, editable }: { competencyId: number; indicator: Ind; index: number; evTypes: EvType[]; lint: LintIssue[]; editable: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  if (editing) return <tr><td colSpan={7}><IndicatorEditor competencyId={competencyId} level={indicator.level} evTypes={evTypes} existing={indicator} onDone={() => setEditing(false)} /></td></tr>;
  return (
    <tr>
      <td>{index}</td>
      <td>{indicator.text}</td>
      <td>{indicator.mandatory ? <span className="badge bg-sky-100 text-sky-800">Zorunlu</span> : "—"}</td>
      <td className="text-xs">{indicator.evidenceTypeCodes.map((c) => evTypes.find((e) => e.code === c)?.name ?? c).join(", ")}</td>
      <td>{indicator.validityMonths} ay</td>
      <td><LintBadges lint={lint} /></td>
      <td className="whitespace-nowrap text-xs">
        {editable && <><button className="underline" onClick={() => setEditing(true)}>Düzenle</button> · <button className="text-red-700 underline" disabled={pending} onClick={() => { if (confirm("Gösterge silinsin mi?")) start(() => deleteIndicatorAction(competencyId, indicator.id)); }}>Sil</button></>}
      </td>
    </tr>
  );
}

export function IndicatorEditor({ competencyId, level, evTypes, existing, onDone }: { competencyId: number; level: number; evTypes: EvType[]; existing?: Ind; onDone?: () => void }) {
  const action = upsertIndicatorAction.bind(null, competencyId, existing?.id ?? null);
  const [state, formAction, pending] = useActionState(async (p: ActionState, fd: FormData) => { const r = await action(p, fd); if (r?.ok && onDone) onDone(); return r; }, undefined);
  const [text, setText] = useState(existing?.text ?? "");
  const live = text.length > 3 ? lintIndicatorText(text) : [];
  return (
    <form action={formAction} className="space-y-2 rounded-md border border-dashed border-slate-300 p-3 text-sm">
      <input type="hidden" name="level" value={level} />
      <div className="flex flex-wrap gap-2">
        <input name="text" value={text} onChange={(e) => setText(e.target.value)} required className="input flex-1" placeholder={existing ? "" : `Seviye ${level} için yeni gösterge: … hazırladı / … kurdu ve izledi / … öğretti`} />
        <label className="flex items-center gap-1"><input type="checkbox" name="mandatory" defaultChecked={existing?.mandatory ?? false} /> Zorunlu</label>
        <label className="flex items-center gap-1">Geçerlilik <input type="number" name="validityMonths" defaultValue={existing?.validityMonths ?? 24} min={1} max={120} className="input w-20" /> ay</label>
      </div>
      <div className="flex flex-wrap gap-3">
        {evTypes.map((e) => <label key={e.code} className="flex items-center gap-1 text-xs"><input type="checkbox" name="evidenceTypeCodes" value={e.code} defaultChecked={existing?.evidenceTypeCodes.includes(e.code) ?? false} /> {e.name}</label>)}
      </div>
      {live.length > 0 && <ul className="text-xs">{live.map((i) => <li key={i.code} className={i.severity === "HATA" ? "text-red-700" : "text-amber-700"}>• {i.message}</li>)}</ul>}
      {state?.error && <p className="text-red-700">{state.error}</p>}
      <div className="flex gap-2">
        <button disabled={pending} className="btn-primary">{existing ? "Güncelle" : "Gösterge ekle"}</button>
        {onDone && <button type="button" className="btn-ghost" onClick={onDone}>Vazgeç</button>}
      </div>
    </form>
  );
}

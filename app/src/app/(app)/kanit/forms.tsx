"use client";
import { useActionState, useState, useTransition } from "react";
import type { CompetencyProven } from "@/lib/proven";
import { IndicatorPicker } from "./indicator-picker";
import { addEvidenceAction, addObservationAction, decideEvidenceAction, deleteEvidenceAction, submitEvidenceAction, updateEvidenceTextAction, type ActionState } from "./actions";

export function EvidenceForm({ comps, evTypes }: { comps: CompetencyProven[]; evTypes: { code: string; name: string }[] }) {
  const [state, action, pending] = useActionState(addEvidenceAction, undefined);
  return (
    <form action={action} className="space-y-3 text-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="md:col-span-2">Ne yaptım? <span className="text-xs text-slate-500">(geçmiş zaman, somut: hangi işi, hangi çıktıyı)</span>
          <textarea name="whatIDid" required rows={2} className="input" placeholder="Örn. 2026 Mart'ta X pozisyonu için yapılandırılmış mülakatı STAR yöntemiyle yürüttüm ve puan kartını gerekçeli doldurdum (dosya no 4587)." /></label>
        <label>Başlangıç<input name="startDate" type="date" className="input" /></label>
        <label>Bitiş (zorunlu)<input name="endDate" type="date" required className="input" /></label>
        <label className="md:col-span-2">Sonuç ne oldu? <span className="text-xs text-slate-500">(ölçülebilirse sayı)</span><input name="result" className="input" placeholder="Örn. Aday 90. günde beklenen performansa ulaştı; süreç 21 günde kapandı." /></label>
        <label>Kim / ne doğrular?<input name="verifier" className="input" placeholder="Kişi veya belge" /></label>
        <label>Kanıt türü<select name="typeCode" required className="input">{evTypes.filter((t) => t.code !== "GOZLEM_NOTU").map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}</select></label>
        <label>Bağlantı<input name="link" type="url" className="input" placeholder="https://…" /></label>
        <label>Dosya (PDF, görsel, Office; ≤ 10 MB)<input name="file" type="file" className="block w-full" /></label>
      </div>
      <div>
        <div className="mb-1 font-medium">Hangi göstergeleri karşılıyor?</div>
        <IndicatorPicker comps={comps} />
      </div>
      {state?.error && <p className="rounded-md bg-red-50 p-2 text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-md bg-green-50 p-2 text-green-700">{state.ok}</p>}
      <div className="flex gap-2">
        <button name="mode" value="submit" disabled={pending} className="btn-primary">Sun</button>
        <button name="mode" value="draft" disabled={pending} className="btn-ghost">Taslak kaydet</button>
      </div>
      <p className="text-xs text-slate-500">Kanıt dosyalarında müşteri veya kişisel veri bulunmamalı; gerekiyorsa maskeleyin. Kanıtlar 24 ay geçerlidir.</p>
    </form>
  );
}

export function EvidenceRowActions({ id, status, whatIDid, result }: { id: number; status: string; whatIDid: string; result: string | null }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [editing, setEditing] = useState(false);
  const [w, setW] = useState(whatIDid); const [r, setR] = useState(result ?? "");
  const editable = status === "TASLAK" || status === "EK_BILGI";
  return (
    <div className="space-y-1 text-xs">
      {editing ? (
        <div className="space-y-1">
          <textarea value={w} onChange={(e) => setW(e.target.value)} rows={2} className="input" />
          <input value={r} onChange={(e) => setR(e.target.value)} className="input" placeholder="Sonuç" />
          <button className="btn-ghost py-1" disabled={pending} onClick={() => start(async () => { setMsg(await updateEvidenceTextAction(id, w, r)); setEditing(false); })}>Kaydet</button>
          <button className="ml-2 underline" onClick={() => setEditing(false)}>vazgeç</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {editable && <button className="underline" onClick={() => setEditing(true)}>düzenle</button>}
          {editable && <button className="underline text-[var(--brand-2)]" disabled={pending} onClick={() => start(async () => setMsg(await submitEvidenceAction(id)))}>sun</button>}
          {status !== "KABUL" && <button className="underline text-red-700" disabled={pending} onClick={() => { if (confirm("Kanıt silinsin mi?")) start(async () => setMsg(await deleteEvidenceAction(id))); }}>sil</button>}
        </div>
      )}
      {msg?.error && <span className="text-red-700">{msg.error}</span>}{msg?.ok && <span className="text-green-700">{msg.ok}</span>}
    </div>
  );
}

export function DecideControls({ id }: { id: number }) {
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<ActionState>(undefined);
  const go = (d: "KABUL" | "EK_BILGI" | "RED") => start(async () => setMsg(await decideEvidenceAction(id, d, note)));
  return (
    <div className="space-y-1 text-xs">
      <input value={note} onChange={(e) => setNote(e.target.value)} className="input py-1" placeholder="Gerekçe (ek bilgi ve red için zorunlu)" />
      <div className="flex gap-1">
        <button className="btn-primary py-1" disabled={pending} onClick={() => go("KABUL")}>Kabul</button>
        <button className="btn-ghost py-1" disabled={pending} onClick={() => go("EK_BILGI")}>Ek bilgi iste</button>
        <button className="btn-ghost py-1 text-red-700" disabled={pending} onClick={() => go("RED")}>Red</button>
      </div>
      {msg?.error && <span className="text-red-700">{msg.error}</span>}{msg?.ok && <span className="text-green-700">{msg.ok}</span>}
    </div>
  );
}

export function ObservationForm({ personId, personName, comps }: { personId: number; personName: string; comps: CompetencyProven[] }) {
  const [state, action, pending] = useActionState(addObservationAction, undefined);
  return (
    <details className="rounded-md border border-dashed border-slate-300 p-2 text-sm">
      <summary className="cursor-pointer">Gözlem notu ekle · {personName}</summary>
      <form action={action} className="mt-2 space-y-2">
        <input type="hidden" name="personId" value={personId} />
        <textarea name="whatIDid" required rows={2} className="input" placeholder="Tarihli ve somut gözlem: ne yaptı, sonuç ne oldu (örn. 15 Mayıs ortak mülakatında STAR sorularını yapılandırılmış biçimde yürüttü, puan kartı gerekçeliydi)." />
        <div className="flex flex-wrap gap-2"><label>Tarih<input name="endDate" type="date" required className="input" /></label><label className="flex-1">Sonuç<input name="result" className="input" /></label></div>
        <IndicatorPicker comps={comps} />
        {state?.error && <p className="text-red-700">{state.error}</p>}{state?.ok && <p className="text-green-700">{state.ok}</p>}
        <button disabled={pending} className="btn-primary">Gözlem notunu kaydet</button>
      </form>
    </details>
  );
}

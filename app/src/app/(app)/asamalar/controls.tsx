"use client";
import { useState, useTransition } from "react";
import { confirmStageAction, reopenStageAction, type ActionState } from "./actions";

export function StageControls({ stageKey, confirmed, autoOk, canEdit, implemented }: { stageKey: string; confirmed: boolean; autoOk: boolean; canEdit: boolean; implemented: boolean }) {
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<ActionState>(undefined);
  const [pending, start] = useTransition();
  if (!canEdit) return null;
  if (confirmed) return (
    <div className="flex items-center gap-2 text-xs"><button className="underline" disabled={pending} onClick={() => { if (confirm("Bu aşama ve sonrakiler yeniden açılsın mı?")) start(async () => setMsg(await reopenStageAction(stageKey))); }}>yeniden aç</button>{msg?.error && <span className="text-red-700">{msg.error}</span>}</div>
  );
  return (
    <div className="space-y-1 text-sm">
      {!autoOk && <input value={note} onChange={(e) => setNote(e.target.value)} className="input" placeholder={implemented ? "Zorunlu kontroller sağlanmadı; bilinçli geçmek için gerekçe (≥ 10 karakter)" : "Bu aşamanın ekranları henüz kurulmadı; manuel yürüttüyseniz not yazın"} />}
      <button className={autoOk ? "btn-primary" : "btn-ghost"} disabled={pending} onClick={() => start(async () => setMsg(await confirmStageAction(stageKey, note)))}>{autoOk ? "Aşamayı tamamla" : "Gerekçeyle tamamla"}</button>
      {msg?.error && <span className="ml-2 text-red-700">{msg.error}</span>}{msg?.ok && <span className="ml-2 text-green-700">{msg.ok}</span>}
    </div>
  );
}

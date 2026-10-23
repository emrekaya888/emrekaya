"use client";
import { useActionState, useState, useTransition } from "react";
import type { LineView } from "@/lib/cycle";
import { completeManagerAction, completeSelfAction, createCycleAction, decideAppealAction, employeeRespondAction, lockCycleAction, advanceCycleAction, openCycleAction, sendAgreementAction, validateLevel5Action, type ActionState } from "../donguler/actions";

function Msg({ msg }: { msg: ActionState }) { return <>{msg?.error && <span className="text-sm text-red-700">{msg.error}</span>}{msg?.ok && <span className="text-sm text-green-700">{msg.ok}</span>}</>; }

export function CycleForm() {
  const [state, action, pending] = useActionState(createCycleAction, undefined);
  return (
    <form action={action} className="grid gap-2 md:grid-cols-5 items-end text-sm">
      <label>Ad<input name="name" required className="input" placeholder="2026 Aralık · İK Grup v0" /></label>
      <label>Tür<select name="type" className="input"><option value="ANA">Ana</option><option value="ARA">Ara</option><option value="ISE_GIRIS">İşe giriş (90 gün)</option></select></label>
      <label>Öz-beyan son<input name="selfDeadline" type="date" className="input" /></label>
      <label>Doğrulama son<input name="managerDeadline" type="date" className="input" /></label>
      <label>Mutabakat son<input name="agreementDeadline" type="date" className="input" /></label>
      <div className="md:col-span-5 flex items-center gap-2"><button disabled={pending} className="btn-primary">Döngü oluştur</button><Msg msg={state} /></div>
    </form>
  );
}

export function CycleControls({ cycleId, status }: { cycleId: number; status: string }) {
  const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  const next: Record<string, { label: string; run: () => Promise<ActionState> } | undefined> = {
    HAZIRLIK: { label: "Döngüyü aç (öz-beyan başlar)", run: () => openCycleAction(cycleId) },
    OZ_BEYAN: { label: "Yönetici doğrulaması aşamasına geç", run: () => advanceCycleAction(cycleId, "YONETICI") },
    YONETICI: { label: "Mutabakat aşamasına geç", run: () => advanceCycleAction(cycleId, "MUTABAKAT") },
    MUTABAKAT: { label: "Kalibrasyon aşamasına geç", run: () => advanceCycleAction(cycleId, "KALIBRASYON") },
    KALIBRASYON: { label: "Kilitle (anlık görüntü al)", run: () => lockCycleAction(cycleId) },
  };
  const n = next[status];
  return <div className="flex flex-wrap items-center gap-2">{n && <button className="btn-primary" disabled={pending} onClick={() => { if (status !== "KALIBRASYON" || confirm("Kilitlenen döngü değiştirilemez. Devam?")) start(async () => setMsg(await n.run())); }}>{n.label}</button>}<Msg msg={msg} /></div>;
}

export function SelfCompleteButton({ assessmentId, disabled }: { assessmentId: number; disabled: boolean }) {
  const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  return <div className="flex items-center gap-2"><button className="btn-primary" disabled={pending || disabled} onClick={() => { if (confirm("Öz-beyanı tamamlıyorsunuz. Kanıt eklemeye devam edebilirsiniz; beyan seviyeleriniz şimdi kaydedilecek.")) start(async () => setMsg(await completeSelfAction(assessmentId))); }}>Öz-beyanı tamamla</button><Msg msg={msg} /></div>;
}

export function EmployeeRespond({ assessmentId, lines }: { assessmentId: number; lines: LineView[] }) {
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  return (
    <div className="space-y-2 text-sm">
      <p className="text-slate-600">Mutabık seviyeleri onaylayın ya da katılmadığınız satırlara gerekçe yazıp itiraz edin. İtiraz grup müdürü tarafından, kanıt üzerinden karara bağlanır.</p>
      {lines.map((l) => <div key={l.lineId} className="flex flex-wrap items-center gap-2"><span className="w-72 text-xs">{l.code} · {l.name} → mutabık {l.agreedLevel ?? "—"}</span><input value={reasons[l.lineId] ?? ""} onChange={(e) => setReasons({ ...reasons, [l.lineId]: e.target.value })} className="input flex-1 py-1" placeholder="İtiraz gerekçesi (boş = kabul)" /></div>)}
      <div className="flex gap-2">
        <button className="btn-primary" disabled={pending} onClick={() => start(async () => setMsg(await employeeRespondAction(assessmentId, "ONAY", [])))}>Onaylıyorum</button>
        <button className="btn-ghost" disabled={pending} onClick={() => start(async () => setMsg(await employeeRespondAction(assessmentId, "ITIRAZ", Object.entries(reasons).map(([k, v]) => ({ lineId: Number(k), reason: v })))))}>İtiraz et</button>
        <Msg msg={msg} />
      </div>
    </div>
  );
}

export function ManagerComplete({ assessmentId, pendingEvidence, status }: { assessmentId: number; pendingEvidence: number; status: string }) {
  const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  if (!["ACILDI", "OZ_BEYAN_TAMAM"].includes(status)) return null;
  return <div className="flex items-center gap-2 text-sm"><button className="btn-primary" disabled={pending || pendingEvidence > 0} title={pendingEvidence ? `${pendingEvidence} bekleyen kanıt` : ""} onClick={() => start(async () => setMsg(await completeManagerAction(assessmentId)))}>Doğrulamayı tamamla</button>{pendingEvidence > 0 && <span className="text-xs text-amber-700">{pendingEvidence} bekleyen kanıt var</span>}<Msg msg={msg} /></div>;
}

export function AgreementForm({ assessmentId, lines, initialNote }: { assessmentId: number; lines: LineView[]; initialNote: string }) {
  const [rows, setRows] = useState(lines.map((l) => ({ lineId: l.lineId, agreedLevel: l.agreedLevel ?? l.provenLevel, note: l.managerNote ?? "" })));
  const [meetingNote, setMeetingNote] = useState(initialNote);
  const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  const anyMeeting = lines.some((l) => l.meetingRequired);
  return (
    <div className="space-y-2 text-sm">
      <table className="table"><thead><tr><th>Yetkinlik</th><th>Hedef</th><th>Öz-beyan</th><th>Kanıtlanmış</th><th>Mutabık (≤ kanıtlanmış)</th><th>Not</th></tr></thead>
        <tbody>{lines.map((l, i) => (
          <tr key={l.lineId} className={l.meetingRequired ? "bg-amber-50" : ""}>
            <td><span className="text-xs text-slate-500">{l.code}</span> {l.name}{l.meetingRequired && <div className="text-xs text-amber-700">görüşme zorunlu{l.rejectedMandatory ? " (reddedilmiş zorunlu kanıt)" : ""}</div>}{l.level5Candidate && <div className="text-xs">{l.level5Validated === true ? "seviye 5 üst onaylı" : l.level5Validated === false ? "seviye 5 reddedildi" : "seviye 5 üst onay bekliyor"}</div>}</td>
            <td>{l.targetLevel}</td><td>{l.selfLevel ?? l.claimedLevel}</td><td className="font-semibold">{l.provenLevel}</td>
            <td><select value={rows[i].agreedLevel} onChange={(e) => setRows(rows.map((r, j) => j === i ? { ...r, agreedLevel: Number(e.target.value) } : r))} className="input w-16 py-1">{[0, 1, 2, 3, 4, 5].filter((n) => n <= l.provenLevel).map((n) => <option key={n} value={n}>{n}</option>)}</select></td>
            <td><input value={rows[i].note} onChange={(e) => setRows(rows.map((r, j) => j === i ? { ...r, note: e.target.value } : r))} className="input py-1" placeholder="Hangi kanıt eksik, nasıl tamamlanır?" /></td>
          </tr>))}</tbody></table>
      <label className="block">Görüşme notu {anyMeeting && <span className="text-amber-700">(zorunlu)</span>}<textarea value={meetingNote} onChange={(e) => setMeetingNote(e.target.value)} rows={2} className="input" placeholder="Görüşmede konuşulan kanıtlar, eksik göstergeler ve gelişim adımları" /></label>
      <div className="flex items-center gap-2"><button className="btn-primary" disabled={pending} onClick={() => start(async () => setMsg(await sendAgreementAction(assessmentId, rows, meetingNote)))}>Mutabakatı çalışana gönder</button><Msg msg={msg} /></div>
    </div>
  );
}

export function Level5Decision({ lineId }: { lineId: number }) {
  const [note, setNote] = useState(""); const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  return <div className="flex flex-wrap items-center gap-2 text-xs"><input value={note} onChange={(e) => setNote(e.target.value)} className="input w-64 py-1" placeholder="Gerekçe" /><button className="btn-primary py-1" disabled={pending} onClick={() => start(async () => setMsg(await validateLevel5Action(lineId, true, note)))}>Onayla</button><button className="btn-ghost py-1" disabled={pending} onClick={() => start(async () => setMsg(await validateLevel5Action(lineId, false, note)))}>Reddet</button><Msg msg={msg} /></div>;
}

export function AppealDecision({ lineId, provenLevel, agreedLevel }: { lineId: number; provenLevel: number; agreedLevel: number }) {
  const [level, setLevel] = useState(agreedLevel); const [note, setNote] = useState(""); const [msg, setMsg] = useState<ActionState>(undefined); const [pending, start] = useTransition();
  return <div className="flex flex-wrap items-center gap-2 text-xs"><select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="input w-16 py-1">{[0, 1, 2, 3, 4, 5].filter((n) => n <= provenLevel).map((n) => <option key={n} value={n}>{n}</option>)}</select><input value={note} onChange={(e) => setNote(e.target.value)} className="input w-80 py-1" placeholder="Karar gerekçesi: hangi kanıt nasıl değerlendirildi" /><button className="btn-primary py-1" disabled={pending} onClick={() => start(async () => setMsg(await decideAppealAction(lineId, level, note)))}>Karar ver</button><Msg msg={msg} /></div>;
}

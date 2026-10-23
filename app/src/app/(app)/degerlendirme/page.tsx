import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { assessmentStatusLabel, cycleStatusLabel, levelNames } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { activeCycle, assessmentView } from "@/lib/cycle";
import { EmployeeRespond, SelfCompleteButton } from "./controls";

export default async function DegerlendirmePage() {
  const s = await requireUser();
  const cycle = await activeCycle();
  if (!cycle) return <div className="card text-sm">Açık değerlendirme döngüsü yok.</div>;
  if (!s.personId) return <div className="card text-sm">Hesabınız bir kişiye bağlı değil.</div>;
  const a = await db.query.assessments.findFirst({ where: and(eq(schema.assessments.cycleId, cycle.id), eq(schema.assessments.personId, s.personId)) });
  if (!a) return <div className="card text-sm">{cycle.name}: bu döngüde sizin için değerlendirme üretilmedi (rol profiliniz yok olabilir).</div>;
  const v = (await assessmentView(a.id))!;
  const inSelf = cycle.status === "OZ_BEYAN" || cycle.status === "YONETICI";
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-[var(--brand)]">Değerlendirmem · {cycle.name}</h1>
        <p className="text-sm text-slate-600">Döngü aşaması: <strong>{cycleStatusLabel[cycle.status]}</strong> · Durumunuz: <strong>{assessmentStatusLabel[a.status]}</strong></p></div>
      <div className="card overflow-x-auto">
        <table className="table"><thead><tr><th>Yetkinlik</th><th>Hedef</th><th>Beyan</th><th>Kanıtlanmış</th><th>Mutabık</th><th>Sonraki seviye</th><th>Not</th></tr></thead>
          <tbody>{v.lines.map((l) => (
            <tr key={l.lineId} className={l.meetingRequired && a.status === "MUTABAKATTA" ? "bg-amber-50" : ""}>
              <td><span className="text-xs text-slate-500">{l.code}</span> {l.name}</td>
              <td>{l.targetLevel} · {levelNames[l.kind][l.targetLevel]}</td>
              <td>{l.selfLevel ?? l.claimedLevel}</td>
              <td className={l.provenLevel >= l.targetLevel ? "font-semibold text-green-700" : ""}>{a.status === "ACILDI" || a.status === "OZ_BEYAN_TAMAM" ? l.provenLevel : (l.provenSnapshot ?? l.provenLevel)}</td>
              <td>{l.agreedLevel ?? "—"}{l.appealDecision && <div className="text-xs text-slate-500">itiraz: {l.appealDecision}</div>}</td>
              <td><div className="h-2 w-24 rounded bg-slate-200"><div className="h-2 rounded bg-[var(--brand-2)]" style={{ width: `${Math.round(l.nextLevelProgress * 100)}%` }} /></div></td>
              <td className="text-xs">{l.managerNote ?? ""}{l.appealNote && <div>Karar: {l.appealNote}</div>}</td>
            </tr>))}</tbody></table>
      </div>
      {a.status === "ACILDI" && inSelf && (
        <div className="card space-y-2 text-sm">
          <p>Öz-beyan, <Link href="/kanit" className="underline">kanıt kasanızdaki</Link> göstergelerden hesaplanır; sayı seçmezsiniz. Kanıtlarınızı sunduktan sonra tamamlayın. Öz-beyan son tarihi: {cycle.selfDeadline ?? "—"}.</p>
          <SelfCompleteButton assessmentId={a.id} disabled={false} />
        </div>
      )}
      {a.status === "MUTABAKATTA" && <div className="card">{v.assessment.meetingNote && <p className="mb-2 text-sm"><strong>Görüşme notu:</strong> {v.assessment.meetingNote}</p>}<EmployeeRespond assessmentId={a.id} lines={v.lines} /></div>}
      {a.status === "ITIRAZDA" && <div className="card text-sm">İtirazınız grup müdürü tarafından inceleniyor.</div>}
      {(a.status === "KESINLESTI" || a.status === "KILITLI") && <div className="card text-sm text-green-700">Değerlendirmeniz kesinleşti. Gelişim planınız raporlar modülünde oluşacak.</div>}
    </div>
  );
}

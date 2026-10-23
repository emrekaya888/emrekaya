/**
 * Aşama rehberi: kurumun süreçte nerede olduğunu otomatik kontrollerle gösterir (13 §5–7, 09 kalite kapıları).
 * Her aşama: kontroller (otomatik), rehber metni, bağlantılar, İK onayı (settings tablosu).
 */
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { profileWarnings } from "@/domain/profile";
import { provenForPerson } from "./proven";
import { loadOrgContext } from "./org";

export interface StageCheck { label: string; ok: boolean; detail: string; required: boolean }
export interface Stage {
  key: string; order: number; title: string; summary: string; guidance: string[]; links: { href: string; label: string }[];
  checks: StageCheck[]; autoOk: boolean; confirmed: { at: string; byEmail: string; note?: string } | null; implemented: boolean;
}

const { orgUnits, roles, positions, people, competencies, roleProfiles, evidence, cycles, assessments, assessmentLines } = schema;

export async function computeStages(): Promise<{ stages: Stage[]; currentIndex: number }> {
  const confirmations = Object.fromEntries((await db.select().from(settings())).map((r) => [r.key, r.value as Stage["confirmed"]]));
  const [[u], [r], [p], [unassigned], [noLogin], noMgr] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(orgUnits).where(eq(orgUnits.active, true)),
    db.select({ c: sql<number>`count(*)::int` }).from(roles).where(eq(roles.active, true)),
    db.select({ c: sql<number>`count(*)::int` }).from(positions).where(eq(positions.active, true)),
    db.select({ c: sql<number>`count(*)::int` }).from(people).where(and(eq(people.active, true), sql`not exists (select 1 from assignments a where a.person_id = ${people.id} and a.end_date is null)`)),
    db.select({ c: sql<number>`count(*)::int` }).from(people).where(and(eq(people.active, true), sql`not exists (select 1 from users us where us.person_id = ${people.id} and us.active)`)),
    db.select({ name: orgUnits.name }).from(orgUnits).where(and(eq(orgUnits.active, true), inArray(orgUnits.type, ["DEPARTMAN", "DIREKTORLUK"]), isNull(orgUnits.managerPersonId), sql`exists (select 1 from positions ps where ps.org_unit_id = ${orgUnits.id})`)),
  ]);
  const comps = await db.select({ kind: competencies.kind, subKind: competencies.subKind, status: competencies.status }).from(competencies);
  const actBeh = comps.filter((c) => c.kind === "DAVRANISSAL" && c.status === "AKTIF").length;
  const actTech = comps.filter((c) => c.kind === "TEKNIK" && c.status === "AKTIF").length;
  const drafts = comps.filter((c) => c.status === "TASLAK" || c.status === "INCELEMEDE").length;
  const roleRows = await db.select().from(roles).where(eq(roles.active, true));
  const profRows = await db.select({ roleId: roleProfiles.roleId, kind: competencies.kind, subKind: competencies.subKind, targetLevel: roleProfiles.targetLevel, weight: roleProfiles.weight, mandatory: roleProfiles.mandatory })
    .from(roleProfiles).innerJoin(competencies, eq(competencies.id, roleProfiles.competencyId));
  const posCounts = await db.select({ roleId: positions.roleId, c: sql<number>`count(*)::int` }).from(positions).groupBy(positions.roleId);
  const posByRole = new Map(posCounts.map((x) => [x.roleId, x.c]));
  const [unprofiled] = await db.select({ c: sql<number>`count(*)::int` }).from(positions).where(sql`not exists (select 1 from role_profiles rp where rp.role_id = ${positions.roleId})`);
  const roleErrors = roleRows.filter((ro) => profileWarnings(profRows.filter((x) => x.roleId === ro.id), { isManager: ro.isManager, hasPositions: (posByRole.get(ro.id) ?? 0) > 0 }).some((w) => w.severity === "HATA")).length;
  const rolesNoTech = roleRows.filter((ro) => (posByRole.get(ro.id) ?? 0) > 0 && !profRows.some((x) => x.roleId === ro.id && x.kind === "TEKNIK")).length;
  // Kanıt toplama
  const ctx = await loadOrgContext();
  const ids = [...ctx.personUnit.keys()];
  const [withEv] = ids.length ? await db.select({ c: sql<number>`count(distinct ${evidence.personId})::int` }).from(evidence).where(inArray(evidence.personId, ids)) : [{ c: 0 }];
  const [pendingEv] = await db.select({ c: sql<number>`count(*)::int` }).from(evidence).where(eq(evidence.status, "SUNULDU"));
  let totalInd = 0, provenInd = 0;
  for (const pid of ids) { const rid = ctx.personRole.get(pid); if (!rid) continue; const cs = await provenForPerson(pid, rid); for (const c of cs) for (const i of c.indicators) if (i.level <= c.targetLevel) { totalInd++; if (i.proven) provenInd++; } }
  const coverage = totalInd ? provenInd / totalInd : 0;
  const evRatio = ids.length ? withEv.c / ids.length : 0;
  // Döngü
  const [lastCycle] = await db.select().from(cycles).orderBy(sql`${cycles.id} desc`).limit(1);
  const asRows = lastCycle ? await db.select({ status: assessments.status }).from(assessments).where(eq(assessments.cycleId, lastCycle.id)) : [];
  const nA = asRows.length;
  const selfDone = asRows.filter((a) => a.status !== "ACILDI").length;
  const mgrDone = asRows.filter((a) => ["YONETICI_TAMAM", "MUTABAKATTA", "ITIRAZDA", "KESINLESTI", "KILITLI"].includes(a.status)).length;
  const finalized = asRows.filter((a) => ["KESINLESTI", "KILITLI"].includes(a.status)).length;
  const [l5pending] = lastCycle ? await db.select({ c: sql<number>`count(*)::int` }).from(assessmentLines).innerJoin(assessments, eq(assessments.id, assessmentLines.assessmentId)).where(and(eq(assessments.cycleId, lastCycle.id), eq(assessmentLines.level5Candidate, true), sql`${assessmentLines.level5Validated} is null`, sql`${assessments.status} = 'UST_DOGRULAMADA'`)) : [{ c: 0 }];
  const [appealsOpen] = lastCycle ? await db.select({ c: sql<number>`count(*)::int` }).from(assessmentLines).innerJoin(assessments, eq(assessments.id, assessmentLines.assessmentId)).where(and(eq(assessments.cycleId, lastCycle.id), eq(assessmentLines.appealFlag, true))) : [{ c: 0 }];
  const cycleOpen = !!lastCycle && lastCycle.status !== "HAZIRLIK";
  const pct = (x: number) => (nA ? `%${Math.round((x / nA) * 100)} (${x}/${nA})` : "döngü yok");

  const stages: Stage[] = [
    { key: "kurulum", order: 1, title: "Kurulum", summary: "Müdürlükler, roller, pozisyonlar, kişiler ve giriş hesapları.",
      guidance: ["Kurulum sayfasından İK Grup Müdürlüğü altına 5 müdürlüğü ekleyin; her müdürlüğe yönetici atayın.", "Rolleri kademe diziniyle girin (uzman yardımcısı → uzman → kıdemli → yönetmen → müdür → grup müdürü).", "Her kişiye bir pozisyon, her kullanıcıya bir giriş hesabı verin."],
      links: [{ href: "/kurulum", label: "Kurulum" }, { href: "/organizasyon", label: "Organizasyon" }],
      checks: [
        { label: "En az 2 birim", ok: u.c >= 2, detail: `${u.c} birim`, required: true },
        { label: "En az 1 rol ve 1 pozisyon", ok: r.c >= 1 && p.c >= 1, detail: `${r.c} rol, ${p.c} pozisyon`, required: true },
        { label: "Atamasız aktif kişi yok", ok: unassigned.c === 0, detail: `${unassigned.c} kişi atamasız`, required: true },
        { label: "Pozisyonu olan her müdürlüğün yöneticisi atanmış", ok: noMgr.length === 0, detail: noMgr.length ? noMgr.map((x) => x.name).join(", ") : "tamam", required: true },
        { label: "Her kişinin giriş hesabı var", ok: noLogin.c === 0, detail: `${noLogin.c} kişi hesapsız`, required: false },
      ], autoOk: false, confirmed: confirmations["stage:kurulum"] ?? null, implemented: true },
    { key: "yetkinlik", order: 2, title: "Yetkinlik tanımlama", summary: "Davranışsal sözlük ve müdürlük başına teknik beceriler; her seviyede 3 gösterge.",
      guidance: ["04 aday sözlüğünden 8–10 çekirdek + 4–5 liderlik yetkinliği seçin; her müdürlükte 60 dk çalıştayla 8–12 teknik beceri çıkarın.", "Göstergeleri geçmiş zamanda, tek davranış ve kanıtı tarif edecek biçimde yazın; kalite uyarılarını temizleyin.", "Her seviyede en az 3 gösterge ve 1 zorunlu olmadan aktifleştirme yapılamaz; aktifleştirince aşama tamamlanır."],
      links: [{ href: "/kutuphane", label: "Yetkinlik kütüphanesi" }, { href: "/kutuphane/yeni", label: "Yeni yetkinlik" }],
      checks: [
        { label: "Aktif davranışsal yetkinlik ≥ 8", ok: actBeh >= 8, detail: `${actBeh} aktif`, required: true },
        { label: "Aktif teknik beceri ≥ 5", ok: actTech >= 5, detail: `${actTech} aktif`, required: true },
        { label: "Taslak veya incelemede kalan yetkinlik yok", ok: drafts === 0, detail: `${drafts} bekliyor`, required: false },
      ], autoOk: false, confirmed: confirmations["stage:yetkinlik"] ?? null, implemented: true },
    { key: "rol_profili", order: 3, title: "Rol profilleri", summary: "Her rol için hedef seviye, ağırlık ve zorunluluk; kişi başı en fazla 30 satır.",
      guidance: ["\"Çekirdek ve liderlik yetkinliklerini rollere uygula\" ile başlayın; sonra her role müdürlüğünün teknik becerilerini ekleyin.", "Hedef: bu rolde 2 yıldır çalışan, beklendiği gibi yapan kişi hangi seviyededir? Her şeyi 4 yapmayın.", "Profilsiz pozisyon kalmayınca aşama tamamlanır."],
      links: [{ href: "/rol-profilleri", label: "Rol profilleri" }],
      checks: [
        { label: "Profilsiz pozisyon yok", ok: unprofiled.c === 0, detail: `${unprofiled.c} pozisyon`, required: true },
        { label: "Yapısal hatası olan rol yok (satır > 30)", ok: roleErrors === 0, detail: `${roleErrors} rol`, required: true },
        { label: "Her rolde en az 1 teknik beceri", ok: rolesNoTech === 0, detail: `${rolesNoTech} rolde teknik yok`, required: false },
      ], autoOk: false, confirmed: confirmations["stage:rol_profili"] ?? null, implemented: true },
    { key: "kanit", order: 4, title: "Kanıt toplama (ön dönem)", summary: "Herkes kanıt kasasını doldurur; yöneticiler kanıtları karara bağlar.",
      guidance: ["Çalışanlara 15 dakikalık tanıtım: \"yaparım değil yaptım\", bir kanıt birden çok göstergeyi karşılar.", "Yöneticiler kanıtları haftalık inceler; red ve ek bilgi gerekçeli olmalı; gözlem notu ekleyebilir.", "Döngü açılmadan önce hedefe kadar göstergelerin en az %40'ı kanıtlı olmalı (13 §: P7 ölçütü)."],
      links: [{ href: "/kanit", label: "Kanıt kasam" }, { href: "/kanit/ekip", label: "Ekibimin kanıtları" }],
      checks: [
        { label: "Kanıt eklemiş kişi oranı ≥ %80", ok: evRatio >= 0.8, detail: `%${Math.round(evRatio * 100)} (${withEv.c}/${ids.length})`, required: false },
        { label: "Hedefe kadar gösterge kapsama ≥ %40", ok: coverage >= 0.4, detail: `%${Math.round(coverage * 100)} (${provenInd}/${totalInd})`, required: true },
        { label: "Bekleyen kanıt yok", ok: pendingEv.c === 0, detail: `${pendingEv.c} bekliyor`, required: false },
      ], autoOk: false, confirmed: confirmations["stage:kanit"] ?? null, implemented: true },
    { key: "degerlendirme", order: 5, title: "Değerlendirme döngüsü", summary: "Döngü açılır: öz-beyan, yönetici doğrulaması, seviye 5 üst onayı.",
      guidance: ["Döngüler sayfasından döngüyü oluşturup açın; satırlar rol profilinden üretilir.", "Çalışanlar kanıtlarını sunup öz-beyanı tamamlar (2 hafta); yöneticiler kanıtları karara bağlayıp doğrulamayı tamamlar (2 hafta).", "Seviye 5 iddiaları grup müdürü onayına düşer; onaysız 5 verilmez."],
      links: [{ href: "/donguler", label: "Döngüler" }, { href: "/degerlendirme", label: "Değerlendirmem" }, { href: "/degerlendirme/ekip", label: "Ekibimin değerlendirmeleri" }],
      checks: [
        { label: "Döngü açıldı", ok: cycleOpen, detail: lastCycle ? `${lastCycle.name} · ${lastCycle.status}` : "döngü yok", required: true },
        { label: "Öz-beyan tamamlama ≥ %90", ok: nA > 0 && selfDone / nA >= 0.9, detail: pct(selfDone), required: true },
        { label: "Yönetici doğrulaması ≥ %90", ok: nA > 0 && mgrDone / nA >= 0.9, detail: pct(mgrDone), required: true },
        { label: "Seviye 5 onayı bekleyen yok", ok: l5pending.c === 0, detail: `${l5pending.c} bekliyor`, required: false },
      ], autoOk: false, confirmed: confirmations["stage:degerlendirme"] ?? null, implemented: true },
    { key: "mutabakat", order: 6, title: "Mutabakat ve itiraz", summary: "Görüşme, mutabık seviye, çalışan onayı veya itiraz, grup müdürü kararı.",
      guidance: ["Fark ≥ 2 veya reddedilmiş zorunlu kanıt varsa görüşme zorunlu; görüşme notu yazılır.", "Mutabık seviye kanıtlanmış seviyeyi aşamaz; çalışan onaylar ya da gerekçeli itiraz eder.", "İtirazlar Üst doğrulama / itiraz sayfasında kanıt üzerinden karara bağlanır."],
      links: [{ href: "/degerlendirme/ekip", label: "Ekibimin değerlendirmeleri" }, { href: "/degerlendirme/ust", label: "Üst doğrulama / itiraz" }],
      checks: [
        { label: "Kesinleşen değerlendirme ≥ %85", ok: nA > 0 && finalized / nA >= 0.85, detail: pct(finalized), required: true },
        { label: "Bekleyen itiraz yok", ok: appealsOpen.c === 0, detail: `${appealsOpen.c} satır`, required: true },
      ], autoOk: false, confirmed: confirmations["stage:mutabakat"] ?? null, implemented: true },
    { key: "kalibrasyon", order: 7, title: "Kalibrasyon ve kilit", summary: "Grup müdürü + müdürler oturumu; döngü kilitlenir ve anlık görüntü alınır.",
      guidance: ["Kalibrasyon panosunda dağılım ve cömertlik endeksine bakın; kalibrasyon seviye yükseltmez, kanıt görevi açar.", "Döngüyü kalibrasyon aşamasına alın, sonra kilitleyin."],
      links: [{ href: "/donguler", label: "Döngüler" }, { href: "/raporlar", label: "Raporlar" }],
      checks: [{ label: "Döngü kilitlendi", ok: !!lastCycle && lastCycle.status === "KILITLI", detail: lastCycle ? lastCycle.status : "döngü yok", required: true }],
      autoOk: false, confirmed: confirmations["stage:kalibrasyon"] ?? null, implemented: true },
    { key: "raporlar", order: 8, title: "Raporlar ve gelişim planı", summary: "Isı haritası, öğrenim ölçütleri, kişi başı 3 öncelik.", guidance: ["Öğrenim raporu ve genişleme kararı (13 §7)."], links: [], checks: [], autoOk: false, confirmed: confirmations["stage:raporlar"] ?? null, implemented: false },
  ];
  for (const s of stages) s.autoOk = s.checks.filter((c) => c.required).every((c) => c.ok) && s.checks.length > 0;
  const currentIndex = Math.max(0, stages.findIndex((s) => !s.confirmed));
  return { stages, currentIndex: currentIndex === -1 ? stages.length - 1 : currentIndex };
}

function settings() { return schema.settings; }

/** Kütüphane tohumu: seviye tanımları, kanıt türleri ve örnek yetkinlikler (05 ve 12 dokümanlarındaki örnekler). */
import "dotenv/config";
import { eq, and } from "drizzle-orm";
import { db, schema } from "../src/db";

const { levelDefinitions, evidenceTypes, competencies, levelAnchors, indicators } = schema;

const LEVELS = {
  TEKNIK: [
    [0, "Yok / Uygulanamaz", "Beceri bu kişi için geçerli değil veya hiç deneyim yok"],
    [1, "Başlangıç", "Temel kavramları bilir, yakın gözetimle basit görevleri yapar"],
    [2, "Uygulayıcı", "Standart görevleri bağımsız yapar; rutin dışı durumda destek ister"],
    [3, "Yetkin Uygulayıcı", "Karmaşık/rutin dışı görevleri bağımsız çözer; başkalarına rehberlik eder; kalite referansıdır"],
    [4, "Yöneten", "Alanın standardını, yöntemini ve kalitesini belirler; başkalarını geliştirir; süreci iyileştirir"],
    [5, "Yön Veren", "Kurum çapında yön verir; yeni yaklaşımlar geliştirir; iç/dış referans uzmanıdır"],
  ],
  DAVRANISSAL: [
    [0, "Yok / Uygulanamaz", "Değerlendirme kapsamı dışında"],
    [1, "Gelişmekte", "Davranış yönlendirmeyle ve sınırlı ortaya çıkar"],
    [2, "Uygular", "Davranışı kendi işinde düzenli gösterir"],
    [3, "Güçlü", "Davranışı rutin dışı durumlarda da gösterir; ekibe örnek olur"],
    [4, "Rol model", "Davranışı başkalarında geliştirir; birim düzeyinde etkisi vardır"],
    [5, "Kültür taşıyıcı", "Davranışı kurum çapında yerleştirir; dışarıda da referans olur"],
  ],
} as const;

const EVIDENCE = [
  ["IS_CIKTISI", "İş çıktısı (rapor, tasarım, doküman)", "YONETICI"],
  ["PROJE_GOREV", "Proje / görev kaydı", "YONETICI"],
  ["GOZLEM_NOTU", "Yönetici gözlem notu", "YONETICI"],
  ["SERTIFIKA_SINAV", "Sertifika / sınav", "IK"],
  ["PAYDAS_GERI_BILDIRIM", "Paydaş geri bildirimi", "YONETICI"],
  ["OLCULEBILIR_SONUC", "Ölçülebilir sonuç (KPI, tasarruf, hata azalması)", "YONETICI"],
  ["MENTORLUK_KAYDI", "Mentorluk / eğitim verme kaydı", "YONETICI"],
] as const;

type Ind = [level: number, text: string, mandatory: boolean, evidence: string[]];
const SAMPLES: { code: string; name: string; kind: "TEKNIK" | "DAVRANISSAL"; subKind: typeof competencies.$inferInsert.subKind; definition: string; boundary?: string; anchors: string[]; indicators: Ind[] }[] = [
  {
    code: "D-C-01", name: "Sürekli Öğrenme", kind: "DAVRANISSAL", subKind: "CEKIRDEK",
    definition: "Yeni bilgi ve yöntemleri kendiliğinden arar, uygular ve paylaşır.",
    boundary: "Değişime Uyum belirsizlikte işlevsel kalmayı; Sürekli Öğrenme yeni bilgiyi arayıp uygulamayı ölçer.",
    anchors: ["Yönlendirilince eğitim alır", "Kendi alanında güncel kalır", "Öğrenme hedefi koyar, paylaşır", "Başkalarının öğrenmesini tasarlar", "Kurum çapında öğrenme pratiği kurar"],
    indicators: [
      [1, "Atanan zorunlu eğitimleri süresinde tamamladı", true, ["SERTIFIKA_SINAV"]],
      [1, "Yöneticisinin önerdiği bir öğrenme kaynağını bitirip kısa özetini paylaştı", false, ["IS_CIKTISI"]],
      [1, "Yeni bir mevzuat veya ürün değişikliğini sorarak öğrendi ve notlarını ekiple paylaştı", false, ["GOZLEM_NOTU"]],
      [2, "Kendi alanındaki bir mevzuat veya ürün değişikliğini işine yansıttı", true, ["IS_CIKTISI", "GOZLEM_NOTU"]],
      [2, "Son 12 ayda bir öğrenme etkinliğine kendi isteğiyle katıldı", false, ["SERTIFIKA_SINAV"]],
      [2, "Öğrendiği bir yöntemi bir iş çıktısında uyguladı", false, ["IS_CIKTISI"]],
      [3, "Kendi belirlediği bir öğrenme hedefini 12 ayda tamamladı", true, ["SERTIFIKA_SINAV", "IS_CIKTISI"]],
      [3, "Öğrendiği bir konuyu ekiple paylaştı (sunum, yazı veya atölye)", true, ["IS_CIKTISI", "MENTORLUK_KAYDI"]],
      [3, "Öğrendiğini işine uygulayıp ölçülebilir bir sonuç aldı", false, ["OLCULEBILIR_SONUC"]],
      [4, "Ekibi veya birimi için bir öğrenme programı ya da kılavuz tasarladı", true, ["IS_CIKTISI"]],
      [4, "En az iki kişiye mentorluk yaptı", false, ["MENTORLUK_KAYDI"]],
      [4, "Birimde bir öğrenme ritüeli (haftalık paylaşım, vaka saati) başlattı ve sürdürdü", false, ["GOZLEM_NOTU"]],
      [5, "Kurum çapında bir öğrenme pratiği kurdu veya dış toplulukta içerik üretti", true, ["IS_CIKTISI", "PAYDAS_GERI_BILDIRIM"]],
      [5, "Başka birimlerin öğrenme programlarına danışmanlık yaptı", false, ["PAYDAS_GERI_BILDIRIM"]],
      [5, "Kurumun öğrenme stratejisine kabul edilen bir öneri geliştirdi", false, ["IS_CIKTISI"]],
    ],
  },
  {
    code: "D-C-02", name: "Süreç Odaklılık", kind: "DAVRANISSAL", subKind: "CEKIRDEK",
    definition: "İşi adımlar, standartlar ve iyileştirme döngüsü olarak görür.",
    anchors: ["Tanımlı adımları takip eder", "Sapmayı fark eder ve bildirir", "Darboğazı tespit eder, iyileştirir", "Süreçleri tasarlar, ölçüm kurar", "Süreç mimarisini yönlendirir"],
    indicators: [
      [1, "Tanımlı süreç adımlarını kontrol listesiyle takip etti", true, ["GOZLEM_NOTU"]],
      [1, "Süreç dokümanını okuyup kendi görevindeki adımları özetledi", false, ["IS_CIKTISI"]],
      [1, "Bir sapmayı fark edip yöneticisine bildirdi", false, ["GOZLEM_NOTU"]],
      [2, "Sürecindeki bir sapmayı tespit edip kayıt altına aldı", true, ["IS_CIKTISI"]],
      [2, "Süreç ölçümlerini (süre, hata) düzenli raporladı", false, ["IS_CIKTISI"]],
      [2, "Süreç değişikliğini ekibine aktardı", false, ["GOZLEM_NOTU"]],
      [3, "Sürecin darboğazını veriyle tespit edip iyileştirme önerdi ve uyguladı", true, ["IS_CIKTISI", "OLCULEBILIR_SONUC"]],
      [3, "İyileştirme sonrası ölçülebilir kazanım raporladı", false, ["OLCULEBILIR_SONUC"]],
      [3, "Yeni çalışana süreci öğretti", false, ["MENTORLUK_KAYDI"]],
      [4, "Birim için bir süreci baştan tasarladı ve standartlaştırdı", true, ["IS_CIKTISI"]],
      [4, "Süreç ölçüm sistemi kurdu ve birime raporladı", false, ["IS_CIKTISI"]],
      [4, "Birimler arası bir süreç arayüzünü netleştirdi", false, ["PAYDAS_GERI_BILDIRIM"]],
      [5, "Kurum çapında süreç mimarisine kabul edilen bir öneri geliştirdi", true, ["IS_CIKTISI"]],
      [5, "Sürekli iyileştirme programını kurum düzeyinde kurdu", false, ["IS_CIKTISI"]],
      [5, "Dış kıyaslama (benchmark) yapıp kuruma uyarladı", false, ["IS_CIKTISI"]],
    ],
  },
  {
    code: "T-IK-001", name: "İşe Alım ve Seçme Değerlendirme", kind: "TEKNIK", subKind: "SUREC_METODOLOJI",
    definition: "Rol profiline göre aday bulma, yapılandırılmış mülakat ve puan kartıyla değerlendirme, karar ve teklif süreçlerinin yürütülmesi.",
    anchors: ["Gözetimle aday ön eleme", "Standart pozisyonlarda süreci bağımsız yürütür", "Kritik pozisyonları yürütür, mülakatçı yetiştirir", "Seçme yöntemini tasarlar, kaliteyi ölçer", "Kurum işe alım politikasına yön verir"],
    indicators: [
      [1, "Rol profiline göre aday ön elemesini kontrol listesiyle yaptı", true, ["IS_CIKTISI"]],
      [1, "Mülakatlara gözlemci olarak katılıp puan kartı doldurdu", false, ["GOZLEM_NOTU"]],
      [1, "Aday iletişimini (davet, bilgilendirme) standart şablonla yürüttü", false, ["IS_CIKTISI"]],
      [2, "Standart bir pozisyonun işe alım sürecini bağımsız yürüttü", true, ["PROJE_GOREV"]],
      [2, "Yapılandırılmış mülakatı STAR yöntemiyle yürütüp puan kartını gerekçeli doldurdu", false, ["IS_CIKTISI"]],
      [2, "Süreç KPI'larını (süre, aday sayısı, kabul oranı) raporladı", false, ["OLCULEBILIR_SONUC"]],
      [3, "Kritik veya zor doldurulan bir pozisyonu bağımsız kapattı", true, ["PROJE_GOREV"]],
      [3, "Yeni mülakatçılara yapılandırılmış mülakat ve puan kartı eğitimi verdi", false, ["MENTORLUK_KAYDI"]],
      [3, "İşe alım kalitesini (90. gün değerlendirmesi) izleyip raporladı", false, ["OLCULEBILIR_SONUC"]],
      [4, "Bir rol ailesi için seçme yöntemini (mülakat kılavuzu, vaka, puan kartı) tasarladı", true, ["IS_CIKTISI"]],
      [4, "İşe alım sürecinde ölçülebilir iyileştirme sağladı (süre veya kalite)", false, ["OLCULEBILIR_SONUC"]],
      [4, "İşe alım ekibini yönetip kalite standartlarını belirledi", false, ["GOZLEM_NOTU"]],
      [5, "Kurum işe alım politikasına kabul edilen bir yaklaşım geliştirdi", true, ["IS_CIKTISI"]],
      [5, "Dış kıyaslama ve araştırmayla seçme yöntemini yeniledi", false, ["IS_CIKTISI"]],
      [5, "İşe alım konusunda kurum dışı bir platformda içerik üretti", false, ["PAYDAS_GERI_BILDIRIM"]],
    ],
  },
];

async function main() {
  for (const [scale, rows] of Object.entries(LEVELS)) {
    for (const [level, name, def] of rows) {
      await db.insert(levelDefinitions).values({ scale: scale as "TEKNIK" | "DAVRANISSAL", level: level as number, name: name as string, generalDefinition: def as string })
        .onConflictDoUpdate({ target: [levelDefinitions.scale, levelDefinitions.level], set: { name: name as string, generalDefinition: def as string } });
    }
  }
  for (const [code, name, verifier] of EVIDENCE) {
    await db.insert(evidenceTypes).values({ code, name, verifierRole: verifier }).onConflictDoUpdate({ target: evidenceTypes.code, set: { name, verifierRole: verifier } });
  }
  for (const s of SAMPLES) {
    const exists = await db.select({ id: competencies.id }).from(competencies).where(and(eq(competencies.code, s.code), eq(competencies.version, 1)));
    if (exists.length) continue;
    const [c] = await db.insert(competencies).values({ code: s.code, name: s.name, kind: s.kind, subKind: s.subKind, definition: s.definition, boundaryNote: s.boundary ?? null, status: "AKTIF" }).returning();
    await db.insert(levelAnchors).values(s.anchors.map((a, i) => ({ competencyId: c.id, level: i + 1, anchorText: a })));
    const order: Record<number, number> = {};
    await db.insert(indicators).values(s.indicators.map(([level, text, mandatory, ev]) => ({ competencyId: c.id, level, sortOrder: (order[level] = (order[level] ?? 0) + 1), text, mandatory, evidenceTypeCodes: ev })));
    console.log(`Örnek yetkinlik: ${s.code} ${s.name}`);
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });

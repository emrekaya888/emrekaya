/** Enum değerlerinin Türkçe etiketleri (arayüz). */
export const orgUnitTypeLabel: Record<string, string> = {
  KURUM: "Kurum", GMY: "Genel Müdür Yardımcılığı", DIREKTORLUK: "Direktörlük", DEPARTMAN: "Departman", SERVIS: "Servis",
  BOLGE: "Bölge Müdürlüğü", SUBE: "Şube", PORTFOY_EKIBI: "Portföy ekibi", EKIP: "Ekip",
};
export const branchClassLabel: Record<string, string> = {
  OZEL_BANKACILIK: "Özel Bankacılık", KOBI: "KOBİ", TICARI: "Ticari", KURUMSAL: "Kurumsal",
};
export const segmentLabel: Record<string, string> = {
  BIREYSEL_SATIS_TEMSILCISI: "Bireysel Satış Temsilcisi", BIREYSEL_SATIS: "Bireysel Satış", KOBI_SATIS: "KOBİ Satış",
  TICARI_SATIS: "Ticari Satış", KURUMSAL_SATIS: "Kurumsal Satış", OZEL_BANKACILIK: "Özel Bankacılık", MUSTERI_ILISKILERI: "Müşteri İlişkileri",
};
export const networkLabel: Record<string, string> = { GM: "Genel Müdürlük", SUBE: "Şube", BOLGE: "Bölge" };
export const systemRoleLabel: Record<string, string> = {
  CALISAN: "Çalışan", YONETICI: "Yönetici", KURATOR: "Küratör", ALAN_UZMANI: "Alan uzmanı", UST_DOGRULAYICI: "Üst doğrulayıcı",
  IK_IS_ORTAGI: "İK iş ortağı", IK_ADMIN: "İK admin", UST_YONETIM: "Üst yönetim",
};
export const competencyKindLabel: Record<string, string> = { TEKNIK: "Teknik beceri", DAVRANISSAL: "Davranışsal yetkinlik" };
export const competencySubKindLabel: Record<string, string> = {
  CEKIRDEK: "Çekirdek", LIDERLIK: "Liderlik", YAZILIM_ARAC: "Yazılım / Araç", MEVZUAT_STANDART: "Mevzuat / Standart",
  SUREC_METODOLOJI: "Süreç / Metodoloji", URUN_ALAN: "Ürün / Alan bilgisi", EKIPMAN_ISLEM: "Ekipman / İşlem", DIL: "Dil",
};
export const competencyStatusLabel: Record<string, string> = { TASLAK: "Taslak", INCELEMEDE: "İncelemede", AKTIF: "Aktif", EMEKLI: "Emekli" };
export const futureTrendLabel: Record<string, string> = { YUKSELEN: "Yükselen", STABIL: "Stabil", AZALAN: "Azalan" };
export const levelNames = {
  TEKNIK: ["Yok / Uygulanamaz", "Başlangıç", "Uygulayıcı", "Yetkin Uygulayıcı", "Yöneten", "Yön Veren"],
  DAVRANISSAL: ["Yok / Uygulanamaz", "Gelişmekte", "Uygular", "Güçlü", "Rol model", "Kültür taşıyıcı"],
} as const;
export const evidenceStatusLabel: Record<string, string> = { TASLAK: "Taslak", SUNULDU: "Sunuldu", KABUL: "Kabul", EK_BILGI: "Ek bilgi istendi", RED: "Red" };

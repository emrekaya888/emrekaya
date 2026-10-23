import { describe, it, expect } from "vitest";
import { lintIndicatorText, lintStructure, canActivate } from "./indicatorLint";

describe("gösterge metni kontrolü", () => {
  it("yetenek dili hata verir", () => {
    const i = lintIndicatorText("Mali tablo analizi yapabilir");
    expect(i.some((x) => x.code === "YETENEK_DILI" && x.severity === "HATA")).toBe(true);
  });
  it("iyi yazılmış gösterge temiz geçer", () => {
    const i = lintIndicatorText("Standart KOBİ başvurusu için mali analizi bağımsız hazırladı ve tahsise sundu");
    expect(i.filter((x) => x.severity === "HATA")).toHaveLength(0);
    expect(i.some((x) => x.code === "ZAMAN")).toBe(false);
  });
  it("yargı sözcüğü ve çoklu davranış uyarır", () => {
    const i = lintIndicatorText("Müşteriyi iyi anladı ve ürün önerdi ve satışı kapattı");
    expect(i.some((x) => x.code === "YARGI")).toBe(true);
    expect(i.some((x) => x.code === "COKLU_DAVRANIS")).toBe(true);
  });
  it("Türkçe geçmiş zaman ekleri ve -ebilir içeren sıfatlar doğru ayrılır", () => {
    expect(lintIndicatorText("Atanan zorunlu eğitimleri süresinde tamamladı").some((x) => x.code === "ZAMAN")).toBe(false);
    expect(lintIndicatorText("Öğrendiğini işine uygulayıp ölçülebilir bir sonuç aldı").some((x) => x.code === "YETENEK_DILI")).toBe(false);
    expect(lintIndicatorText("Bir sapmayı fark edip yöneticisine bildirdi").filter((x) => x.severity === "HATA")).toHaveLength(0);
    expect(lintIndicatorText("Raporu hatasız hazırlayabilir").some((x) => x.code === "YETENEK_DILI")).toBe(true);
  });
  it("geçmiş zaman yoksa uyarır, (otomatik) etiketi geçer", () => {
    expect(lintIndicatorText("Çapraz satış oranı hedefin üzerinde olur").some((x) => x.code === "ZAMAN")).toBe(true);
    expect(lintIndicatorText("Çapraz satış oranı 2 dönem hedefin ≥ %100'ü (otomatik)").some((x) => x.code === "ZAMAN")).toBe(false);
  });
});

describe("yapısal kontrol", () => {
  const full = [1, 2, 3, 4, 5].map((l) => ({ level: l, count: 3, mandatory: 1 }));
  it("tam yapı aktifleştirilebilir", () => expect(canActivate(full)).toBe(true));
  it("eksik seviye engeller", () => {
    const missing = full.map((l) => (l.level === 4 ? { ...l, count: 2 } : l));
    expect(canActivate(missing)).toBe(false);
    expect(lintStructure(missing).some((i) => i.code === "SEVIYE_4_AZ")).toBe(true);
  });
  it("zorunlu yoksa engeller, 6+ uyarır", () => {
    const noMand = full.map((l) => (l.level === 2 ? { ...l, mandatory: 0 } : l));
    expect(canActivate(noMand)).toBe(false);
    const many = full.map((l) => (l.level === 1 ? { ...l, count: 6 } : l));
    expect(lintStructure(many).some((i) => i.code === "SEVIYE_1_COK" && i.severity === "UYARI")).toBe(true);
    expect(canActivate(many)).toBe(true);
  });
});

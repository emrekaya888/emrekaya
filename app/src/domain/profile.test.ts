import { describe, it, expect } from "vitest";
import { copyWithPlusOne, defaultBehavioralTarget, profileWarnings } from "./profile";

describe("rol profili kuralları", () => {
  it("varsayılan davranışsal hedef kademe ve yöneticiliğe göre", () => {
    expect(defaultBehavioralTarget(1, false, "CEKIRDEK")).toBe(2);
    expect(defaultBehavioralTarget(2, false, "CEKIRDEK")).toBe(3);
    expect(defaultBehavioralTarget(5, true, "CEKIRDEK")).toBe(4);
    expect(defaultBehavioralTarget(1, true, "LIDERLIK")).toBe(3);
  });
  it("+1 kopyalama 5'i aşmaz", () => {
    const r = copyWithPlusOne([{ targetLevel: 2 }, { targetLevel: 5 }]);
    expect(r.map((x) => x.targetLevel)).toEqual([3, 5]);
  });
  it("uyarılar: çok satır, teknik yok, liderlik eksik/fazla, hep yüksek, pozisyon yok", () => {
    const rows = Array.from({ length: 31 }, () => ({ kind: "TEKNIK" as const, targetLevel: 4, weight: 2, mandatory: false }));
    const w = profileWarnings(rows, { isManager: true, hasPositions: false });
    const codes = w.map((x) => x.code);
    expect(codes).toContain("COK_SATIR"); expect(codes).toContain("TEKNIK_COK"); expect(codes).toContain("DAVRANISSAL_YOK");
    expect(codes).toContain("LIDERLIK_YOK"); expect(codes).toContain("HEP_YUKSEK"); expect(codes).toContain("POZISYON_YOK");
    const w2 = profileWarnings([{ kind: "DAVRANISSAL", subKind: "LIDERLIK", targetLevel: 3, weight: 2, mandatory: true }], { isManager: false, hasPositions: true });
    expect(w2.map((x) => x.code)).toEqual(expect.arrayContaining(["TEKNIK_YOK", "LIDERLIK_FAZLA", "ZORUNLU_AGIRLIK"]));
  });
});

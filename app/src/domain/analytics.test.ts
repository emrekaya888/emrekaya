import { describe, it, expect } from "vitest";
import {
  criticalSkillScore, internalScarcityFromBusFactor, readiness, potentialScores, potentialConfidence, catalystPotential,
  consistencyFlag, managerLoadMinutes, managerLoadThresholdMinutes, leniencyIndex, hiddenExpertFlag, roleSimilarity,
} from "./analytics";

describe("kritiklik ve hazırlık", () => {
  it("kritik beceri skoru ağırlıklı toplam", () => {
    expect(criticalSkillScore({ businessImpact: 5, internalScarcity: 5, acquisitionTime: 4, externalScarcity: 3, lossRisk: 4 })).toBe(4.4);
    expect(criticalSkillScore({ businessImpact: 2, internalScarcity: 1, acquisitionTime: 1, externalScarcity: 1, lossRisk: 1 })).toBe(1.3);
  });
  it("bus factor → iç kıtlık", () => {
    expect(internalScarcityFromBusFactor(0)).toBe(5);
    expect(internalScarcityFromBusFactor(1)).toBe(5);
    expect(internalScarcityFromBusFactor(2)).toBe(4);
    expect(internalScarcityFromBusFactor(5)).toBe(2);
    expect(internalScarcityFromBusFactor(9)).toBe(1);
  });
  it("hazırlık seviyesi", () => {
    expect(readiness(0, 2, 2)).toBe("HAZIR");
    expect(readiness(1, 4, 3.5)).toBe("BIR_IKI_YIL");
    expect(readiness(2, 6, 4)).toBe("UC_ARTI_YIL");
    expect(readiness(0, 5, 2)).toBe("UC_ARTI_YIL");
  });
});

describe("potansiyel ve tutarlılık", () => {
  it("uzmanlık ve liderlik ağırlıkları", () => {
    const s = potentialScores({ learningAgility: 4, catalystProfile: 4, stretch: 3, leadership: 2, aspiration: 5 });
    expect(s.expertise).toBe(3.85);
    expect(s.leadership).toBe(3.25);
  });
  it("güven düzeyi", () => {
    expect(potentialConfidence(2)).toBe("DUSUK");
    expect(potentialConfidence(4)).toBe("ORTA");
    expect(potentialConfidence(7)).toBe("YUKSEK");
  });
  it("katalizör ve tutarlılık bayrağı", () => {
    const c = catalystPotential([{ weight: 0.6, level: 2 }, { weight: 0.4, level: 1 }]);
    expect(c).toBe(1.6);
    expect(consistencyFlag(4, c)).toBe(true);
    expect(consistencyFlag(3, c)).toBe(false);
    expect(consistencyFlag(5, 3)).toBe(false);
  });
});

describe("yük, cömertlik, gizli uzman, komşuluk", () => {
  it("yönetici yükü ve eşik", () => {
    expect(managerLoadMinutes(700, 100)).toBe(550);
    expect(managerLoadMinutes(700, 100) > managerLoadThresholdMinutes).toBe(true);
    expect(managerLoadMinutes(200, 50) > managerLoadThresholdMinutes).toBe(false);
  });
  it("cömertlik endeksi", () => expect(leniencyIndex(3.9, 3.2)).toBe(0.7));
  it("gizli uzman", () => {
    expect(hiddenExpertFlag(6, 2, 2)).toBe(true);
    expect(hiddenExpertFlag(3, 2, 2)).toBe(false);
    expect(hiddenExpertFlag(6, 2, 3)).toBe(false);
  });
  it("rol benzerliği", () => {
    const profile = [{ competency: "MTA", target: 4, weight: 3 }, { competency: "DT", target: 3, weight: 2 }];
    expect(roleSimilarity({ MTA: 4, DT: 3 }, profile)).toBe(1);
    expect(roleSimilarity({ MTA: 3, DT: 2 }, profile)).toBe(0.722);
    expect(roleSimilarity({}, profile)).toBe(0);
  });
});

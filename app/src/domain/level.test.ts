import { describe, it, expect } from "vitest";
import { computeProvenLevel, clampAgreedLevel, gap, priorityScore, meetingRequired, isEvidenceValid, type IndicatorStatus } from "./level";

const ind = (level: 1 | 2 | 3 | 4 | 5, mandatory: boolean, proven: boolean): IndicatorStatus => ({ level, mandatory, proven });

describe("computeProvenLevel", () => {
  it("hiç kanıt yoksa seviye 0", () => {
    const r = computeProvenLevel([ind(1, true, false), ind(1, false, false)]);
    expect(r.level).toBe(0);
    expect(r.nextLevelProgress).toBe(0);
  });
  it("zorunlu göstergeler tam ve kapsama ≥ %70 ise seviye kazanılır", () => {
    const r = computeProvenLevel([ind(1, true, true), ind(1, false, true), ind(1, false, false)]); // 2/3 = 0.67 < 0.7
    expect(r.level).toBe(0);
    const r2 = computeProvenLevel([ind(1, true, true), ind(1, false, true), ind(1, false, true), ind(1, false, false)]); // 3/4
    expect(r2.level).toBe(1);
  });
  it("zorunlu gösterge eksikse kapsama yüksek olsa da seviye verilmez", () => {
    const r = computeProvenLevel([ind(1, true, false), ind(1, false, true), ind(1, false, true), ind(1, false, true)]);
    expect(r.level).toBe(0);
  });
  it("zincir: seviye 2 kanıtlı ama seviye 1 eksikse seviye 0 kalır", () => {
    const r = computeProvenLevel([ind(1, true, false), ind(2, true, true), ind(2, false, true)]);
    expect(r.level).toBe(0);
  });
  it("seviye 3'e kadar kanıtlı, 4'te ilerleme %50", () => {
    const r = computeProvenLevel([
      ind(1, true, true), ind(1, false, true),
      ind(2, true, true), ind(2, false, true),
      ind(3, true, true), ind(3, false, true), ind(3, false, true),
      ind(4, true, true), ind(4, false, false),
    ]);
    expect(r.level).toBe(3);
    expect(r.nextLevelProgress).toBe(0.5);
  });
  it("seviye 5 üst doğrulama olmadan verilmez", () => {
    const all = ([1, 2, 3, 4, 5] as const).flatMap((l) => [ind(l, true, true), ind(l, false, true)]);
    expect(computeProvenLevel(all).level).toBe(4);
    expect(computeProvenLevel(all, undefined, true).level).toBe(5);
    expect(computeProvenLevel(all, { coverageThreshold: 0.7, requireLevel5Validation: false }).level).toBe(5);
  });
  it("eşik yapılandırılabilir", () => {
    const r = computeProvenLevel([ind(1, true, true), ind(1, false, false)], { coverageThreshold: 0.5, requireLevel5Validation: true });
    expect(r.level).toBe(1);
  });
});

describe("yardımcı kurallar", () => {
  it("mutabık seviye kanıtlanmışı aşamaz", () => {
    expect(clampAgreedLevel(4, 3)).toBe(3);
    expect(clampAgreedLevel(2, 3)).toBe(2);
  });
  it("açık ve öncelik", () => {
    expect(gap(4, 2)).toBe(2);
    expect(gap(2, 3)).toBe(-1);
    expect(priorityScore(4, 2, 3, 2)).toBe(12);
    expect(priorityScore(2, 3, 3, 3)).toBe(0);
  });
  it("görüşme zorunluluğu", () => {
    expect(meetingRequired(4, 2, false)).toBe(true);
    expect(meetingRequired(3, 2, false)).toBe(false);
    expect(meetingRequired(3, 3, true)).toBe(true);
  });
  it("kanıt geçerliliği 24 ay", () => {
    const today = new Date("2026-10-23");
    expect(isEvidenceValid(new Date("2025-01-15"), 24, today)).toBe(true);
    expect(isEvidenceValid(new Date("2024-09-01"), 24, today)).toBe(false);
  });
});

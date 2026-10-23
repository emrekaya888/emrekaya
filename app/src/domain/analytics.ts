/** Kritiklik, hazırlık, potansiyel, yük ve kalibrasyon hesapları — 02-veri-modeli.md §3. */

export interface CriticalSkillInputs {
  businessImpact: number; // 1–5
  internalScarcity: number; // 1–5 (bus factor'dan)
  acquisitionTime: number; // 1–5
  externalScarcity: number; // 1–5
  lossRisk: number; // 1–5
}
export const defaultCriticalWeights = { businessImpact: 0.3, internalScarcity: 0.25, acquisitionTime: 0.15, externalScarcity: 0.15, lossRisk: 0.15 };
export const defaultCriticalThreshold = 3.5;

export function criticalSkillScore(i: CriticalSkillInputs, w = defaultCriticalWeights): number {
  const s = i.businessImpact * w.businessImpact + i.internalScarcity * w.internalScarcity + i.acquisitionTime * w.acquisitionTime
    + i.externalScarcity * w.externalScarcity + i.lossRisk * w.lossRisk;
  return Math.round(s * 100) / 100;
}

/** İç kıtlık (1–5): seviye ≥ 3 kişi sayısından. 0–1→5, 2→4, 3→3, 4–5→2, 6+→1 */
export function internalScarcityFromBusFactor(busFactor: number): number {
  if (busFactor <= 1) return 5;
  if (busFactor === 2) return 4;
  if (busFactor === 3) return 3;
  if (busFactor <= 5) return 2;
  return 1;
}

export type Readiness = "HAZIR" | "BIR_IKI_YIL" | "UC_ARTI_YIL";
/** Hazırlık: zorunlu açık = 0 ve Σaçık ≤ 2 → Hazır; zorunlu açık ≤ 1 ve potansiyel ≥ 3 → 1–2 yıl; aksi 3+ */
export function readiness(mandatoryGapCount: number, totalGap: number, potential: number): Readiness {
  if (mandatoryGapCount === 0 && totalGap <= 2) return "HAZIR";
  if (mandatoryGapCount <= 1 && potential >= 3) return "BIR_IKI_YIL";
  return "UC_ARTI_YIL";
}

export interface PotentialDims { learningAgility: number; catalystProfile: number; stretch: number; leadership: number; aspiration: number }
/** Uzmanlık ve liderlik potansiyeli — 05 §6.2 ağırlıkları. */
export function potentialScores(d: PotentialDims): { expertise: number; leadership: number } {
  const expertise = 0.3 * d.learningAgility + 0.3 * d.catalystProfile + 0.2 * d.stretch + 0.05 * d.leadership + 0.15 * d.aspiration;
  const leadership = 0.2 * d.learningAgility + 0.1 * d.catalystProfile + 0.2 * d.stretch + 0.35 * d.leadership + 0.15 * d.aspiration;
  return { expertise: Math.round(expertise * 100) / 100, leadership: Math.round(leadership * 100) / 100 };
}
export function potentialConfidence(acceptedEvidenceCount: number): "DUSUK" | "ORTA" | "YUKSEK" {
  if (acceptedEvidenceCount < 3) return "DUSUK";
  if (acceptedEvidenceCount <= 5) return "ORTA";
  return "YUKSEK";
}

/** Katalizör potansiyeli (beceri bazlı) = Σ ağırlık × katalizör seviyesi */
export function catalystPotential(links: { weight: number; level: number }[]): number {
  return Math.round(links.reduce((a, l) => a + l.weight * l.level, 0) * 100) / 100;
}
/** Tutarlılık bayrağı: teknik seviye ≥ 4 ve katalizör potansiyeli < 2,5 */
export function consistencyFlag(technicalLevel: number, catalyst: number): boolean {
  return technicalLevel >= 4 && catalyst < 2.5;
}

/** Yönetici yükü (dakika) = bekleyen gösterge kararı × 0,5 + bekleyen kanıt × 2; eşik 8 saat (E4) */
export function managerLoadMinutes(pendingIndicatorDecisions: number, pendingEvidence: number): number {
  return pendingIndicatorDecisions * 0.5 + pendingEvidence * 2;
}
export const managerLoadThresholdMinutes = 8 * 60;

/** Yönetici cömertlik endeksi = ort(yönetici puanı) − ort(birim yönetici puanı) */
export function leniencyIndex(managerMean: number, unitMean: number): number {
  return Math.round((managerMean - unitMean) * 100) / 100;
}

/** Gizli uzman bayrağı (E3): danışılma ≥ 2 × birim medyanı ve kanıtlanmış seviye ≤ 2 */
export function hiddenExpertFlag(nominations: number, unitMedian: number, provenLevel: number): boolean {
  return nominations >= 2 * Math.max(unitMedian, 1) && provenLevel <= 2;
}

/** Beceri komşuluğu (E1): 1 − Σ max(hedefB − seviyeA,0)×ağırlıkB / Σ hedefB×ağırlıkB */
export function roleSimilarity(current: Record<string, number>, targetProfile: { competency: string; target: number; weight: number }[]): number {
  const denom = targetProfile.reduce((a, t) => a + t.target * t.weight, 0);
  if (denom === 0) return 1;
  const num = targetProfile.reduce((a, t) => a + Math.max(t.target - (current[t.competency] ?? 0), 0) * t.weight, 0);
  return Math.round((1 - num / denom) * 1000) / 1000;
}

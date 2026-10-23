/**
 * Seviye hesaplama kuralları — 05-kanit-gosterge-ve-potansiyel-modeli.md §4 ile birebir.
 * Arayüzden ve veritabanından bağımsız saf fonksiyonlar; birim testleri level.test.ts içindedir.
 */

export interface IndicatorStatus {
  /** Göstergenin ait olduğu seviye (1–5) */
  level: 1 | 2 | 3 | 4 | 5;
  /** Zorunlu gösterge mi */
  mandatory: boolean;
  /** Geçerli (bayatlamamış) ve kabul edilmiş kanıtla kanıtlandı mı */
  proven: boolean;
}

export interface LevelRuleConfig {
  /** Seviye başına toplam göstergelerin kanıtlanma eşiği (varsayılan 0,70 — S21) */
  coverageThreshold: number;
  /** Seviye 5 için üst doğrulama onayı şart mı */
  requireLevel5Validation: boolean;
}

export const defaultLevelRules: LevelRuleConfig = { coverageThreshold: 0.7, requireLevel5Validation: true };

export interface ProvenLevelResult {
  /** Kanıtlanmış seviye (0–5) */
  level: 0 | 1 | 2 | 3 | 4 | 5;
  /** Bir sonraki seviyedeki göstergelerin kanıtlanma oranı (0–1); 5 ise 1 */
  nextLevelProgress: number;
  /** Seviye başına kapsama oranı ve zorunlu eksikliği */
  perLevel: { level: number; coverage: number; mandatoryMissing: number; total: number }[];
}

/**
 * Kanıtlanmış seviye: 1..N arasındaki her seviyede zorunlu göstergelerin %100'ü ve toplam göstergelerin ≥ eşik kadarı kanıtlıysa N kazanılmış sayılır.
 * Hiç göstergesi olmayan bir seviye "tanımsız" kabul edilir ve zincir orada durur.
 */
export function computeProvenLevel(
  indicators: IndicatorStatus[],
  config: LevelRuleConfig = defaultLevelRules,
  level5Validated = false,
): ProvenLevelResult {
  const perLevel: ProvenLevelResult["perLevel"] = [];
  let level: ProvenLevelResult["level"] = 0;
  let chainBroken = false;
  for (let n = 1; n <= 5; n++) {
    const ind = indicators.filter((i) => i.level === n);
    const total = ind.length;
    const proven = ind.filter((i) => i.proven).length;
    const mandatoryMissing = ind.filter((i) => i.mandatory && !i.proven).length;
    const coverage = total === 0 ? 0 : proven / total;
    perLevel.push({ level: n, coverage, mandatoryMissing, total });
    if (chainBroken || total === 0) { chainBroken = true; continue; }
    const achieved = mandatoryMissing === 0 && coverage >= config.coverageThreshold - 1e-9;
    const blockedBy5 = n === 5 && config.requireLevel5Validation && !level5Validated;
    if (achieved && !blockedBy5) level = n as ProvenLevelResult["level"];
    else chainBroken = true;
  }
  const next = perLevel.find((p) => p.level === level + 1);
  const nextLevelProgress = level >= 5 ? 1 : next && next.total > 0 ? next.coverage : 0;
  return { level, nextLevelProgress, perLevel };
}

/** Mutabık seviye kanıtlanmış seviyeyi aşamaz. */
export function clampAgreedLevel(agreed: number, proven: number): number {
  return Math.min(agreed, proven);
}

/** Açık = hedef − mutabık (negatif = fazlalık). */
export function gap(target: number, agreed: number): number {
  return target - agreed;
}

/** Öncelik puanı = max(açık,0) × rol ağırlığı (1–3) × beceri kritikliği (1–3). */
export function priorityScore(target: number, agreed: number, roleWeight: 1 | 2 | 3, criticality: 1 | 2 | 3): number {
  return Math.max(gap(target, agreed), 0) * roleWeight * criticality;
}

/** Görüşme zorunlu mu: fark ≥ 2 veya reddedilmiş zorunlu kanıt var. */
export function meetingRequired(selfLevel: number, provenLevel: number, rejectedMandatoryEvidence: boolean): boolean {
  return Math.abs(selfLevel - provenLevel) >= 2 || rejectedMandatoryEvidence;
}

/** Kanıt geçerliliği: bitiş tarihi + geçerlilik ayı bugünden önceyse bayat. */
export function isEvidenceValid(evidenceEndDate: Date, validityMonths: number, today: Date = new Date()): boolean {
  const exp = new Date(evidenceEndDate);
  exp.setMonth(exp.getMonth() + validityMonths);
  return exp.getTime() >= today.getTime();
}

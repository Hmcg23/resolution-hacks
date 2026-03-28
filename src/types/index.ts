/**
 * Shared types — the contract between the women's side (produces DailyLog)
 * and the men's side (consumes SharedSummary).
 *
 * OWNERSHIP: Shared — only modify by agreement between both developers.
 * Always import types from '@/types', never re-define them locally.
 */

/** A linked couple in the app. */
export interface Couple {
  id: string;
  womanName: string;
  manName: string;
}

/** A single day's log entry, created by the woman's side. */
export interface DailyLog {
  id: string;
  /** ISO date string, e.g. "2026-03-28" */
  date: string;
  onPeriod: boolean;
  periodStartedToday: boolean;
  flowLevel: 'none' | 'light' | 'medium' | 'heavy';
  mood: 'great' | 'good' | 'okay' | 'rough' | 'awful';
  /** Free-form symptom tags, e.g. ['cramps', 'headache', 'bloating'] */
  symptoms: string[];
  /** 1 (none) → 5 (very high) */
  energyLevel: number;
  /** 1 (none) → 5 (severe) */
  painLevel: number;
  note: string;
  /** Whether this entry has been shared with the partner. */
  shareWithPartner: boolean;
}

/**
 * A derived summary shown on the men's side.
 * Produced by the recommendation engine from a DailyLog.
 */
export interface SharedSummary {
  /** ISO date string matching the source DailyLog */
  date: string;
  /** One-line plain-English summary, e.g. "Mood: good · Energy: 4/5" */
  summaryText: string;
  /** 0–3 actionable tips for the partner */
  recommendations: string[];
}

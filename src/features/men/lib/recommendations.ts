/**
 * Recommendation engine — converts a DailyLog into a SharedSummary.
 *
 * OWNERSHIP: Shared (written once, rarely needs changes).
 * Pure function — no React, no side effects, safe to import at module level.
 *
 * Men's dev: extend the rules here as the feature grows.
 * Women's dev: the DailyLog fields you fill in directly power these tips.
 */

import type { DailyLog, SharedSummary } from '@/types';

export function getRecommendations(log: DailyLog): SharedSummary {
  const recs: string[] = [];

  // --- Period status ---
  if (log.onPeriod && log.periodStartedToday) {
    recs.push("Today is day 1 of her period. Be extra gentle — have supplies and snacks nearby.");
  } else if (log.onPeriod) {
    recs.push("She's on her period. Keep plans soft and check in without pressure.");
  }

  // --- Pain level ---
  if (log.painLevel >= 4) {
    recs.push("She's in significant pain. Offer a heating pad or her preferred pain relief without being asked.");
  } else if (log.painLevel >= 3) {
    recs.push("She's dealing with some pain today. Low-key plans are the right call.");
  }

  // --- Mood ---
  if (log.mood === 'awful') {
    recs.push("Her mood is very low. Skip planning anything today — just be present and don't push.");
  } else if (log.mood === 'rough') {
    recs.push("Her mood is rough. Follow her lead, keep it low-key, no big asks today.");
  } else if (log.mood === 'okay') {
    recs.push("She's doing okay. Match her energy and follow her lead.");
  }

  // --- Energy ---
  if (log.energyLevel <= 2) {
    recs.push("Her energy is low. Keep plans light and don't push on anything social.");
  }

  // --- Specific symptoms ---
  if (log.symptoms.includes('cramps')) {
    recs.push("She has cramps. A heat pad or her comfort thing goes a long way right now.");
  }
  if (log.symptoms.includes('headache')) {
    recs.push("She has a headache. Keep noise and stimulation down if you can.");
  }
  if (log.symptoms.includes('bloating')) {
    recs.push("She's feeling bloated. Skip any commentary on food or body today.");
  }
  if (log.symptoms.includes('fatigue')) {
    recs.push("She's fatigued. Let her rest without guilt or question.");
  }
  if (log.symptoms.includes('nausea')) {
    recs.push("She's nauseous. Offer plain foods and avoid strong smells.");
  }

  // --- Good day ---
  if (
    recs.length === 0 &&
    log.energyLevel >= 4 &&
    (log.mood === 'great' || log.mood === 'good')
  ) {
    recs.push("She's having a good day. Good window to suggest something fun if she's up for it.");
  }

  // Cap at 3 recommendations to keep it scannable
  const trimmedRecs = recs.slice(0, 3);

  // Build summary line
  const parts: string[] = [`Mood: ${log.mood}`, `Energy: ${log.energyLevel}/5`];
  if (log.onPeriod) parts.push('On period');
  if (log.painLevel > 1) parts.push(`Pain: ${log.painLevel}/5`);
  if (log.symptoms.length > 0) parts.push(log.symptoms.slice(0, 2).join(', '));

  return {
    date: log.date,
    summaryText: parts.join(' · '),
    recommendations: trimmedRecs,
  };
}

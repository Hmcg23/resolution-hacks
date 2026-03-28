/**
 * Mock couple data — single source of truth for the hackathon demo.
 *
 * OWNERSHIP: Shared — both sides import from here.
 * Do not duplicate data. Both sides reference COUPLE, DAILY_LOGS, SHARED_SUMMARIES.
 *
 * Data is seeded so today = cycle day 14 (ovulation window),
 * matching CycleDayContext's default of 14.
 *
 * Cycle day mapping (approximate, day 1 = first day of period):
 *   Days 1–5   → Menstrual
 *   Days 6–13  → Follicular
 *   Days 14–16 → Ovulation
 *   Days 17–28 → Luteal
 */

import type { Couple, DailyLog, SharedSummary } from '@/types';
import { getRecommendations } from '@/features/men/lib/recommendations';

// ---------------------------------------------------------------------------
// Couple
// ---------------------------------------------------------------------------

export const COUPLE: Couple = {
  id: 'demo-001',
  womanName: 'Alex',
  manName: 'Jordan',
};

// ---------------------------------------------------------------------------
// Daily logs — 10 entries, newest first
// Today is 2026-03-28, cycle day ~14 (ovulation window)
// ---------------------------------------------------------------------------

export const DAILY_LOGS: DailyLog[] = [
  // Day 0 — today (cycle day 14, ovulation)
  {
    id: 'log-2026-03-28',
    date: '2026-03-28',
    onPeriod: false,
    periodStartedToday: false,
    flowLevel: 'none',
    mood: 'good',
    symptoms: [],
    energyLevel: 4,
    painLevel: 1,
    note: 'Feeling pretty good today, a bit warm.',
    shareWithPartner: true,
  },
  // Day -1 (cycle day 13, late follicular)
  {
    id: 'log-2026-03-27',
    date: '2026-03-27',
    onPeriod: false,
    periodStartedToday: false,
    flowLevel: 'none',
    mood: 'great',
    symptoms: [],
    energyLevel: 5,
    painLevel: 1,
    note: 'Energy is high, feeling motivated.',
    shareWithPartner: true,
  },
  // Day -2 (cycle day 12, follicular)
  {
    id: 'log-2026-03-26',
    date: '2026-03-26',
    onPeriod: false,
    periodStartedToday: false,
    flowLevel: 'none',
    mood: 'good',
    symptoms: [],
    energyLevel: 4,
    painLevel: 1,
    note: '',
    shareWithPartner: false,
  },
  // Day -3 (cycle day 11, follicular)
  {
    id: 'log-2026-03-25',
    date: '2026-03-25',
    onPeriod: false,
    periodStartedToday: false,
    flowLevel: 'none',
    mood: 'okay',
    symptoms: ['headache'],
    energyLevel: 3,
    painLevel: 2,
    note: 'Mild headache in the afternoon.',
    shareWithPartner: true,
  },
  // Day -7 (cycle day 7, early follicular — just after period ended)
  {
    id: 'log-2026-03-21',
    date: '2026-03-21',
    onPeriod: false,
    periodStartedToday: false,
    flowLevel: 'none',
    mood: 'okay',
    symptoms: ['fatigue'],
    energyLevel: 3,
    painLevel: 1,
    note: 'Glad the period is over, still a bit tired.',
    shareWithPartner: true,
  },
  // Day -8 (cycle day 6, end of period)
  {
    id: 'log-2026-03-20',
    date: '2026-03-20',
    onPeriod: true,
    periodStartedToday: false,
    flowLevel: 'light',
    mood: 'okay',
    symptoms: ['fatigue', 'bloating'],
    energyLevel: 3,
    painLevel: 2,
    note: 'Almost done, light flow.',
    shareWithPartner: true,
  },
  // Day -10 (cycle day 4, menstrual — heavy flow)
  {
    id: 'log-2026-03-18',
    date: '2026-03-18',
    onPeriod: true,
    periodStartedToday: false,
    flowLevel: 'heavy',
    mood: 'rough',
    symptoms: ['cramps', 'bloating', 'fatigue'],
    energyLevel: 2,
    painLevel: 4,
    note: 'Really rough day. Stayed in bed most of the morning.',
    shareWithPartner: true,
  },
  // Day -11 (cycle day 3, menstrual — medium flow)
  {
    id: 'log-2026-03-17',
    date: '2026-03-17',
    onPeriod: true,
    periodStartedToday: false,
    flowLevel: 'medium',
    mood: 'rough',
    symptoms: ['cramps', 'headache'],
    energyLevel: 2,
    painLevel: 3,
    note: 'Cramps + headache. Not a great day.',
    shareWithPartner: true,
  },
  // Day -12 (cycle day 2, menstrual — medium flow)
  {
    id: 'log-2026-03-16',
    date: '2026-03-16',
    onPeriod: true,
    periodStartedToday: false,
    flowLevel: 'medium',
    mood: 'awful',
    symptoms: ['cramps', 'nausea', 'fatigue'],
    energyLevel: 1,
    painLevel: 5,
    note: 'Worst pain so far. Nausea too.',
    shareWithPartner: true,
  },
  // Day -13 (cycle day 1, period started today)
  {
    id: 'log-2026-03-15',
    date: '2026-03-15',
    onPeriod: true,
    periodStartedToday: true,
    flowLevel: 'light',
    mood: 'rough',
    symptoms: ['cramps', 'bloating'],
    energyLevel: 2,
    painLevel: 3,
    note: 'Period started. Mild cramps, a bit bloated.',
    shareWithPartner: true,
  },
];

// ---------------------------------------------------------------------------
// Shared summaries — derived from logs where shareWithPartner is true
// This is what the men's side displays.
// ---------------------------------------------------------------------------

export const SHARED_SUMMARIES: SharedSummary[] = DAILY_LOGS
  .filter((log) => log.shareWithPartner)
  .map((log) => getRecommendations(log));

/** Convenience: today's log entry (first in list, newest first) */
export const todayLog: DailyLog = DAILY_LOGS[0];

/** Convenience: today's shared summary (if shared) */
export const todaySummary: SharedSummary | undefined = SHARED_SUMMARIES.find(
  (s) => s.date === todayLog.date,
);

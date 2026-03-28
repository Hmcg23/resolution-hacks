export type CyclePhaseId = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type CyclePhaseInfo = {
  id: CyclePhaseId;
  /** Literal phase name for pill / headers */
  phaseName: string;
  /** Vivid one-liner (subtitle under phase name) */
  partnerTitle: string;
  /** One or two sentences, friend tone */
  partnerSummary: string;
  /** Fine print: which cycle days map to this phase in this 28-day view */
  technicalLabel: string;
};

const PHASES: { maxDay: number; info: CyclePhaseInfo }[] = [
  {
    maxDay: 5,
    info: {
      id: 'menstrual',
      phaseName: 'Menstrual phase',
      partnerTitle: 'Low-energy / reset week (for many)',
      partnerSummary:
        'Lots of people feel wiped or crampy—not everyone. Low-key plans and having supplies on hand go a long way. No need to make a speech.',
      technicalLabel: 'Cycle days 1–5 in this view',
    },
  },
  {
    maxDay: 13,
    info: {
      id: 'follicular',
      phaseName: 'Follicular phase',
      partnerTitle: 'Social battery often comes back',
      partnerSummary:
        'Many people feel clearer and more up for people and plans here. Still ask—she’s not a textbook.',
      technicalLabel: 'Cycle days 6–13 in this view',
    },
  },
  {
    maxDay: 16,
    info: {
      id: 'ovulation',
      phaseName: 'Ovulatory phase',
      partnerTitle: 'High-voltage week for some',
      partnerSummary:
        'Mid-cycle can mean big energy—or feeling overstimulated. Offer options instead of locking in one plan.',
      technicalLabel: 'Cycle days 14–16 in this view',
    },
  },
  {
    maxDay: 28,
    info: {
      id: 'luteal',
      phaseName: 'Luteal phase',
      partnerTitle: 'Wind-down week (stress or fatigue for some)',
      partnerSummary:
        'Some people feel irritable, tender, or tired before their period—many don’t. Patience and flexible plans beat pep talks.',
      technicalLabel: 'Cycle days 17–28 in this view',
    },
  },
];

function clampCycleDay(day: number): number {
  if (Number.isNaN(day) || day < 1) return 1;
  if (day > 28) return 28;
  return Math.round(day);
}

/** Returns phase info for a 1–28 cycle day (idealized calendar). */
export function getCyclePhase(day: number): CyclePhaseInfo {
  const d = clampCycleDay(day);
  for (const row of PHASES) {
    if (d <= row.maxDay) return row.info;
  }
  return PHASES[PHASES.length - 1].info;
}

export { clampCycleDay };

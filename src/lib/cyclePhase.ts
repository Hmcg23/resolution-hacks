export type CyclePhaseId = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type CyclePhaseInfo = {
  id: CyclePhaseId;
  /** Plain headline for partners (no shame, minimal jargon) */
  partnerTitle: string;
  /** One or two sentences, friend tone */
  partnerSummary: string;
  /** Tiny print for accuracy / judges—optional in UI */
  technicalLabel: string;
};

const PHASES: { maxDay: number; info: CyclePhaseInfo }[] = [
  {
    maxDay: 5,
    info: {
      id: 'menstrual',
      partnerTitle: 'Low-energy / reset week (for many)',
      partnerSummary:
        'Lots of people feel wiped or crampy—not everyone. Low-key plans and having supplies on hand go a long way. No need to make a speech.',
      technicalLabel: 'Menstrual phase (model)',
    },
  },
  {
    maxDay: 13,
    info: {
      id: 'follicular',
      partnerTitle: 'Social battery often comes back',
      partnerSummary:
        'In this rough model, many people feel clearer and more up for people and plans. Still ask—she’s not a textbook.',
      technicalLabel: 'Follicular phase (model)',
    },
  },
  {
    maxDay: 16,
    info: {
      id: 'ovulation',
      partnerTitle: 'High-voltage week for some',
      partnerSummary:
        'Mid-cycle can mean big energy—or feeling overstimulated. Offer options instead of locking in one plan.',
      technicalLabel: 'Ovulation window (model)',
    },
  },
  {
    maxDay: 28,
    info: {
      id: 'luteal',
      partnerTitle: 'Wind-down week (stress or fatigue for some)',
      partnerSummary:
        'Some people feel irritable, tender, or tired before their period—many don’t. Patience and flexible plans beat pep talks.',
      technicalLabel: 'Luteal phase (model)',
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

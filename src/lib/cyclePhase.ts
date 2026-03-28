export type CyclePhaseId = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type CyclePhaseInfo = {
  id: CyclePhaseId;
  /** Short UI label */
  label: string;
  /** One line for dashboards */
  summary: string;
};

const PHASES: { maxDay: number; info: CyclePhaseInfo }[] = [
  {
    maxDay: 5,
    info: {
      id: 'menstrual',
      label: 'Menstrual',
      summary: 'Bleeding days in a typical model cycle—energy and comfort vary a lot person to person.',
    },
  },
  {
    maxDay: 13,
    info: {
      id: 'follicular',
      label: 'Follicular',
      summary: 'Estrogen tends to climb in this model—often described as clearer mood and more energy for many people.',
    },
  },
  {
    maxDay: 16,
    info: {
      id: 'ovulation',
      label: 'Ovulation window',
      summary: 'Mid-cycle in this textbook curve—hormone shifts can mean peak energy or sensitivity; everyone differs.',
    },
  },
  {
    maxDay: 28,
    info: {
      id: 'luteal',
      label: 'Luteal',
      summary: 'Progesterone is higher in this model—some people feel PMS-type symptoms; not a rule for any individual.',
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

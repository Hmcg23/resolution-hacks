export type ImpactLevel = 'low' | 'medium' | 'high';

export type BirthControlId = 'combo_pill' | 'iud' | 'mini_pill';

export type EffectTheme = {
  label: string;
  /** Qualitative only—illustrative, not personalized medicine */
  impact: ImpactLevel;
};

export type BirthControlMethod = {
  id: BirthControlId;
  name: string;
  /** Typical-use effectiveness, plain language */
  effectivenessTypical: string;
  /** Perfect-use framing */
  effectivenessPerfect: string;
  themes: EffectTheme[];
  clinicianNote: string;
};

export const BIRTH_CONTROL_METHODS: BirthControlMethod[] = [
  {
    id: 'combo_pill',
    name: 'Combined oral pill (estrogen + progestin)',
    effectivenessTypical: 'Roughly 93% effective with typical use (about 7 in 100 pregnant in a year).',
    effectivenessPerfect: 'About 99% effective with perfect use.',
    themes: [
      { label: 'Cycle regularity', impact: 'high' },
      { label: 'Cramp / flow intensity (for some users)', impact: 'medium' },
      { label: 'Mood or libido changes (variable)', impact: 'medium' },
      { label: 'Nausea early on (some users)', impact: 'low' },
    ],
    clinicianNote: 'Not appropriate for everyone (e.g. some migraine or clotting histories)—prescriber screens you.',
  },
  {
    id: 'iud',
    name: 'IUD (hormonal or copper)',
    effectivenessTypical: 'Roughly 99% effective—among the most reliable reversible methods.',
    effectivenessPerfect: 'Stays high with typical use because there is little daily action to forget.',
    themes: [
      { label: 'Insertion discomfort / cramping (often short-term)', impact: 'medium' },
      { label: 'Bleeding pattern changes (especially first months)', impact: 'high' },
      { label: 'Partner string awareness', impact: 'low' },
      { label: 'Mood reports (mixed in studies; individual)', impact: 'medium' },
    ],
    clinicianNote: 'Type (copper vs hormonal) changes side-effect profile a lot—visit is the real decision point.',
  },
  {
    id: 'mini_pill',
    name: 'Progestin-only pill (“mini-pill”)',
    effectivenessTypical: 'Roughly 93% typical use—similar ballpark to combined pill for many populations.',
    effectivenessPerfect: 'About 99% with perfect use; timing window is stricter than some methods.',
    themes: [
      { label: 'Timing sensitivity (same time daily)', impact: 'high' },
      { label: 'Bleeding unpredictability', impact: 'medium' },
      { label: 'Libido or mood (variable)', impact: 'medium' },
    ],
    clinicianNote: 'Often used when estrogen is not recommended—your clinician matches method to history.',
  },
];

export function getBirthControlById(id: BirthControlId): BirthControlMethod {
  const found = BIRTH_CONTROL_METHODS.find((m) => m.id === id);
  if (!found) return BIRTH_CONTROL_METHODS[0];
  return found;
}

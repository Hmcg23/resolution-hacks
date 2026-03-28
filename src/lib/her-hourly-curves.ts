import { ESTROGEN_28, PROGESTERONE_28 } from '@/data/cycleCurves';

const NUM_DAYS = 28;

function clamp01(v: number): number {
  return Math.min(1, Math.max(0.04, v));
}

/**
 * Builds 24 hourly relative levels for one cycle day.
 * Uses (1) linear drift from this day's model value toward the next day's along the day,
 * and (2) a mild sinusoidal diurnal ripple (different phase per hormone) so bars aren't flat.
 * Illustrative only—not measured hourly lab data.
 */
function hourlySeriesForDay(
  day: number,
  series: readonly number[],
  ripplePhaseHours: number,
): number[] {
  const idx = Math.min(NUM_DAYS, Math.max(1, day)) - 1;
  const v0 = series[idx] ?? 0;
  const v1 = idx < NUM_DAYS - 1 ? (series[idx + 1] ?? v0) : v0;

  return Array.from({ length: 24 }, (_, h) => {
    const t = h / 23;
    const drift = v0 * (1 - t) + v1 * t;
    const ripple = 0.78 + 0.22 * Math.sin((2 * Math.PI * (h + ripplePhaseHours)) / 24);
    return clamp01(drift * ripple);
  });
}

export function estrogenHourlyForDay(day: number): number[] {
  return hourlySeriesForDay(day, ESTROGEN_28, 3.5);
}

export function progesteroneHourlyForDay(day: number): number[] {
  return hourlySeriesForDay(day, PROGESTERONE_28, 10);
}

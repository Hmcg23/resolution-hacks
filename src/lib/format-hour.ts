/** Format 0–23 as e.g. "12 AM", "3 PM". */
export function formatHourLabel(hour: number): string {
  const h = Math.min(23, Math.max(0, Math.round(hour)));
  const period = h >= 12 ? 'PM' : 'AM';
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${twelve} ${period}`;
}

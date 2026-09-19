/**
 * Picks which item from each group to show, changing every `everyDays` days.
 * Uses Michigan (Eastern) dates so everyone sees the same picks on the same day.
 * Shared by the page (at build time) and the browser (so it stays current without rebuilding).
 */
export function rotationIndex(everyDays: number, startDate = '2026-01-01', now = new Date()): number {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const days = Math.floor((Date.parse(`${ymd}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 864e5);
  const period = Math.floor(days / Math.max(1, everyDays));
  return period < 0 ? 0 : period;
}

import type { Hours } from '../site.config';

/** "09:30" -> "9:30 AM", "22:00" -> "10 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12) + 1;
  return m ? `${hour12}:${String(m).padStart(2, '0')} ${suffix}` : `${hour12} ${suffix}`;
}

export function formatRange(h: Hours): string {
  return h.closed ? 'Closed' : `${formatTime(h.open)} – ${formatTime(h.close)}`;
}

const schemaDay: Record<string, string> = {
  Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th', Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su',
};

/** For JSON-LD: ["Mo 09:30-22:00", ...] */
export function schemaOpeningHours(hours: readonly Hours[]): string[] {
  return hours.filter((h) => !h.closed).map((h) => `${schemaDay[h.day]} ${h.open}-${h.close}`);
}

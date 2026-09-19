/**
 * Fills every [data-open-status] element with "Open until 10 PM",
 * "Closed · opens 9:30 AM" or "Closed · opens Sun 11 AM", using Michigan (Eastern) time and the hours in site.config.ts.
 */
import { site } from '../site.config';
import { formatTime } from '../lib/hours';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

function detroitNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Detroit', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  return { day: DAYS.indexOf(get('weekday')), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const hoursFor = (dayIndex: number) => site.hours.find((h) => h.day === DAYS[dayIndex]);

export function getStatus() {
  const { day, minutes } = detroitNow();
  const today = hoursFor(day);
  // Late-night spillover from yesterday (only matters if a close time is after midnight).
  const yesterday = hoursFor((day + 6) % 7);
  if (yesterday && !yesterday.closed && toMin(yesterday.close) < toMin(yesterday.open) && minutes < toMin(yesterday.close)) {
    return { open: true, text: `Open until ${formatTime(yesterday.close)}` };
  }
  if (today && !today.closed) {
    const o = toMin(today.open);
    let c = toMin(today.close);
    if (c <= o) c += 24 * 60;
    if (minutes >= o && minutes < c) return { open: true, text: `Open until ${formatTime(today.close)}` };
    if (minutes < o) return { open: false, text: `Closed · opens ${formatTime(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = hoursFor((day + i) % 7);
    if (next && !next.closed) {
      return { open: false, text: `Closed · opens ${next.day.slice(0, 3)} ${formatTime(next.open)}` };
    }
  }
  return { open: false, text: 'Call for hours' };
}

export function renderOpenStatus() {
  const status = getStatus();
  document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
    el.dataset.open = String(status.open);
    const text = el.querySelector('[data-open-text]');
    if (text) text.textContent = status.text;
  });
  document.querySelectorAll<HTMLElement>('[data-today-row]').forEach((row) => {
    row.toggleAttribute('data-today', row.dataset.todayRow === DAYS[detroitNow().day]);
  });
}

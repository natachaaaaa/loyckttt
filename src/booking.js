// Booking logic: opening hours, slot availability from a Google Calendar (free/busy only), request sending.
// Dates are handled as 'YYYY-MM-DD' strings for days, and real Date instants (Paris time) for slots.
// Setup for the artist: see README.md, "Prise de rendez-vous".

export const CONFIG = {
  tz: 'Europe/Paris',
  openDays: [2, 3, 4, 5, 6], // 0 = sunday: tuesday to saturday
  slots: [
    { id: 'am', label: 'Matin', start: '10:00', end: '13:00' },
    { id: 'pm', label: 'Après-midi', start: '14:00', end: '19:00' },
  ],
  minNoticeDays: 2, // no request for a slot starting sooner than this
  horizonMonths: 4, // how far ahead the calendar opens
}

const env = import.meta.env ?? {}
const GCAL_ID = env.VITE_GCAL_ID
const GCAL_KEY = env.VITE_GCAL_KEY
const WEB3FORMS_KEY = env.VITE_WEB3FORMS_KEY
export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || 'contact@exemple.fr'

const DAY = 86400000

/** Real instant of a Paris wall-clock time, whatever the visitor's own timezone. */
export function parisDate(ymd, hhmm, tz = CONFIG.tz) {
  // Offset taken at noon: DST switches happen at night, slots are daytime.
  const off = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${ymd}T12:00:00Z`))
    .find((p) => p.type === 'timeZoneName').value // "GMT+01:00", or "GMT"
  return new Date(`${ymd}T${hhmm}:00${off === 'GMT' ? 'Z' : off.slice(3)}`)
}

/** Today in Paris, as 'YYYY-MM-DD'. */
export function todayYmd(now = new Date(), tz = CONFIG.tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(now)
}

export const addDays = (ymd, n) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10)
const weekday = (ymd) => new Date(`${ymd}T00:00:00Z`).getUTCDay()

/** Slots of a day, each flagged taken when it overlaps a busy range or is too soon. */
export function slotsFor(ymd, busy, now = new Date()) {
  const earliest = now.getTime() + CONFIG.minNoticeDays * DAY
  return CONFIG.slots.map((s) => {
    const start = parisDate(ymd, s.start)
    const end = parisDate(ymd, s.end)
    const overlaps = busy.some((b) => b.start < end && b.end > start)
    // from/to: wall-clock labels ("10:00"); start/end: real instants.
    return { ...s, ymd, from: s.start, to: s.end, start, end, taken: overlaps || start.getTime() < earliest }
  })
}

/** 'closed' (not a working day / out of range), 'full' (all slots taken) or 'open'. */
export function dayStatus(ymd, busy, now = new Date()) {
  const today = todayYmd(now)
  const limit = addMonthsYmd(today, CONFIG.horizonMonths)
  if (!CONFIG.openDays.includes(weekday(ymd)) || ymd <= today || ymd > limit) return 'closed'
  return slotsFor(ymd, busy, now).every((s) => s.taken) ? 'full' : 'open'
}

export function addMonthsYmd(ymd, n) {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1 + n, d)).toISOString().slice(0, 10)
}

/** Days of a month grid, monday first; null for the leading blanks. */
export function monthGrid(year, month) {
  const first = new Date(Date.UTC(year, month, 1))
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const lead = (first.getUTCDay() + 6) % 7
  const days = Array.from({ length: count }, (_, i) => new Date(Date.UTC(year, month, i + 1)).toISOString().slice(0, 10))
  return [...Array(lead).fill(null), ...days]
}

/** Busy ranges from the artist's Google Calendar (shared publicly as "free/busy only"). */
export async function fetchBusy(timeMin, timeMax) {
  if (!GCAL_ID || !GCAL_KEY) {
    // shortcut: without a configured calendar, dev shows a few fake taken slots so the UI can be checked;
    // production shows everything free (requests are still validated by hand).
    return env.DEV ? demoBusy(timeMin) : []
  }
  const res = await fetch(`https://www.googleapis.com/calendar/v3/freeBusy?key=${encodeURIComponent(GCAL_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), timeZone: CONFIG.tz, items: [{ id: GCAL_ID }] }),
  })
  const cal = (await res.json()).calendars?.[GCAL_ID]
  if (!res.ok || !cal || cal.errors) throw new Error('calendar unavailable')
  return cal.busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }))
}

function demoBusy(from) {
  const start = todayYmd(from)
  return [3, 4, 9, 10, 11, 17, 24].map((n, i) => {
    const ymd = addDays(start, n)
    const s = CONFIG.slots[i % 2 ? 1 : 0]
    return i === 2
      ? { start: parisDate(ymd, '00:00'), end: parisDate(addDays(ymd, 1), '00:00') } // a whole blocked day
      : { start: parisDate(ymd, s.start), end: parisDate(ymd, s.end) }
  })
}

const formatSlot = (slot) =>
  `${new Intl.DateTimeFormat('fr-FR', { timeZone: CONFIG.tz, dateStyle: 'full' }).format(slot.start)}, ${slot.label.toLowerCase()} (${slot.start
    .toLocaleTimeString('fr-FR', { timeZone: CONFIG.tz, hour: '2-digit', minute: '2-digit' })} - ${slot.end.toLocaleTimeString('fr-FR', { timeZone: CONFIG.tz, hour: '2-digit', minute: '2-digit' })})`

export { formatSlot }

const FIELDS = [
  ['name', 'Nom'],
  ['email', 'Email'],
  ['idea', 'Idée'],
  ['placement', 'Emplacement'],
  ['size', 'Taille approximative'],
  ['refs', 'Références'],
  ['track', 'Le morceau qui va avec'],
]

/**
 * Sends the request by email through Web3Forms. Without a key, returns a prefilled mailto link to `email` instead.
 * @returns {{ sent: true } | { mailto: string }}
 */
export async function sendRequest(slot, form, email = CONTACT_EMAIL) {
  const when = formatSlot(slot)
  if (!WEB3FORMS_KEY) {
    const body = [`Créneau souhaité : ${when}`, ...FIELDS.map(([k, l]) => `${l} : ${form[k] ?? ''}`)].join('\n')
    return { mailto: `mailto:${email}?subject=${encodeURIComponent('Demande de rendez-vous')}&body=${encodeURIComponent(body)}` }
  }
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `Demande de RDV : ${when}`,
      from_name: form.name,
      replyto: form.email,
      botcheck: form.botcheck,
      'Créneau souhaité': when,
      ...Object.fromEntries(FIELDS.map(([k, l]) => [l, form[k] ?? ''])),
    }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.success) throw new Error(json.message || 'send failed')
  return { sent: true }
}

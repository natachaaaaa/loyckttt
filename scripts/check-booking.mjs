// Self-check for src/booking.js: node scripts/check-booking.mjs
import assert from 'node:assert/strict'
import { parisDate, slotsFor, dayStatus, monthGrid, todayYmd, addDays } from '../src/booking.js'

// Paris time is right in winter (UTC+1) and summer (UTC+2), whatever the machine's timezone.
assert.equal(parisDate('2026-01-15', '10:00').toISOString(), '2026-01-15T09:00:00.000Z')
assert.equal(parisDate('2026-07-15', '10:00').toISOString(), '2026-07-15T08:00:00.000Z')

const now = new Date('2026-11-15T12:00:00Z') // a sunday
const tue = '2026-11-24'
assert.equal(todayYmd(now), '2026-11-15')

// Overlap: a busy range inside the morning takes the morning only.
const busy = [{ start: parisDate(tue, '11:00'), end: parisDate(tue, '12:00') }]
assert.deepEqual(slotsFor(tue, busy, now).map((s) => s.taken), [true, false])
// Back-to-back events don't take the next slot.
const edge = [{ start: parisDate(tue, '09:00'), end: parisDate(tue, '10:00') }]
assert.deepEqual(slotsFor(tue, edge, now).map((s) => s.taken), [false, false])
// A whole-day event takes the day.
const allDay = [{ start: parisDate(tue, '00:00'), end: parisDate(addDays(tue, 1), '00:00') }]
assert.equal(dayStatus(tue, allDay, now), 'full')

assert.equal(dayStatus(tue, [], now), 'open')
assert.equal(dayStatus('2026-11-23', [], now), 'closed', 'monday is closed')
assert.equal(dayStatus('2026-11-17', [], now), 'open', 'tuesday in 2 days: morning too soon, afternoon still open')
assert.deepEqual(slotsFor('2026-11-17', [], now).map((s) => s.taken), [true, false])
assert.equal(dayStatus('2026-11-16', [], now), 'closed', 'tomorrow is closed anyway (monday)')
assert.equal(dayStatus('2026-11-14', [], now), 'closed', 'past day')
assert.equal(dayStatus('2027-06-01', [], now), 'closed', 'beyond the horizon')

// November 2026 starts on a sunday: 6 blanks in a monday-first grid.
const grid = monthGrid(2026, 10)
assert.equal(grid.filter((d) => d === null).length, 6)
assert.equal(grid.at(-1), '2026-11-30')
console.log('ok')

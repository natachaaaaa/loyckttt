/** Roman numeral of a positive integer (piece and step numbers). */
export function roman(n) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, r] of map) {
    while (n >= v) {
      out += r
      n -= v
    }
  }
  return out
}

/** Moon phase of a date, 0 = new, 0.5 = full (mean synodic month from the 2000-01-06 new moon). */
export function moonPhase(date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000
  return (((days / 29.530588853) % 1) + 1) % 1
}

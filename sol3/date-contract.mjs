// Original strict civil-date functions, retained from the reviewed local prototype.
// No lunar conversion or almanac rules are present in this module.
export const CALENDAR_TIME_ZONE = 'Asia/Shanghai';

export function parseCivilDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError('Expected a Gregorian civil date in YYYY-MM-DD form.');
  }
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new RangeError('Invalid Gregorian date.');
  }
  // setUTCFullYear avoids the Date constructor special case for years 00-99.
  const check = new Date(0);
  check.setUTCFullYear(year, month - 1, day);
  check.setUTCHours(0, 0, 0, 0);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    throw new RangeError('Invalid Gregorian date.');
  }
  return Object.freeze({ iso: value, year, month, day });
}

export function civilDateAt(isoInstant) {
  const match = typeof isoInstant === 'string' && isoInstant.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/
  );
  if (!match) throw new TypeError('An ISO instant with seconds and an explicit offset is required.');
  parseCivilDate(match[1]);
  const [, , hour, minute, second, , , offsetHour = '0', offsetMinute = '0'] = match;
  if (+hour > 23 || +minute > 59 || +second > 59 || +offsetHour > 14 || +offsetMinute > 59 || (+offsetHour === 14 && +offsetMinute !== 0)) {
    throw new RangeError('Invalid clock time or UTC offset.');
  }
  const instant = new Date(isoInstant);
  if (!Number.isFinite(instant.getTime())) throw new RangeError('Invalid instant.');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: CALENDAR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    era: 'short',
  }).formatToParts(instant).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  if (parts.era !== 'AD') throw new RangeError('Result is outside the civil-date domain.');
  return parseCivilDate(`${parts.year.padStart(4, '0')}-${parts.month}-${parts.day}`).iso;
}


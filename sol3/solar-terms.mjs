import { SearchSunLongitude } from './vendor/astronomy.mjs';

// Deliberately restricted to the independently checked 2026 civil year.
// A millisecond timestamp is a model output, not a claim of millisecond accuracy.
export const SOLAR_MODEL = Object.freeze({
  name: 'Astronomy Engine', version: '2.1.19',
  commit: '61dc07020aaa6885d2c7f688a4d82beaf6edb9ef', license: 'MIT',
  timeZone: 'UTC+08:00', validatedYear: 2026,
  status: 'model-estimate', exact: false,
  boundaryGuardSeconds: 120,
  boundaryGuardMeaning: 'Conservative application guard, not a proven astronomical error bound.',
});
export const TERM_NAMES = Object.freeze('小寒 大寒 立春 雨水 驚蟄 春分 清明 穀雨 立夏 小滿 芒種 夏至 小暑 大暑 立秋 處暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至'.split(' '));
const OFFSET_MS = 8 * 3600000;
const YEAR_START = Date.parse('2026-01-01T00:00:00+08:00');
const YEAR_END = Date.parse('2027-01-01T00:00:00+08:00');
const BRANCHES = [...'子丑寅卯辰巳午未申酉戌亥'];
const JIE_BRANCH = Object.freeze([1,2,3,4,5,6,7,8,9,10,11,0]);

export function strictInstant(value) {
  const m = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/);
  if (!m) throw new TypeError('Explicit ISO timestamp with seconds and UTC offset required.');
  const [,y,mo,d,h,mi,s,,,,oh='0',om='0'] = m;
  if (+y < 1 || +mo < 1 || +mo > 12 || +d < 1 || +h > 23 || +mi > 59 || +s > 59 || +oh > 14 || +om > 59 || (+oh === 14 && +om !== 0)) throw new RangeError('Invalid ISO timestamp.');
  const check = new Date(0);
  check.setUTCFullYear(+y, +mo-1, +d); check.setUTCHours(+h,+mi,+s,0);
  if (check.getUTCFullYear() !== +y || check.getUTCMonth() !== +mo-1 || check.getUTCDate() !== +d) throw new RangeError('Invalid Gregorian date.');
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) throw new RangeError('Invalid timestamp.');
  return ms;
}

export function utc8Timestamp(value) {
  const ms = strictInstant(value);
  const shifted = new Date(ms + OFFSET_MS);
  if (shifted.getUTCFullYear() < 1 || shifted.getUTCFullYear() > 9999) throw new RangeError('UTC+8 result outside four-digit civil-year domain.');
  return shifted.toISOString().slice(0,23) + '+08:00';
}

let cached;
export function calculateSolarTerms2026() {
  if (cached) return cached;
  const calculated = Object.freeze(TERM_NAMES.map((name,index) => {
    const month = String(Math.floor(index/2)+1).padStart(2,'0');
    const start = `2026-${month}-${index%2===0?'01':'15'}T00:00:00+08:00`;
    const longitude = (285 + index * 15) % 360;
    const result = SearchSunLongitude(longitude, new Date(start), 12);
    if (!result) throw new Error(`No solar-longitude root for ${name}.`);
    const instantUtc = result.date.toISOString();
    const timestampUtc8 = utc8Timestamp(instantUtc);
    if (!timestampUtc8.startsWith('2026-')) throw new Error('Root outside validated civil year.');
    return Object.freeze({index,name,longitude,kind:index%2===0?'jie':'zhongqi',
      instantUtc,timestampUtc8,civilDate:timestampUtc8.slice(0,10),
      displayMinuteUtc8:timestampUtc8.slice(0,16).replace('T',' '),
      displayMinuteMode:'truncate seconds; full model timestamp retained',
      status:'model-estimate',exact:false,model:SOLAR_MODEL});
  }));
  for (let i=1;i<calculated.length;i++) if (!(strictInstant(calculated[i].instantUtc)>strictInstant(calculated[i-1].instantUtc))) throw new Error('Non-increasing solar terms.');
  cached = calculated;
  return cached;
}

function candidate(index,phase) {
  return Object.freeze({phase,monthBranchIndex:index,monthBranch:BRANCHES[index]});
}

// This resolves only the astronomical month context; it does NOT resolve any Yi/Ji rule.
export function solarMonthAt(instant) {
  const ms = strictInstant(instant);
  if (ms < YEAR_START || ms >= YEAR_END) return Object.freeze({status:'unavailable',reason:'outside-validated-year',candidates:Object.freeze([])});
  let branch = 0; // Last December's 大雪 is already past at the start of 2026.
  for (const term of calculateSolarTerms2026()) {
    if (term.kind !== 'jie') continue;
    const nextBranch = JIE_BRANCH[term.index/2], deltaSeconds = (ms - strictInstant(term.instantUtc))/1000;
    if (Math.abs(deltaSeconds) <= SOLAR_MODEL.boundaryGuardSeconds) return Object.freeze({
      status:'model-boundary-guard',term,deltaSeconds,guardSeconds:SOLAR_MODEL.boundaryGuardSeconds,
      candidates:Object.freeze([candidate(branch,'before'),candidate(nextBranch,'after')]), exact:false,
    });
    if (deltaSeconds < 0) break;
    branch = nextBranch;
  }
  return Object.freeze({status:'model-resolved',exact:false,candidates:Object.freeze([candidate(branch,'model-side')])});
}

// Without a clock time, a civil date crossing a jie still has both contexts.
export function solarMonthOnDate(civilDate) {
  if (typeof civilDate !== 'string' || !/^2026-\d{2}-\d{2}$/.test(civilDate)) throw new RangeError('2026 Gregorian civil date required.');
  strictInstant(`${civilDate}T00:00:00+08:00`);
  const transition = calculateSolarTerms2026().find(t=>t.kind==='jie' && t.civilDate===civilDate);
  if (transition) {
    const after = JIE_BRANCH[transition.index/2], before = (after+11)%12;
    return Object.freeze({status:'transition-date',term:transition,exact:false,
      candidates:Object.freeze([candidate(before,'before'),candidate(after,'after')])});
  }
  return solarMonthAt(`${civilDate}T12:00:00+08:00`);
}

// Astronomical interval only: inclusive start and exclusive end outside the guard.
// This also supports cross-year windows, e.g. 霜降 -> 立春, within civil year 2026.
export function solarWindowAt(fromTerm, toTerm, instant) {
  if (!TERM_NAMES.includes(fromTerm) || !TERM_NAMES.includes(toTerm) || fromTerm === toTerm) throw new RangeError('Two distinct canonical solar-term names required.');
  const ms = strictInstant(instant);
  if (ms < YEAR_START || ms >= YEAR_END) return Object.freeze({status:'unavailable',reason:'outside-validated-year',included:null});
  const terms=calculateSolarTerms2026();
  const start=terms.find(t=>t.name===fromTerm),end=terms.find(t=>t.name===toTerm);
  const startMs=Date.parse(start.instantUtc),endMs=Date.parse(end.instantUtc);
  for (const [role,term] of [['start',start],['end',end]]) {
    const deltaSeconds=(ms-Date.parse(term.instantUtc))/1000;
    if (Math.abs(deltaSeconds)<=SOLAR_MODEL.boundaryGuardSeconds) return Object.freeze({
      status:'model-boundary-guard',boundary:role,term,deltaSeconds,included:null,
      candidates:Object.freeze(role==='start'?[false,true]:[true,false]),exact:false,
    });
  }
  return Object.freeze({status:'model-resolved',exact:false,
    included:startMs<endMs ? ms>=startMs&&ms<endMs : ms>=startMs||ms<endMs});
}

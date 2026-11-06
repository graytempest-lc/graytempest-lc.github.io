import {parseCivilDate} from './date-contract.mjs';
import {terms2026} from './calendar-data.mjs';
import {RULES,OFFICERS} from './rules.mjs';
export const SUPPORTED_RANGE = Object.freeze({from:'2026-01-01', to:'2026-12-31'});
export const BRANCHES = Object.freeze([... '子丑寅卯辰巳午未申酉戌亥']);
export const STEMS = Object.freeze([... '甲乙丙丁戊己庚辛壬癸']);
const JIE = Object.freeze({'小寒':1,'立春':2,'驚蟄':3,'清明':4,'立夏':5,'芒種':6,'小暑':7,'立秋':8,'白露':9,'寒露':10,'立冬':11,'大雪':0});
const mod = (n,m) => ((n%m)+m)%m;
const noonUTC = iso => Date.parse(`${iso}T12:00:00Z`);
// HKO June 2026 astronomical calendar: June 19 = 甲子 (June 18 癸亥, June 20 乙丑).
// https://www.hko.gov.hk/en/gts/astron2026/files/2026cal06.pdf
// No upstream function, calendar table or third-party runtime has been copied.
export function dayCycle(isoDate) {
  parseCivilDate(isoDate);
  const index = mod(Math.round((noonUTC(isoDate)-noonUTC('2026-06-19'))/86400000),60);
  return Object.freeze({index, stemIndex:index%10, branchIndex:index%12, name:STEMS[index%10]+BRANCHES[index%12]});
}
export function officerFor(dayBranchIndex, monthBranchIndex) {
  for (const n of [dayBranchIndex,monthBranchIndex]) {
    if (!Number.isInteger(n)||n<0||n>11) throw new RangeError('地支索引须为 0 至 11。');
  }
  const index = mod(dayBranchIndex-monthBranchIndex,12);
  return {index, name:OFFICERS[index], monthBranch:BRANCHES[monthBranchIndex], monthBranchIndex,
    isMonthBreak:index===6, baseRuleHits:[RULES[index]]};
}
export function solarMonthState(isoDate) {
  parseCivilDate(isoDate);
  if (isoDate<SUPPORTED_RANGE.from||isoDate>SUPPORTED_RANGE.to) return {status:'unavailable', reason:'outside-verified-year', candidates:[]};
  // January starts in 子月 until 小寒. A lunar first day does not change this state.
  let branch = 0;
  for (const [date,term] of Object.entries(terms2026).sort()) {
    if (!(term in JIE)) continue;
    if (date===isoDate) return {status:'transition-date', term, candidates:[
      {phase:'before',monthBranchIndex:branch}, {phase:'after',monthBranchIndex:JIE[term]}
    ]};
    if (date<isoDate) branch=JIE[term];
  }
  return {status:'date-resolved', candidates:[{phase:'whole-civil-date',monthBranchIndex:branch}]};
}

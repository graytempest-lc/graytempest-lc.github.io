import {parseCivilDate} from './date-contract.mjs';
import {lunar2026} from './calendar-data.mjs';
import {dayCycle} from './calendar-core.mjs';
export const LUNAR_DAY_NAMES=Object.freeze('初一 初二 初三 初四 初五 初六 初七 初八 初九 初十 十一 十二 十三 十四 十五 十六 十七 十八 十九 二十 廿一 廿二 廿三 廿四 廿五 廿六 廿七 廿八 廿九 三十'.split(' '));
const shift=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function lunarDayContext(civilDate){
 parseCivilDate(civilDate);const row=lunar2026[civilDate];if(!row)return null;
 const day=LUNAR_DAY_NAMES.indexOf(row.lunarDay)+1;if(!day)throw new Error('Unrecognized verified lunar day.');
 const next=lunar2026[shift(civilDate,1)],nextDay=next?LUNAR_DAY_NAMES.indexOf(next.lunarDay)+1:null;
 const lastDay=day<29?false:day===30?true:nextDay===1?true:nextDay===30?false:null;
 const firstCivilDate=shift(civilDate,1-day);
 return Object.freeze({civilDate,lunarYear:row.lunarYear,lunarMonth:row.lunarMonth,lunarDay:row.lunarDay,
  dayNumber:day,firstCivilDate,firstBranchIndex:dayCycle(firstCivilDate).branchIndex,lastDay,
  provenance:'verified-2026-lunar-date-row; month first date derived by day offset',timeZone:'UTC+08:00'});
}

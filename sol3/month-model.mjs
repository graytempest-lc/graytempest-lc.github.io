import {parseCivilDate,civilDateAt} from './date-contract.mjs';
import {lunar2026,terms2026} from './calendar-data.mjs';
import {dayCycle,solarMonthState,officerFor} from './calendar-core.mjs';
import {newsByDate} from './news-data.mjs';
import {holidayFor,holidaySource} from './holiday-data.mjs';
export {holidaySource,newsByDate};
export const RANGE=Object.freeze({from:'2026-01-01',to:'2026-12-31'});
export const LATEST_EDITION=Object.keys(newsByDate).filter(d=>d>=RANGE.from&&d<=RANGE.to).sort().at(-1)||RANGE.from;
export const pad=n=>String(n).padStart(2,'0');
export const iso=(month,day)=>`2026-${pad(month)}-${pad(day)}`;
export function supported(date){try{parseCivilDate(date);return date>=RANGE.from&&date<=RANGE.to;}catch{return false;}}
export function initialDate(query,instant){
 if(query!==null){if(supported(query))return {date:query,note:''};return {date:LATEST_EDITION,note:'链接日期无效或超出已核对的 2026 年范围，显示最新一期刊载日。'};}
 const today=civilDateAt(instant);
 return supported(today)?{date:today,note:''}:{date:LATEST_EDITION,note:'当前日期超出已核对的 2026 年范围，显示最新一期刊载日。未沿用旧年节假日。'};
}
export function dayFacts(date){
 if(!supported(date))throw new RangeError('Only verified 2026 dates are supported.');
 const cycle=dayCycle(date),state=solarMonthState(date);
 return {date,day:Number(date.slice(8)),lunar:lunar2026[date],term:terms2026[date]||null,holiday:holidayFor(date),
 cycle:cycle.name,officers:state.candidates.map(c=>({phase:c.phase,...officerFor(cycle.branchIndex,c.monthBranchIndex)})),
 news:newsByDate[date]||null,finalYi:null,finalJi:null};
}
export function monthCells(month){
 if(!Number.isInteger(month)||month<1||month>12)throw new RangeError('Month must be 1..12.');
 const count=new Date(Date.UTC(2026,month,0)).getUTCDate(),offset=(new Date(Date.UTC(2026,month-1,1)).getUTCDay()+6)%7;
 const cells=Array(offset).fill(null);for(let d=1;d<=count;d++)cells.push(dayFacts(iso(month,d)));while(cells.length%7)cells.push(null);return cells;
}
export function shiftMonth(date,delta){
 if(!supported(date)||!Number.isInteger(delta))throw new RangeError('Invalid date or month shift.');
 const m=Number(date.slice(5,7))+delta;if(m<1||m>12)return date;
 return iso(m,Math.min(Number(date.slice(8)),new Date(Date.UTC(2026,m,0)).getUTCDate()));
}
export function shiftDay(date,delta){
 if(!supported(date)||!Number.isInteger(delta))throw new RangeError('Invalid date or day shift.');
 const next=new Date(Date.parse(date+'T12:00:00Z')+delta*86400000).toISOString().slice(0,10);return supported(next)?next:date;
}

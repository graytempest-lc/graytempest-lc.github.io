import {parseCivilDate,civilDateAt} from './date-contract.mjs?v=1f1ae4ac7dab4dd1';
import {lunarFor,termFor} from './calendar-facts.mjs?v=1f1ae4ac7dab4dd1';
import {CALENDAR_RANGE,RULE_RANGE} from './calendar-range.mjs?v=1f1ae4ac7dab4dd1';
import {dayCycle,solarMonthState,officerFor} from './calendar-core.mjs?v=1f1ae4ac7dab4dd1';
import {newsByDate} from './news-data.mjs?v=1f1ae4ac7dab4dd1';
import {holidayFor,holidaySource} from './holiday-data.mjs?v=1f1ae4ac7dab4dd1';
export {holidaySource,newsByDate};
export const RANGE=CALENDAR_RANGE;
export const LATEST_EDITION=Object.keys(newsByDate).filter(d=>d>=RANGE.from&&d<=RANGE.to).sort().at(-1)||RANGE.from;
export const pad=n=>String(n).padStart(2,'0');
export const iso=(month,day,year=2026)=>`${year}-${pad(month)}-${pad(day)}`;
export function supported(date){try{parseCivilDate(date);return date>=RANGE.from&&date<=RANGE.to;}catch{return false;}}
export function initialDate(query,instant){
 if(query!==null){if(supported(query))return {date:query,note:''};return {date:LATEST_EDITION,note:'链接日期无效或超出已核对的 2026–2027 年范围，显示最新一期刊载日。'};}
 const today=civilDateAt(instant);
 return supported(today)?{date:today,note:''}:{date:LATEST_EDITION,note:'当前日期超出已核对的 2026–2027 年范围，显示最新一期刊载日。未沿用旧年节假日。'};
}
export function dayFacts(date){
 if(!supported(date))throw new RangeError('Only verified 2026–2027 dates are supported.');
 const cycle=dayCycle(date),state=solarMonthState(date);
 return {date,day:Number(date.slice(8)),lunar:lunarFor(date),term:termFor(date),holiday:holidayFor(date),
 cycle:cycle.name,officers:state.candidates.map(c=>({phase:c.phase,...officerFor(cycle.branchIndex,c.monthBranchIndex)})),
 news:newsByDate[date]||null,ruleSupported:date<=RULE_RANGE.to,finalYi:null,finalJi:null};
}
export function monthCells(month,year=2026){
 if(!supported(iso(month,1,year)))throw new RangeError('Unsupported calendar month.');
 if(!Number.isInteger(month)||month<1||month>12)throw new RangeError('Month must be 1..12.');
 const count=new Date(Date.UTC(year,month,0)).getUTCDate(),offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
 const cells=Array(offset).fill(null);for(let d=1;d<=count;d++)cells.push(dayFacts(iso(month,d,year)));while(cells.length%7)cells.push(null);return cells;
}
export function shiftMonth(date,delta){
 if(!supported(date)||!Number.isInteger(delta))throw new RangeError('Invalid date or month shift.');
 const target=new Date(Date.UTC(Number(date.slice(0,4)),Number(date.slice(5,7))-1+delta,1));
 if(!Number.isFinite(target.getTime()))return date;
 const y=target.getUTCFullYear(),m=target.getUTCMonth()+1;
 const next=iso(m,Math.min(Number(date.slice(8)),new Date(Date.UTC(y,m,0)).getUTCDate()),y);
 return supported(next)?next:date;
}
export function shiftDay(date,delta){
 if(!supported(date)||!Number.isInteger(delta))throw new RangeError('Invalid date or day shift.');
 const next=new Date(Date.parse(date+'T12:00:00Z')+delta*86400000).toISOString().slice(0,10);return supported(next)?next:date;
}

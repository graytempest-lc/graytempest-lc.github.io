import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dayFacts,monthCells,shiftMonth,shiftDay,initialDate,newsByDate} from '../public/sol3/month-model.mjs';
import {calculateDay} from '../public/sol3/almanac.mjs';
import {renderCalendar,renderDetails} from '../public/sol3/month-render.mjs';
import {lunar2027,terms2027} from '../public/sol3/calendar-2027.mjs';
import {holidaySourceFor} from '../public/sol3/holiday-data.mjs';
// Independent factual boundaries read from HKO 2027 conversion table, not the generator.
// https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2027e.txt
// Tables/PDFs are not redistributed; these assertions validate our own model output.
const starts=[['2026-12-09',11],['2027-01-08',12],['2027-02-06',1],['2027-03-08',2],['2027-04-07',3],['2027-05-06',4],['2027-06-05',5],['2027-07-04',6],['2027-08-02',7],['2027-09-01',8],['2027-09-30',9],['2027-10-29',10],['2027-11-28',11],['2027-12-28',12]];
const months=['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','腊月'];
const dayNames='初一 初二 初三 初四 初五 初六 初七 初八 初九 初十 十一 十二 十三 十四 十五 十六 十七 十八 十九 二十 廿一 廿二 廿三 廿四 廿五 廿六 廿七 廿八 廿九 三十'.split(' ');
test('Every 2027 lunar date follows independent month starts, with the lunar year changing at New Year',()=>{
 assert.equal(Object.keys(lunar2027).length,365);
 for(const [date,row] of Object.entries(lunar2027)){
  const [start,month]=starts.findLast(([d])=>d<=date);
  const n=(Date.parse(date)-Date.parse(start))/86400000;
  assert.equal(row.lunarDay,dayNames[n],date);
  assert.equal(row.lunarMonth,months[month-1],date);
  assert.equal(row.lunarYear,date<'2027-02-06'?'丙午年':'丁未年',date);
  assert.equal(row.zodiac,date<'2027-02-06'?'马':'羊',date);
 }
});
test('All 24 locally computed 2027 solar term dates match the independent reference',()=>{
 const dates='01-05 01-20 02-04 02-19 03-06 03-21 04-05 04-20 05-06 05-21 06-06 06-21 07-07 07-23 08-08 08-23 09-08 09-23 10-08 10-23 11-07 11-22 12-07 12-22'.split(' ');
 assert.deepEqual(Object.keys(terms2027),dates.map(d=>'2027-'+d));
 assert.equal(terms2027['2027-02-04'],'立春');assert.equal(terms2027['2027-12-22'],'冬至');
});
test('All 2027 months are real Monday-first grids with distinct dates',()=>{
 const dates=[];for(let month=1;month<=12;month++){const cells=monthCells(month,2027);assert.equal(cells.length%7,0);const live=cells.filter(Boolean);assert.equal(live.length,new Date(Date.UTC(2027,month,0)).getUTCDate());assert.equal(cells.indexOf(live[0]),(new Date(live[0].date).getUTCDay()+6)%7);dates.push(...live.map(x=>x.date));}
 assert.equal(new Set(dates).size,365);assert.equal(dates[0],'2027-01-01');assert.equal(dates.at(-1),'2027-12-31');
});
test('Cross-year month/day navigation, date queries and UTC+8 today no longer fall back to 2026',()=>{
 assert.equal(initialDate(null,'2026-12-31T16:00:00Z').date,'2027-01-01');
 assert.equal(initialDate('2027-02-06','2026-11-17T00:00:00Z').date,'2027-02-06');
 assert.equal(shiftDay('2026-12-31',1),'2027-01-01');assert.equal(shiftDay('2027-01-01',-1),'2026-12-31');
 assert.equal(shiftMonth('2026-12-31',1),'2027-01-31');assert.equal(shiftMonth('2027-01-31',1),'2027-02-28');assert.equal(shiftMonth('2027-01-31',-1),'2026-12-31');
 assert.equal(shiftDay('2027-12-31',1),'2027-12-31');assert.equal(shiftMonth('2027-12-31',1),'2027-12-31');
 assert.match(initialDate('2027-02-29','2027-01-01T00:00:00Z').note,/无效/);
});
test('2027 traditional rules fail closed in both homepage and detail API; 2026 remains supported',()=>{
 for(const date of ['2027-01-01','2027-02-04','2027-02-06','2027-12-31']){
  const day=calculateDay(date),facts=dayFacts(date);assert.equal(day.resolutionStatus,'calendar-only');assert.equal(day.solarTermEstimate,null);assert.deepEqual(day.contexts,[]);assert.deepEqual(facts.officers,[]);assert.equal(day.finalYi,null);assert.equal(day.finalJi,null);
  const html=renderDetails(date,day);assert.match(html,/传统规则尚未核验/);assert.doesNotMatch(html,/本条宜<|本条忌<|相关条款加载中/);
 }
 assert.equal(calculateDay('2026-11-07').resolutionStatus,'partial');
 assert.equal(calculateDay('2028-01-01').resolutionStatus,'unavailable');
});
test('2027 national holiday facts are independent of lunar festival dates and 2026 schedule',()=>{
 const expected=[['01-01','01-03'],['02-05','02-13'],['04-03','04-05'],['05-01','05-05'],['06-09','06-09'],['09-15','09-15'],['10-01','10-07']];
 const rest=Object.keys(lunar2027).filter(d=>expected.some(([a,b])=>d>='2027-'+a&&d<='2027-'+b));
 const work=['01-31','02-14','05-08','09-26','10-09'].map(d=>'2027-'+d);
 assert.equal(rest.length,29);
 for(const d of Object.keys(lunar2027))assert.equal(dayFacts(d).holiday?.kind??null,rest.includes(d)?'rest':work.includes(d)?'work':null,d);
 assert.match(holidaySourceFor('2027-02-06').document,/2026.*10/);assert.equal(holidaySourceFor('2026-02-17').year,2026);
});
test('Year-aware rendering preserves future news, 24 month choices, focus and official source',()=>{
 const date='2027-02-06',original=newsByDate[date],had=Object.hasOwn(newsByDate,date);
 newsByDate[date]={href:date+'.html',items:[{title:'测试',summary:'仅测试',href:date+'.html#test'}]};
 try{const h=renderCalendar(date,date,calculateDay(date));assert.match(h,/2027年2月/);assert.equal((h.match(/<option /g)||[]).length,24);assert.match(h,/value="2027-02" selected/);assert.equal((h.match(/tabindex="0"/g)||[]).length,1);assert.match(h,/2027-02-06.html#test/);assert.match(h,/shache.gov.cn/);}finally{if(had)newsByDate[date]=original;else delete newsByDate[date];}
});
test('Server-rendered homepage uses the shared year range, never a hardcoded 2026 cutoff',()=>{
 const text=fs.readFileSync(new URL('../src/pages/index.astro',import.meta.url),'utf8');assert.match(text,/d>=RANGE.from&&d<=RANGE.to/);assert.doesNotMatch(text,/2026-12-31/);
});

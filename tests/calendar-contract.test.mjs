import test from 'node:test';
import assert from 'node:assert/strict';
import {dayFacts,monthCells,shiftMonth,shiftDay,initialDate,supported,newsByDate} from '../public/sol3/month-model.mjs';
import {calculateDay} from '../public/sol3/almanac.mjs';
import {renderCalendar,renderMonth,renderDetails} from '../public/sol3/month-render.mjs';
import {parseFragment} from 'parse5';
test('The 2026 calendar has 365 real dates in Monday-first weeks',()=>{const dates=[];for(let m=1;m<=12;m++){const cells=monthCells(m);assert.equal(cells.length%7,0);const live=cells.filter(Boolean);assert.equal(live.length,new Date(Date.UTC(2026,m,0)).getUTCDate());dates.push(...live.map(d=>d.date));}assert.equal(dates.length,365);assert.equal(new Set(dates).size,365);});
test('Calendar rejects unsupported and malformed dates',()=>{for(const d of ['2027-01-01','2026-02-29','2026-11-31','<script>',''])assert.equal(supported(d),false);assert.throws(()=>calculateDay('2026-02-29'));});
test('Month/day selection clamps correctly without entering unverified years',()=>{assert.equal(shiftMonth('2026-01-31',1),'2026-02-28');assert.equal(shiftMonth('2026-12-31',1),'2026-12-31');assert.equal(shiftDay('2026-12-31',1),'2026-12-31');assert.equal(initialDate(null,'2026-11-05T16:00:00Z').date,'2026-11-06');});
test('Lunar new year, national holiday and adjusted workday stay separate',()=>{assert.equal(dayFacts('2026-02-17').lunar.lunarDay,'初一');assert.equal(dayFacts('2026-02-17').holiday.kind,'rest');assert.equal(dayFacts('2026-02-14').holiday.kind,'work');assert.equal(dayFacts('2026-11-08').holiday,null);});
test('Solar-term boundary preserves both conditions and unknown final advice',()=>{const d=dayFacts('2026-11-07');assert.equal(d.term,'立冬');assert.deepEqual(d.officers.map(x=>[x.phase,x.monthBranch]),[['before','戌'],['after','亥']]);assert.equal(d.finalYi,null);assert.equal(d.finalJi,null);});
test('Solar-term day renders both published and unpublished news states independently of future editions',()=>{
 const date='2026-11-07',hadEdition=Object.hasOwn(newsByDate,date),original=newsByDate[date];
 const fixture={dateBasis:'edition-publication-date',href:`${date}.html`,items:[{title:'测试日报',summary:'仅用于内存中的回归夹具。',href:`${date}.html#test-news`}]};
 const attr=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
 const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...(node.childNodes||[]).flatMap(n=>all(n,predicate))];
 const hasClass=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
 // Synchronous, process-local fixtures only. Restore the real generated data even on failure.
 try{
  for(const edition of [null,fixture]){
   if(edition)newsByDate[date]=edition;else delete newsByDate[date];
   const d=dayFacts(date);
   assert.equal(d.term,'立冬');
   assert.deepEqual(d.officers.map(x=>[x.phase,x.monthBranch]),[['before','戌'],['after','亥']]);
   assert.equal(d.finalYi,null);assert.equal(d.finalJi,null);assert.equal(d.news,edition);
   const doc=parseFragment(renderMonth(date,date)),selected=all(doc,n=>attr(n,'data-date')===date)[0];
   assert.equal(all(selected,n=>hasClass(n,'news-dot')).length,edition?1:0);
   assert.equal(attr(selected,'aria-label').includes('有日报重点'),Boolean(edition));
   const detail=parseFragment(renderDetails(date));
   const news=all(detail,n=>hasClass(n,'selected-news'))[0];
   assert.equal(all(news,n=>hasClass(n,'no-edition')).length,edition?0:1);
   assert.deepEqual(all(news,n=>n.tagName==='a').map(n=>attr(n,'href')),edition?[fixture.items[0].href,fixture.href]:[]);
  }
 }finally{
  if(hadEdition)newsByDate[date]=original;else delete newsByDate[date];
 }
 assert.equal(Object.hasOwn(newsByDate,date),hadEdition);assert.equal(newsByDate[date],original);
});
test('Generated month has exactly one selected keyboard-focusable date',()=>{const h=renderMonth('2026-11-06','2026-11-06');assert.equal((h.match(/data-date=/g)||[]).length,30);assert.equal((h.match(/tabindex="0"/g)||[]).length,1);assert.equal((h.match(/aria-pressed="true"/g)||[]).length,1);});
test('Homepage calendar keeps server-rendered almanac and publication links',()=>{const h=renderCalendar('2026-11-06',null,calculateDay('2026-11-06'));assert.match(h,/home-almanac/);assert.match(h,/data-almanac-date="2026-11-06"/);assert.match(h,/2026-11-06\.html#/);assert.match(h,/<noscript>/);});

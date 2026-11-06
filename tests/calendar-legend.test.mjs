import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseFragment} from 'parse5';
import {renderCalendar,renderMonth,renderDetails} from '../public/sol3/month-render.mjs';

const attr=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...(node.childNodes||[]).flatMap(n=>all(n,predicate))];
const hasClass=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
const datesWith=(month,marker)=>all(parseFragment(renderMonth(`2026-${month}-01`,null)),n=>n.tagName==='button'&&all(n,c=>hasClass(c,marker)).length).map(n=>attr(n,'data-date'));

test('All three legend symbols use the same marker classes as actual date cells',()=>{
 const doc=parseFragment(renderCalendar('2026-10-28',null));
 const legend=all(doc,n=>hasClass(n,'calendar-legend'))[0];
 for(const [className,symbol,label] of [['rest','休','放假'],['work','班','调休上班'],['news-dot','●','有日报']]){
  const marks=all(doc,n=>hasClass(n,className));
  assert.ok(marks.length>1,`${className} needs both a legend sample and real date markers`);
  const sample=all(legend,n=>hasClass(n,className))[0];
  assert.ok(sample,`${className} is missing from legend`);
  assert.equal(text(sample),symbol);
  assert.equal(attr(sample,'aria-hidden'),'true','Decorative symbols must not duplicate readable status');
  assert.ok(text(legend).includes(label));
  for(const marker of marks)assert.equal(text(marker),symbol);
 }
});

test('News symbols remain visible at every responsive breakpoint',()=>{
 const css=fs.readFileSync(new URL('../public/sol3/month.css',import.meta.url),'utf8');
 const rules=[...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].filter(([,selector])=>selector.includes('.news-dot'));
 assert.ok(rules.length>0,'News markers require visible styling');
 for(const [rule] of rules)assert.doesNotMatch(rule,/(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:[;}]|\s))/,'The legend symbol cannot be hidden in date cells');
});

test('Holiday and workday markers follow the actual schedule, not ordinary weekends',()=>{
 assert.deepEqual(datesWith('10','rest'),[1,2,3,4,5,6,7].map(d=>`2026-10-0${d}`));
 assert.deepEqual(datesWith('10','work'),['2026-10-10']);
 assert.deepEqual(datesWith('11','rest'),[]);
 assert.deepEqual(datesWith('11','work'),[]);
 assert.deepEqual(datesWith('02','rest'),Array.from({length:9},(_,i)=>`2026-02-${i+15}`));
 assert.deepEqual(datesWith('02','work'),['2026-02-14','2026-02-28']);
 const totals={rest:0,work:0};
 for(let m=1;m<=12;m++)for(const kind of Object.keys(totals))totals[kind]+=datesWith(String(m).padStart(2,'0'),kind).length;
 assert.deepEqual(totals,{rest:33,work:6});
});

test('News markers exactly follow published editions, including negative dates',()=>{
 const published=fs.readdirSync(new URL('../content/editions/',import.meta.url)).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(new URL('../content/editions/'+f,import.meta.url),'utf8'))).filter(i=>i.status==='published').map(i=>i.editionDate).sort();
 const marked=[];
 for(let m=1;m<=12;m++)marked.push(...datesWith(String(m).padStart(2,'0'),'news-dot'));
 assert.deepEqual(marked,published.filter(d=>d.startsWith('2026-')));
 const unpublished=Array.from({length:365},(_,i)=>new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10)).find(d=>!published.includes(d));
 if(unpublished)assert.ok(!marked.includes(unpublished));
 const doc=parseFragment(renderMonth('2026-10-28','2026-10-28'));
 const selected=all(doc,n=>attr(n,'data-date')==='2026-10-28')[0];
 assert.match(attr(selected,'aria-label'),/有日报重点/);
 assert.equal(attr(selected,'aria-pressed'),'true');
 assert.equal(attr(selected,'aria-current'),'date');
 assert.equal(attr(selected,'tabindex'),'0');
 assert.equal(all(selected,n=>hasClass(n,'news-dot')).length,1);
 assert.match(renderDetails('2026-10-28'),/2026-10-28\.html#/);
 if(unpublished)assert.match(renderDetails(unpublished),/此日暂无日报/);
});

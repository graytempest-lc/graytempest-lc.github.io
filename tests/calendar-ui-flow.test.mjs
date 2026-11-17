import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as dates from '../public/sol3/date-contract.mjs';
import * as model from '../public/sol3/month-model.mjs';
import * as render from '../public/sol3/month-render.mjs';
import {renderRuleSummary} from '../public/sol3/home-almanac.mjs';
import {calculateDay} from '../public/sol3/almanac.mjs';
function harness(date,instant='2027-01-01T01:00:00Z'){
 const nodes=new Map();let focus=null;const handlers={};
 const make=id=>({id,dataset:{},textContent:'',disabled:true,value:'',html:'',addEventListener(type,fn){handlers[id+':'+type]=fn;},set innerHTML(h){this.html=h;},get innerHTML(){return this.html;},querySelector(selector){return {focus(){focus=selector;}};}});
 for(const id of ['sol3-calendar','month-table','calendar-details','month-prev','month-next','month-select','calendar-today','calendar-status','term-estimate','home-rule-extra'])nodes.set(id,make(id));
 const location={href:'https://calendar.example/?date='+date};const loads={};
 const context={...dates,...model,...render,renderRuleSummary,URL,Date:class extends Date{constructor(value){super(value??instant);}},location,history:{replaceState(a,b,url){location.href=String(url);}},document:{getElementById(id){if(id==='home-rule-extra'){const html=nodes.get('calendar-details').html;if(!html.includes('home-rule-extra'))return null;nodes.get(id).dataset.almanacDate=html.match(/data-almanac-date="([^"]+)"/)[1];}return nodes.get(id);}},window:{addEventListener(name,fn){handlers['window:'+name]=fn;}},load(name){return new Promise((resolve,reject)=>{loads[name]={resolve,reject};});}};
 const source=fs.readFileSync(new URL('../public/sol3/month-ui.mjs',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replaceAll("import('./","load('./");
 vm.runInNewContext(source,context);
 return {nodes,handlers,loads,location,get focus(){return focus;}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('Modeled UI crosses years with arrows, PageUp, selection and today without stale disabled controls',()=>{
 const h=harness('2026-12-31'),key=key=>h.handlers['month-table:keydown']({target:{closest:()=>true},key,preventDefault(){}});
 key('ArrowRight');assert.match(h.location.href,/2027-01-01/);assert.equal(h.nodes.get('month-select').value,'2027-01');assert.equal(h.nodes.get('month-prev').disabled,false);assert.match(h.focus,/2027-01-01/);
 key('PageUp');assert.match(h.location.href,/2026-12-01/);
 h.nodes.get('month-select').value='2027-12';h.handlers['month-select:change']();assert.match(h.location.href,/2027-12-01/);assert.equal(h.nodes.get('month-next').disabled,true);
 h.handlers['calendar-today:click']();assert.match(h.location.href,/2027-01-01/);assert.match(h.nodes.get('calendar-status').textContent,/已回到/);
 h.location.href='https://calendar.example/?date=2027-02-06';h.handlers['window:popstate']();assert.match(h.nodes.get('calendar-details').html,/丁未年正月初一/);
});
test('Modeled delayed optional modules use current selection and never insert 2026 rules in 2027',async()=>{
 const h=harness('2026-11-07');h.nodes.get('month-select').value='2027-02';h.handlers['month-select:change']();
 const almanacKey=Object.keys(h.loads).find(x=>x.includes('/almanac.mjs'));const solarKey=Object.keys(h.loads).find(x=>x.includes('/solar-terms.mjs'));
 h.loads[almanacKey].resolve({calculateDay});h.loads[solarKey].resolve({calculateSolarTerms2026:()=>[{civilDate:'2026-11-07',displayMinuteUtc8:'2026-11-07 17:52'}]});await tick();
 assert.match(h.nodes.get('calendar-details').html,/2027 年传统规则尚未核验/);assert.equal(h.nodes.get('term-estimate').textContent,'');
 h.nodes.get('month-select').value='2026-11';h.handlers['month-select:change']();assert.equal(h.nodes.get('home-rule-extra').dataset.state,'ready');assert.match(h.nodes.get('term-estimate').textContent,/17:52/);
});
test('Modeled module failure preserves 2027 date selection and explicit rule boundary',async()=>{
 const h=harness('2027-02-06');for(const p of Object.values(h.loads))p.reject(Error('fixture unavailable'));await tick();h.handlers['month-next:click']();assert.match(h.location.href,/2027-03-06/);assert.match(h.nodes.get('calendar-details').html,/传统规则尚未核验/);assert.doesNotMatch(h.nodes.get('calendar-details').html,/相关条款加载中/);
});

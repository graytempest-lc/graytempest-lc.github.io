import {civilDateAt} from './date-contract.mjs';
import {initialDate,shiftMonth,shiftDay,supported,dayFacts,LATEST_EDITION} from './month-model.mjs';
import {renderMonth,renderDetails} from './month-render.mjs?v=4';
import {renderRuleSummary} from './home-almanac.mjs?v=2';
const root=document.getElementById('sol3-calendar');
const table=document.getElementById('month-table'),details=document.getElementById('calendar-details');
const prev=document.getElementById('month-prev'),next=document.getElementById('month-next'),select=document.getElementById('month-select'),todayButton=document.getElementById('calendar-today'),status=document.getElementById('calendar-status');
const now=new Date().toISOString(),start=initialDate(new URL(location.href).searchParams.get('date'),now);
let selected=start.date,solar=null,today=civilDateAt(now),almanac=null,almanacFailed=false;
function enhanceAlmanac(){
 const node=document.getElementById('home-rule-extra');if(!node||node.dataset.almanacDate!==selected)return;
 try{if(almanac){const day=almanac.calculateDay(selected);node.innerHTML=renderRuleSummary(day);node.dataset.state='ready';}else if(almanacFailed)throw Error('Optional model unavailable');}
 catch{node.textContent='相关条款暂未加载，基础条文仍可查看。';node.dataset.state='unavailable';}
}
function estimate(){
 const node=document.getElementById('term-estimate'),term=solar?.find(t=>t.civilDate===selected);
 if(node&&term)node.textContent=` · 约 ${term.displayMinuteUtc8.slice(11)}（东八区）`;
}
function show(date,{focus=false,url=true,note=''}={}){
 if(!supported(date))return;
 today=civilDateAt(new Date().toISOString());
 const nextTable=renderMonth(date,today),nextDetails=renderDetails(date);
 selected=date;table.innerHTML=nextTable;details.innerHTML=nextDetails;
 const month=Number(date.slice(5,7));select.value=String(month);prev.disabled=month===1;next.disabled=month===12;
 status.textContent=note||`已选择 ${date}，农历${dayFacts(date).lunar.lunarMonth}${dayFacts(date).lunar.lunarDay}。`;
 if(url){const u=new URL(location.href);u.searchParams.set('date',date);history.replaceState(null,'',u);}
 if(focus)table.querySelector(`[data-date="${date}"]`).focus();
 estimate();enhanceAlmanac();
}
root.addEventListener('click',e=>{const day=e.target.closest('button.month-day[data-date]');if(day)show(day.dataset.date,{focus:true});});
prev.addEventListener('click',()=>show(shiftMonth(selected,-1)));
next.addEventListener('click',()=>show(shiftMonth(selected,1)));
select.addEventListener('change',()=>show(shiftMonth(selected,Number(select.value)-Number(selected.slice(5,7)))));
todayButton.addEventListener('click',()=>{today=civilDateAt(new Date().toISOString());show(supported(today)?today:LATEST_EDITION,{note:supported(today)?'已回到东八区今天。':'今天不在已核对年份，显示最新一期刊载日。'});});
table.addEventListener('keydown',e=>{
 if(!e.target.closest('button.month-day[data-date]'))return;
 const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};let date;
 if(e.key in delta)date=shiftDay(selected,delta[e.key]);
 if(e.key==='PageUp'||e.key==='PageDown')date=shiftMonth(selected,e.key==='PageUp'?-1:1);
 const weekday=(new Date(selected+'T12:00:00Z').getUTCDay()+6)%7;
 if(e.key==='Home')date=shiftDay(selected,-weekday);if(e.key==='End')date=shiftDay(selected,6-weekday);
 if(date){e.preventDefault();show(date,{focus:true});}
});
window.addEventListener('popstate',()=>show(initialDate(new URL(location.href).searchParams.get('date'),new Date().toISOString()).date,{url:false}));
select.disabled=false;todayButton.disabled=false;
if(!supported(today))todayButton.textContent='最新刊载日';
show(selected,{url:false,note:start.note});root.dataset.ready='true';
// The calendar stays useful if the optional astronomical model cannot load.
import('./solar-terms.mjs').then(m=>{solar=m.calculateSolarTerms2026();estimate();}).catch(()=>{});

// Optional enhancement: failure must not break date switching or hide basic clauses.
import('./almanac.mjs?v=4').then(m=>{almanac=m;enhanceAlmanac();}).catch(()=>{almanacFailed=true;enhanceAlmanac();});

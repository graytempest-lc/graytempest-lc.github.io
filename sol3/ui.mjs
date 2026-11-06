import {calculateDay, civilDateAt, parseCivilDate} from './almanac.mjs?v=4';
const result=document.getElementById('result'),input=document.getElementById('civil-date'),error=document.getElementById('error');
function el(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function link(text,href){const n=el('a',text);n.setAttribute('href',href);return n;}
function ruleLine(title,values){const row=el('div',undefined,'rule-list');row.append(el('h4',title),el('p',values?.length?values.join('、'):'本条未列。'));return row;}
const effects={
 'all-forbidden':'本条诸事皆忌，不代表全日结论。','retain-specific-prohibitions':'保留本条忌项。',
 'remove-this-rule-prohibitions':'仅撤本条之忌。','exclude-virtue-relief':'本条不采用德合豁免。',
 'restrict-to-enumerated-exceptions':'本条例外仍须另有宜神。','suppress-listed-yi':'本条列明活动不注宜。',
 'suppress-dependent-yi':'相关活动不注宜。','suppress-yi-do-not-invent-ji':'不注宜，不自动增忌。',
 'follow-month-aversion':'依月厌本条取舍。','follow-month-build':'依月建本条取舍。'};
function ruleEvidence(hit){
 const d=el('details');d.append(el('summary',hit.name+(hit.certainty&&hit.certainty!=='certain'?'（待核）':'')));
 if(hit.originalText||hit.quote)d.append(el('p',hit.originalText||hit.quote));
 if(hit.directYi?.length)d.append(ruleLine('本条宜',hit.directYi));
 if(hit.directJi?.length)d.append(ruleLine('本条忌',hit.directJi));
 if(hit.effect&&effects[hit.effect])d.append(el('p',effects[hit.effect]));
 if(hit.source)d.append(link('条文出处',hit.source));
 if(hit.conditionSource&&hit.conditionSource!==hit.source)d.append(document.createTextNode(' · '),link('起例出处',hit.conditionSource));
 return d;
}
function verifiedSection(rules){
 const box=el('div',undefined,'verified-rules');
 box.append(el('h4','相关条款'));
 const certain=[...rules.godHits,...rules.seasonalHits].filter(h=>!h.certainty||h.certainty==='certain');
 box.append(el('p',[...new Set(certain.map(h=>h.name))].join('、')||'本日暂无已列条款。','muted'));
 const c=rules.completion,pending=[...(c?.pendingHits||[]),...rules.seasonalHits.filter(h=>h.certainty&&h.certainty!=='certain')];
 if(pending.length)box.append(el('p','待核：'+[...new Set(pending.map(h=>h.name))].join('、')+'。','muted'));
 if(c?.noSalary?.candidate)box.append(el('p','无禄：'+({active:'本条限制生效',relieved:'已知条件解除本条',pending:'解除条件待核'}[c.noSalary.status]||'待核')+'。','muted'));
 if(c?.suppressions?.length)box.append(el('p',c.suppressions.map(s=>s.name).join('、')+'：本条限制宜项。','muted'));
 const evidence=el('details');evidence.append(el('summary','条文与出处'));
 for(const hit of [...rules.godHits,...rules.seasonalHits,...rules.overrides,...(c?.pendingHits||[])])evidence.append(ruleEvidence(hit));
 box.append(evidence);return box;
}
function show(isoDate,updateUrl=false){
 error.hidden=true;result.replaceChildren();
 try{parseCivilDate(isoDate);}catch{input.value='';error.textContent='日期无效，请选择真实的公历日期。';error.hidden=false;return;}
 try{
  const day=calculateDay(isoDate);result.setAttribute('data-rule-version',day.verifiedRuleVersion);
  if(day.resolutionStatus==='unavailable')result.append(el('p','此日期不在 2026 年支持范围内。','notice'));
  else{
   const heading=el('div',undefined,'day-heading'),title=el('div');title.append(el('h2',day.civilDate),el('p',`农历 ${day.lunar.lunarYear}${day.lunar.lunarMonth}${day.lunar.lunarDay}`));heading.append(title);
   if(day.edition)heading.append(link('阅读当日日报 →',day.edition));result.append(heading);
   const facts=el('dl',undefined,'day-facts');
   for(const [label,value] of [['干支日',day.dayCycle.name+'日'],['月建',day.contexts.map(c=>c.monthBranch).join(' → ')],['节气',day.solarTerm?(day.solarTerm+(day.solarTermEstimate?' · 约 '+day.solarTermEstimate.displayMinuteUtc8.slice(11):'')):'—']]){const p=el('div');p.append(el('dt',label),el('dd',value));facts.append(p);}result.append(facts);
   for(const context of day.contexts){
    const section=el('section',undefined,'rule-context'),title=el('h3',context.name+'日');title.append(el('span',`${context.phase==='before'?'交节前 · ':context.phase==='after'?'交节后 · ':''}${context.monthBranch}月建`,'rule-label'));section.append(title);
    const r=context.baseRuleHits[0];section.append(ruleLine('本条宜',r.directYi),ruleLine('本条忌',r.directJi));
    const source=el('details');source.append(el('summary','建除条文出处'),el('p','《协纪辨方书》卷十 · '+r.sourceSection),link('查看原文',r.source));section.append(source,verifiedSection(context.verifiedRules));result.append(section);
   }
  }
  input.value=isoDate;if(updateUrl){const u=new URL(location.href);u.searchParams.set('date',isoDate);history.replaceState(null,'',u);}
 }catch{result.replaceChildren();error.textContent='本地计算失败，请重试。';error.hidden=false;}
}
input.addEventListener('input',()=>{error.hidden=true;result.replaceChildren(el('p','日期已修改，请点击“查看”。','muted'));});
input.addEventListener('invalid',()=>{result.replaceChildren();error.textContent='请选择 2026 年内的真实公历日期。';error.hidden=false;});
document.getElementById('date-form').addEventListener('submit',event=>{event.preventDefault();show(input.value,true);});
show(new URL(location.href).searchParams.get('date')??civilDateAt(new Date().toISOString()));

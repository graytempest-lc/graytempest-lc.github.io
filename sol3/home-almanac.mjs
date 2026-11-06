// Homepage rendering only. The basic calendar does not import the astronomical engine.
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const phase=c=>`${c.phase==='before'?'交节前 · ':c.phase==='after'?'交节后 · ':''}${c.monthBranch}月建 · ${c.name}日`;
const list=(label,items,empty)=>`<div class="home-rule-list"><dt>${label}</dt><dd>${items?.length?items.map(escape).join('、'):empty}</dd></div>`;
export function renderRuleSummary(day){
 if(!day||day.resolutionStatus==='unavailable')return '<p class="calendar-small">此日规则不在已核范围，未生成结论。</p>';
 return day.contexts.map(c=>{
  const r=c.verifiedRules,x=r.completion;
  const certain=[...r.godHits,...r.seasonalHits].filter(h=>!h.certainty||h.certainty==='certain');
  const names=[...new Set(certain.map(h=>h.name))];
  const pending=[...new Set([...(x?.pendingHits||[]),...r.seasonalHits.filter(h=>h.certainty&&h.certainty!=='certain')].map(h=>h.name))];
  const notes=[];
  if(x?.virtueBoundary)notes.push(`四仲天德取${x.virtueBoundary.direction}卦位，日支未定义。`);
  if(x?.soil?.status==='boundary')notes.push('土王起止当天待核，不作全天确定命中。');
  if(x?.noSalary?.candidate)notes.push('无禄：'+({active:'本条限制生效',relieved:'已知条件解除本条',pending:'解除条件待核'}[x.noSalary.status]||'待核')+'。');
  for(const s of x?.suppressions||[])notes.push(s.name+'：只限制已有来源的宜项，不自动添加忌。');
  if(pending.length)notes.push('待核候选：'+pending.join('、')+'；未计入确定命中。');
  return `<div class="home-rule-summary"><h5>已核条款 · ${escape(phase(c))}</h5><p>${names.length?names.map(escape).join('、'):'已核范围内暂无命中，不代表无其他规则。'}</p>${notes.map(n=>`<p class="home-rule-pending">${escape(n)}</p>`).join('')}<p class="calendar-small">已知条文冲突 ${r.scopedEffects.remainingConflicts.length} 项，尚未裁定全日宜忌。</p></div>`;
 }).join('');
}
export function renderHomeAlmanac(facts,day=null){
 const contexts=facts.officers.map(c=>{
  const r=c.baseRuleHits[0];
  return `<div class="home-rule-context"><h5>${escape(phase(c))}</h5><dl>${list('本条宜',r.directYi,'本条未列宜项，不代表当天无宜。')}${list('本条忌',r.directJi,'本条未列忌项，不代表当天无忌。')}</dl>${r.transcriptionWarnings?.length?`<p class="calendar-small">${r.transcriptionWarnings.map(escape).join('；')}</p>`:''}</div>`;
 }).join('');
 return `<section class="home-almanac" aria-labelledby="home-almanac-title" data-almanac-date="${facts.date}"><h4 id="home-almanac-title">黄历 · 已核条文</h4><p class="calendar-warning"><strong>完整宜忌待核</strong>下面是建除本条原文，未综合全部神煞与覆盖，最终宜、忌暂不输出。交节日分别列出前后条件。</p>${contexts}<div id="home-rule-extra" data-almanac-date="${facts.date}" data-state="${day?'ready':'pending'}">${day?renderRuleSummary(day):'<p class="calendar-small">基础条文已显示；更多已核条款将在本地计算后补充。</p>'}</div><p class="calendar-small">民俗文献参考，不是行事或医疗建议，不应据此延误诊疗。</p><a class="calendar-source-link" href="almanac.html?date=${facts.date}">查看全部条款与逐项来源 →</a></section>`;
}

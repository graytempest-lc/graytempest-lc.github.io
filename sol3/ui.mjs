import {calculateDay, civilDateAt, parseCivilDate} from './almanac.mjs';
import {SIX_GRADE_POLICY} from './verified-rules.mjs';
const result = document.getElementById('result');
const input = document.getElementById('civil-date');
const error = document.getElementById('error');
function el(tag,text,className) {const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;}
function link(text,href){const node=el('a',text);node.setAttribute('href',href);return node;}
function ruleLine(title,values){const row=el('div',undefined,'rule-list');row.append(el('h4',title),el('p',values?values.join('、'):'此基础条未列出；不代表当天无忌。'));return row;}
const effectLabels = {
  'all-forbidden':'本条列诸事皆忌（仅局部条文，不是全天最终结论）',
  'retain-specific-prohibitions':'保留本条列明的忌项',
  'remove-this-rule-prohibitions':'仅撤除本条之忌，不移除其他来源的忌',
  'exclude-virtue-relief':'本条不采用德合豁免',
  'restrict-to-enumerated-exceptions':'仅考虑本条列明例外，仍须另有宜神',
  'suppress-listed-yi':'不注本条列明的宜项，不自动增忌',
  'suppress-dependent-yi':'不注相关宜项',
  'suppress-yi-do-not-invent-ji':'不注相关宜项，不凭空增忌',
  'follow-month-aversion':'依月厌本条取舍，尚未裁定全日',
  'follow-month-build':'依月建本条取舍，尚未裁定全日'
};
function ruleEvidence(hit) {
  const details=el('details');details.append(el('summary',hit.name+' · 查看规则原条'));
  if(hit.certainty==='boundary')details.append(el('p','季节边界未定：只有节气日期，没有精确时刻；本条件仅可能命中，不视为全天确定生效。','notice'));
  if(hit.originalText||hit.quote)details.append(el('p',hit.originalText||hit.quote));
  details.append(el('p',(hit.ruleId?'规则 '+hit.ruleId+' · ':'')+(hit.sourceSection||'原文出处')));
  if(hit.coverage)details.append(el('p',hit.coverage==='direct-clause-only'?'已核范围：仅直接条文，尚非全部条件。':typeof hit.coverage==='string'?hit.coverage:JSON.stringify(hit.coverage)));
  if(hit.directYi?.length)details.append(ruleLine('本条所列“宜”',hit.directYi));
  if(hit.directJi?.length)details.append(ruleLine('本条所列“忌”',hit.directJi));
  if(hit.effect)details.append(el('p','局部作用：'+(effectLabels[hit.effect]||hit.effect)));
  if(hit.condition)details.append(el('p','起例：'+hit.condition));
  if(hit.excludeVirtueRelief)details.append(el('p','本专条不采用德合或天愿豁免。'));
  if(hit.reason)details.append(el('p','本版释义（仅局部规则）：'+hit.reason));
  if(hit.source)details.append(link('查看宜忌原文',hit.source));
  if(hit.conditionSource)details.append(document.createTextNode(' · '),link('查看起例原文',hit.conditionSource));
  return details;
}
function verifiedSection(rules) {
  const box=el('div',undefined,'verified-rules');
  box.append(el('h4','已核神煞与局部取舍'),el('p','以下命中只覆盖已核条文，不是最终行事建议。','muted'));
  for(const [heading,hits] of [['神煞命中',rules.godHits],['季节条件',rules.seasonalHits],['局部覆盖',rules.overrides]]) {
    box.append(el('h4',heading),el('p',hits.length?hits.map(hit=>hit.name+(hit.certainty==='boundary'?'（边界待定）':'')).join('、'):'已核范围内无命中；不代表完整规则无此项。','muted'));
    for(const hit of hits)box.append(ruleEvidence(hit));
  }
  const conflicts=el('details');conflicts.append(el('summary','已知条文冲突 · '+rules.conflicts.length+' 项（未裁成最终宜忌）'));
  for(const conflict of rules.conflicts)conflicts.append(el('p',conflict.activity+'：宜见 '+conflict.yiRules.join('、')+'；忌见 '+conflict.jiRules.join('、')));
  box.append(conflicts);
  const modes={yi:'从宜不从忌',ji:'从忌不从宜',neutral:'从宜亦从忌（冲突相抵）',allForbidden:'本条诸事皆忌'};
  const reasons={'dedicated-clause-required':'还需建、破、满专条','special-override-required':'还需专日覆盖','dedicated-clause-or-unmapped-context':'须转交专条审定','relief-presence-unknown':'指定德神是否命中未定','incomplete-god-knowledge':'尚有未核定神煞','cross-root-order-unverified':'多条取舍的先后顺序未核定','no-covered-grade-context':'不在当前逐月判等范围'};
  const grades=el('details');grades.append(el('summary','逐月六等条文候选（不是全日等级）'));
  for(const c of rules.gradeAnalysis.candidates){
    grades.append(el('p',c.root+'：'+(c.mode?modes[c.mode]:'待核')+'；条款链 '+c.trace.join(' → ')));
    if(c.retainedJi?.length)grades.append(el('p','本条仍忌：'+c.retainedJi.join('、')));
    if(c.source)grades.append(link('查看判等原文',c.source));
  }
  for(const b of rules.gradeAnalysis.blockers)grades.append(el('p',(reasons[b.kind]||'仍有未决条款')+(b.name?'：'+b.name:'')+(b.names?'：'+b.names.join('、'):''),'muted'));
  grades.append(el('p','未把多个候选强取最高等级，也未把部分规则视为全天宜忌。','notice'));box.append(grades);
  const effects=el('details');effects.append(el('summary','已执行局部豁免 · '+rules.scopedEffects.trace.length+' 次来源变化'));
  effects.append(el('p','只撤销指定来源之忌，或按原条不注宜；其他来源仍保留。以下是审计记录，不是最终行事建议。'));
  for(const t of rules.scopedEffects.trace)effects.append(el('p',(t.operation==='remove-source-ji'?'撤本条忌':'不注本条宜')+'：'+t.activities.join('、')+'；来源 '+t.targetRuleId+'；'+t.reason));
  effects.append(el('p','执行后仍有 '+rules.scopedEffects.remainingConflicts.length+' 项已知冲突，尚未裁定。','muted'));box.append(effects);
  const coverage=el('details');coverage.append(el('summary','已核覆盖与剩余缺口'),el('p','规则版本：'+rules.version+'。已核命中见上列；未命中不代表吉日，未列活动也不代表无忌。'));
  for(const missing of rules.missingRules)coverage.append(el('p',missing));box.append(coverage);
  return box;
}
function policySection() {
  const details=el('details',undefined,'rule-context');details.append(el('summary','六等级取舍政策（仅说明，尚未判定当日等级）'));
  details.append(el('p','本版已按逐月原条和各条指定德神生成候选，仍缺全量规则及完整覆盖顺序。这六级政策不能直接当作当天等级，也不简单采用“忌优先”。'));
  for(const row of SIX_GRADE_POLICY)details.append(el('p','第 '+(row.grade+1)+' 级 · '+row.label+'：逢德 '+row.withDe+'；不逢德 '+row.withoutDe));
  return details;
}
function show(isoDate, updateUrl=false) {
  error.hidden=true;
  result.replaceChildren();
  try { parseCivilDate(isoDate); } catch {
    input.value='';error.textContent='日期无效，请输入真实的公历日期（YYYY-MM-DD）。';error.hidden=false;return;
  }
  try {
    const day=calculateDay(isoDate);
    if(day.resolutionStatus==='unavailable') {
      result.append(el('p','此日期不在已核对的 2026 年范围内。未生成农历、建除或宜忌，不沿用旧数据。','notice'));
    } else {
      const heading=el('div',undefined,'day-heading'),title=el('div');
      title.append(el('h2',day.civilDate),el('p',`农历 ${day.lunar.lunarYear}${day.lunar.lunarMonth}${day.lunar.lunarDay}`));heading.append(title);
      if(day.edition)heading.append(link('阅读这一天的日报 →',day.edition));else heading.append(el('span','此日暂无日报','muted'));
      result.append(heading);
      const facts=el('dl',undefined,'day-facts');
      for(const [label,value] of [['干支日',`${day.dayCycle.name}日`],['月建',day.contexts.map(c=>c.monthBranch).join(' → ')],['节气',day.solarTerm?(day.solarTerm+(day.solarTermEstimate?' · 约 '+day.solarTermEstimate.displayMinuteUtc8.slice(11)+'（东八区，本地模型估算）':'')):'非节气日']]){const pair=el('div');pair.append(el('dt',label),el('dd',value));facts.append(pair);}result.append(facts);
      if(day.monthState.status==='transition-date') result.append(el('p',`${day.monthState.term}交节日：下面分别展示交节前与交节后的两种月建。本版没有核准交节时刻，不合成为全天唯一值日。`,'notice'));
      const warning=el('p',undefined,'notice');warning.append(el('strong','已核神煞与局部取舍，不是完整黄历'),document.createTextNode('保留建除基础条文，逐项展示已核命中与覆盖。完整六等级及全量神煞未完成，最终宜忌暂不输出。'));result.append(warning);
      for(const context of day.contexts){
        const section=el('section',undefined,'rule-context');
        const title=el('h3',`${context.name}日`);title.append(el('span',`${context.phase==='before'?'交节前':context.phase==='after'?'交节后':'当日'} · ${context.monthBranch}月建${context.isMonthBreak?' · 月破':''}`,'rule-label'));section.append(title);
        const rule=context.baseRuleHits[0];section.append(ruleLine('本条所列“宜”',rule.directYi),ruleLine('本条所列“忌”',rule.directJi));
        if(context.isMonthBreak)section.append(el('p','月破另有大量覆盖规则，本条所列“宜”尤其不能直接作为行事结论。','notice'));
        for(const warning of rule.transcriptionWarnings)section.append(el('p',warning,'muted'));
        const details=el('details'),summary=el('summary','查看来源与计算说明');details.append(summary);
        const source=el('p','《钦定协纪辨方书》卷十 · '+rule.sourceSection+'。活动保留古籍用词，分词为本版编辑处理；不含同段“又为某神”及条件条文。');source.append(document.createTextNode(' '),link('查看原文',rule.source));details.append(source,el('p',`日支“${day.dayCycle.name[1]}”相对月建“${context.monthBranch}”，按建、除、满、平、定、执、破、危、成、收、开、闭的顺序计算。干支日按东八区民用日标签，不作时辰命理推算。`));section.append(details,verifiedSection(context.verifiedRules));result.append(section);
      }
      result.append(policySection());
    }
    input.value=isoDate;
    if(updateUrl){const url=new URL(location.href);url.searchParams.set('date',isoDate);history.replaceState(null,'',url);}
  }catch(e){result.replaceChildren();error.textContent='本地计算失败，未保留旧结果。请重新加载页面；若仍失败，请暂时使用原有日报日历。';error.hidden=false;}
}
input.addEventListener('input',()=>{error.hidden=true;result.replaceChildren(el('p','日期已修改，请点击“查看”更新结果。','muted'));});
input.addEventListener('invalid',()=>{result.replaceChildren();error.textContent='请选择 2026 年内的真实公历日期。';error.hidden=false;});
document.getElementById('date-form').addEventListener('submit',event=>{event.preventDefault();show(input.value,true);});
let selected=new URL(location.href).searchParams.get('date');
if(selected===null)selected=civilDateAt(new Date().toISOString());
show(selected);

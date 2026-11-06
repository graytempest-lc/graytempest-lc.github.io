import {dayCycle as calendarDayCycle,solarMonthState as calendarMonthState} from './calendar-core.mjs';
import {heavenlyVirtueBoundary,soilWindow,nonOpposingClause,motherStorehouseClauses,lunarDateClauses,ruleHit,SOIL_JI} from './completion-rules.mjs';
import {noSalaryClause} from './no-salary.mjs';
// Independently transcribed rules from the public-domain Qing text.
// No cnlunar code, modern daily database or vendor calendar table is embedded.
// This is an incomplete, source-labelled rules layer, never a final daily verdict.
import {parseCivilDate} from './date-contract.mjs';
import {collectAdditionalRules,ADDITIONAL_RULE_CATALOG} from './additional-rules.mjs';
import {specialDayClauses,SPECIAL_DAY_NAMES} from './special-days.mjs';
import {gradingCandidates} from './grade-policy.mjs';
import {applyScopedEffects} from './scoped-effects.mjs?v=4';

export const VERIFIED_RULE_VERSION = 'sol3-verified-rules-4';
const source = (volume,revision) => `https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷${volume}&oldid=${revision}`;
const S4=source('04',787340),S5=source('05',787341),S10=source('10',787351),S11=source('11',787353);
const B='子丑寅卯辰巳午未申酉戌亥', T='甲乙丙丁戊己庚辛壬癸';
const split=s=>s?s.split(' '):[];
const mod=(n,m)=>((n%m)+m)%m;
const freeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};

export const SIX_GRADE_POLICY=freeze([
  {grade:0,label:'上：吉足胜凶',withDe:'从宜不从忌',withoutDe:'从宜不从忌'},
  {grade:1,label:'上次：吉足抵凶',withDe:'从宜不从忌',withoutDe:'从宜亦从忌'},
  {grade:2,label:'中：吉不抵凶',withDe:'从宜不从忌',withoutDe:'从忌不从宜'},
  {grade:3,label:'中次：凶胜于吉',withDe:'从宜亦从忌',withoutDe:'从忌不从宜'},
  {grade:4,label:'下：凶又逢凶',withDe:'从忌不从宜',withoutDe:'诸事皆忌'},
  {grade:5,label:'下下：凶叠大凶',withDe:'诸事皆忌',withoutDe:'诸事皆忌'},
]);

// Orthographic equivalents and explicitly separable source activities only.
// Never equate "not prohibited" with "recommended".
const VARIANTS={'宫':'宮','册':'冊','劵':'券','㑹':'會','啓':'啟','墻':'牆','牀':'床','隄':'堤','寃':'冤','醖':'醞','廻':'迴','逺':'遠'};
const SPLIT_ACTS={
  '開渠穿井':['開渠','穿井'],'立券交易':['立券','交易'],
  '整容剃頭':['整容','剃頭'],'慶賜賞賀':['慶賜','賞賀'],
  '行幸遣使':['行幸','遣使'],'上冊進表章':['上冊','上表章'],
  '補垣塞穴':['補垣','塞穴'],
};
export function activityKeys(activity){
  if(typeof activity!=='string'||!activity.trim())throw new TypeError('活动必须为非空文字。');
  const key=[...activity.trim()].map(c=>VARIANTS[c]||c).join('');
  return [...(SPLIT_ACTS[key]||[key])];
}
const keys=items=>{
  if(!Array.isArray(items))throw new TypeError('活动集合必须为数组。');
  return [...new Set(items.flatMap(activityKeys))];
};

// A fully implemented six-grade SET OPERATION, not a claim that every date's
// grade/deity context has already been established. The caller must supply a
// verified grade and a boolean virtue decision; missing inputs fail closed.
// immutableJi is for separately established "遇德犹忌" / dedicated prohibitions.
export function resolveKnownConflicts({grade,hasDe,yi,ji,immutableJi=[]}){
  if(!Number.isInteger(grade)||grade<0||grade>5)throw new RangeError('须提供已核定的 0–5 等级。');
  if(typeof hasDe!=='boolean')throw new TypeError('须明确是否遇德；未知不能当作否。');
  const good=new Set(keys(yi)),bad=new Set(keys(ji)),fixed=new Set(keys(immutableJi));
  const mode=SIX_GRADE_POLICY[grade][hasDe?'withDe':'withoutDe'];
  const overlap=[...good].filter(x=>bad.has(x)),neutral=[];
  if(mode==='诸事皆忌')return {grade,hasDe,mode,allForbidden:true,yi:[],ji:null,neutral:[],source:S10,
    sourceSection:'平日按语：六等；铺注条例',scope:'supplied-grade-and-inputs-only'};
  for(const activity of overlap){
    if(mode==='从宜不从忌')bad.delete(activity);
    else if(mode==='从忌不从宜')good.delete(activity);
    else {good.delete(activity);bad.delete(activity);neutral.push(activity);}
  }
  for(const activity of fixed){bad.add(activity);good.delete(activity);}
  return {grade,hasDe,mode,allForbidden:false,yi:[...good],ji:[...bad],
    neutral:neutral.filter(x=>!fixed.has(x)),source:S10,
    sourceSection:'平日按语：六等；铺注条例',scope:'supplied-grade-and-inputs-only'};
}

const DE_YI='祭祀 祈福 求嗣 上冊進表章 頒詔 覃恩 肆赦 施恩封拜 詔命公卿 招賢 舉正直 施恩惠 恤孤惸 宣政事 行惠愛 雪冤枉 緩刑獄 慶賜賞賀 宴會 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 般移 解除 求醫療病 裁製 營建宮室 繕城郭 興造動土 豎柱上梁 修倉庫 栽種 牧養 納畜 安葬';
const EN_YI='祭祀 祈福 求嗣 施恩封拜 舉正直 慶賜賞賀 宴會 行幸遣使 上官赴任 臨政親民 結婚姻 納采問名 般移 解除 求醫療病 裁製 修宮室 繕城郭 興造動土 豎柱上梁 納財 開倉庫 出貨財 栽種 牧養';
const WISH_YI='祭祀 祈福 求嗣 上冊進表章 頒詔 覃恩 肆赦 施恩封拜 詔命公卿 招賢 舉正直 施恩惠 恤孤惸 宣政事 行惠愛 雪冤枉 緩刑獄 慶賜賞賀 宴會 行幸遣使 安撫邊境 選將訓兵 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 裁製 營建宮室 繕城郭 興造動土 豎柱上梁 修倉庫 經絡 醞釀 開市 立券交易 納財 栽種 牧養 納畜 安葬';
const KING_YI='頒詔 覃恩 肆赦 施恩封拜 詔命公卿 招賢 舉正直 施恩惠 恤孤惸 宣政事 行惠愛 雪冤枉 緩刑獄 慶賜賞賀 宴會 行幸遣使 安撫邊境 選將訓兵 上官赴任 臨政親民 裁製';
const THREE_YI='慶賜賞賀 宴會 結婚姻 納采問名 嫁娶 進人口 裁製 修宮室 繕城郭 興造動土 豎柱上梁 修倉庫 經絡 醞釀 立券交易 納財 安碓磑 納畜';
const WASTE_JI='修倉庫 開市 立券交易 納財 開倉庫 出貨財';
// Corrected 起例曰 table in volume 5, not the rejected 历例 table quoted above it.
const HEAVENLY_WISH=['癸丑','甲子','乙亥','甲戌','乙酉','丙申','丁未','戊午','己巳','庚辰','辛卯','壬寅'];
const BARK=split('庚午 壬午 甲午 丙午 壬申 甲申 丙申 庚申 癸酉 乙酉 丁酉 己酉 辛酉');
const BARK_OPPOSITE=split('癸卯 乙卯 丁卯 辛卯 壬寅 甲寅 丙寅 庚寅 庚子 壬子 丙子');
const DE_STEMS={1:'庚',2:'丁',4:'壬',5:'辛',7:'甲',8:'癸',10:'丙',11:'乙'};
const DE_HE_STEMS={1:'乙',2:'壬',4:'丁',5:'丙',7:'己',8:'戊',10:'辛',11:'庚'};
const STEM_TABS={'甲':'開倉庫 出貨財','乙':'栽種','丁':'剃頭','庚':'經絡','辛':'醞釀','壬':'開渠'};
const BRANCH_TABS={'丑':'冠帶','寅':'祭祀','卯':'穿井','巳':'出行','午':'苫蓋','未':'求醫療病','申':'安床','酉':'宴會','亥':'嫁娶'};

function hit(ruleId,name,yi='',ji='',section=name,origin=S10,coverage='direct-clause-only'){
  return {ruleId,name,directYi:split(yi),directJi:split(ji),source:origin,sourceSection:section,coverage,
    conditionSource:ruleId.startsWith('jx5-')?S5:ruleId.startsWith('jx4-')?S4:origin};
}
function termDate(terms,name){return Object.keys(terms).find(date=>terms[date]===name)||null;}
function seasonWindow(date,terms,from,to){
  const start=termDate(terms,from),end=termDate(terms,to);
  if(!start||!end)return 'unknown';
  if(date===start||date===end)return 'boundary';
  return (start<end ? date>start&&date<end : date>start||date<end)?'certain':null;
}
const nextDate=date=>new Date(Date.parse(`${date}T12:00:00Z`)+86400000).toISOString().slice(0,10);
const TERM_ORDER=split('小寒 大寒 立春 雨水 驚蟄 春分 清明 穀雨 立夏 小滿 芒種 夏至 小暑 大暑 立秋 處暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至');
function validateInputs(civilDate,terms,baseRules){
  if(!terms||typeof terms!=='object'||Array.isArray(terms))throw new TypeError('须提供同年完整节气日期资料。');
  const entries=Object.entries(terms).sort(([a],[b])=>a.localeCompare(b));
  if(entries.length!==24)throw new RangeError('节气资料须包含同年 24 个独立节气。');
  for(let i=0;i<entries.length;i++){
    const [date,name]=entries[i];parseCivilDate(date);
    if(date.slice(0,4)!==civilDate.slice(0,4)||name!==TERM_ORDER[i])throw new RangeError('节气年份、顺序或名称不一致。');
  }
  if(!Array.isArray(baseRules))throw new TypeError('基础规则必须为数组。');
  const ids=new Set();
  for(const rule of baseRules){
    if(!rule||typeof rule!=='object'||typeof rule.ruleId!=='string'||!rule.ruleId.trim()||ids.has(rule.ruleId))throw new TypeError('基础规则须有唯一非空标识。');
    ids.add(rule.ruleId);keys(rule.directYi);
    if(rule.directJi!==null)keys(rule.directJi);
  }
}

export function calculateVerifiedRules({civilDate,dayCycle,monthBranchIndex,officer,terms,baseRules=[],includeCalendarRules=false}){
  parseCivilDate(civilDate);
  if(typeof includeCalendarRules!=='boolean')throw new TypeError('Calendar rule flag must be boolean.');
  const m=monthBranchIndex,d=dayCycle?.branchIndex,s=dayCycle?.stemIndex,n=dayCycle?.index;
  if(!Number.isInteger(m)||m<0||m>11||!Number.isInteger(n)||n<0||n>59||s!==n%10||d!==n%12||dayCycle.name!==T[s]+B[d])throw new RangeError('干支和月建上下文不一致。');
  const expectedOfficer=['建','除','满','平','定','执','破','危','成','收','开','闭'][mod(d-m,12)];
  if(officer!==expectedOfficer)throw new RangeError('值日与月建、日支不一致。');
  validateInputs(civilDate,terms,baseRules);
  const season=Math.floor(mod(m-2,12)/3),name=dayCycle.name,stem=T[s],branch=B[d],gods=[],seasonalHits=[],overrides=[];
  const add=(...a)=>gods.push(hit(...a));
  const override=(id,title,effect,reason,section)=>overrides.push({ruleId:id,name:title,effect,reason,source:S10,sourceSection:section});
  if(stem==='壬庚丙甲壬庚丙甲壬庚丙甲'[m])add('jx5-month-de','月德',DE_YI,'畋獵 取魚','月德起例（卷五）；天德月德等直接宜忌（卷十）');
  if(stem==='丁乙辛己丁乙辛己丁乙辛己'[m])add('jx5-month-de-he','月德合',DE_YI,'畋獵 取魚','月德合起例（卷五）；天德月德等直接宜忌（卷十）');
  if(stem===DE_STEMS[m])add('jx5-heaven-de','天德',DE_YI,'畋獵 取魚','天德八干月份；四仲卦位未作日支断定');
  if(stem===DE_HE_STEMS[m])add('jx5-heaven-de-he','天德合',DE_YI,'畋獵 取魚','天德合八个月；四仲月无日干之合');
  if(name===['戊寅','甲午','戊申','甲子'][season])add('jx5-heaven-pardon','天赦',split(DE_YI).filter(x=>x!=='出師').join(' '),'畋獵 取魚','天赦起例（卷五）；宜忌（卷十）');
  if(name===HEAVENLY_WISH[m])add('jx5-heaven-wish','天愿',WISH_YI,'','卷五天愿：采用后文校正起例；卷十宜忌');
  if(n<=4||(n>=15&&n<=19)||(n>=45&&n<=49))add('jx5-heaven-grace','天恩','覃恩 肆赦 施恩惠 恤孤惸 布政事 行惠愛 雪冤枉 緩刑獄 慶賜賞賀 宴會','','天恩直接条；并驿马等条件尚未全部实现');
  if(stem==='甲辛丙丁庚己戊辛壬癸庚乙'[m])add('jx5-month-grace','月恩',EN_YI,'','月恩直接条；并驿马天马的加宜未合入');
  if(['丙丁','戊己','壬癸','甲乙'][season].includes(stem))add('jx5-four-supports','四相',EN_YI,'','四相直接条；并驿马天马的加宜未合入');
  if(branch==='午辰子寅'[season])add('jx5-season-de','时德',EN_YI,'','时德直接条；并驿马天马的加宜未合入');
  if(branch==='寅巳申亥'[season])add('jx5-king','王日',KING_YI);
  for(const [god,positions,yi] of [['官日','卯午酉子','襲爵受封 上官赴任 臨政親民'],['守日','辰未戌丑','襲爵受封 上官赴任 臨政親民 安撫邊境'],['相日','巳申亥寅','襲爵受封 上官赴任 臨政親民'],['民日','午酉子卯','宴會 結婚姻 納采問名 進人口 般移 開市 立券交易 納財 栽種 牧養 納畜']]){
    if(branch===positions[season])add(`jx5-${god}`,god,yi);
  }
  if([4,8].includes(mod(d-m,12))){
    let yi=THREE_YI;
    if('寅申巳亥'.includes(branch))yi+=' 納財 栽種 牧養 納畜';
    if('子午卯酉'.includes(branch))yi+=' '+KING_YI;
    add('jx10-three-harmony','三合',[...new Set(split(yi))].join(' '),'','三合只有另外两日；长生并母仓、帝旺并王日');
  }
  if(branch==='丑子亥戌酉申未午巳辰卯寅'[m]){
    let yi='宴會 結婚姻 嫁娶 進人口 經絡 醞釀 立券交易 納財 納畜 安葬';
    if(gods.some(x=>['月恩','四相','时德'].includes(x.name)))yi+=' 修倉庫';
    add('jx10-six-harmony','六合',yi,'','六合；并月恩四相时德加修仓库');
  }
  if(mod(d-m,12)===6)add('jx4-great-waste','大耗','',WASTE_JI,'卷四大耗与月破同位；卷十直接忌');
  if(mod(d-m,12)===5)add('jx4-small-waste','小耗','',WASTE_JI,'卷四小耗为月建前五辰；卷十直接忌');
  if(m===8&&d===10)add('jx4-heavenly-dog','天狗','','祭祀','卷四按语仅申建戌日，不是所有满日');
  if(BARK.includes(name))add('jx5-bark','鸣吠','破土 安葬','','卷五校正十三日；卷十直接宜');
  if(BARK_OPPOSITE.includes(name))add('jx5-bark-opposite','鸣吠对','破土 啟攢','','卷五校正十一日；卷十直接宜');
  if(STEM_TABS[stem])add('jx10-stem-taboo-'+stem,stem+'日百忌','',STEM_TABS[stem],'百忌日');
  if(BRANCH_TABS[branch])add('jx10-branch-taboo-'+branch,branch+'日百忌','',BRANCH_TABS[branch],'百忌日');

  for(const [id,title,eligible,from,to,yi] of [
    ['fish','雨水后立夏前取鱼',['执','危','收'].includes(officer),'雨水','立夏','取魚'],
    ['hunt','霜降后立春前畋猎',['执','危','收'].includes(officer),'霜降','立春','畋獵'],
    ['timber','立冬后立春前伐木',officer==='危'||[6,8].includes(d),'立冬','立春','伐木'],
  ]){
    const certainty=eligible?seasonWindow(civilDate,terms,from,to):null;
    if(certainty==='certain'||certainty==='boundary')seasonalHits.push({...hit('jx11-season-'+id,title,yi,'',title,S11),certainty});
  }
  if(officer==='收'&&gods.some(x=>['月恩','四相','时德'].includes(x.name)))seasonalHits.push({...hit('jx10-storehouse','收日并月恩、四相或时德','修倉庫','','收日条件宜'),certainty:'certain'});

  const namedDe=gods.some(x=>['月德','月德合','天德','天德合'].includes(x.name));
  if(gods.some(x=>x.name==='小耗')){
    if([0,3,6,9].includes(m))override('jx10-small-waste-retained','小耗并劫煞','retain-specific-prohibitions','子午卯酉月小耗并劫煞，虽与德合并仍忌本条六类财货事。','小耗');
    else if(namedDe||gods.some(x=>x.name==='天愿'))override('jx10-small-waste-relieved','小耗遇德合或天愿','remove-this-rule-prohibitions','只撤除小耗本条之忌，不撤除其他来源的独立忌，更不自动加宜。','小耗');
  }
  if(officer==='破'&&[3,9].includes(m))override('jx10-break-extreme','卯酉月月破兼灾煞月厌','all-forbidden','此条明言遇德合仍诸事皆忌。仅是本条结论，未替代全日规则审定。','月破');
  if(officer==='破'&&[0,6,7,8].includes(m)){
    // Source expressly enumerates 月德、天德合、月德合 for this exception.
    const relieving=gods.some(x=>['月德','天德合','月德合'].includes(x.name));
    override('jx10-break-additional','月破叠灾煞或月刑',relieving?'retain-specific-prohibitions':'all-forbidden',relieving?'虽遇所列德合，仍忌解除、求医疗病、破屋坏垣。':'此条不遇所列德合时诸事皆忌。','月破');
  }
  if({5:'癸亥',11:'丁巳',7:'癸丑',1:'丁未'}[m]===name)override('jx10-break-special','阴阳交破、阳破阴冲','all-forbidden','四月癸亥、十月丁巳、六月癸丑、十二月丁未，此条列诸事皆忌。月份采用本版节气月建口径。','月破');
  const smallMeet={3:'己卯',4:'戊辰',5:'己巳',6:'戊午',9:'己酉',10:'戊戌',11:'己亥',0:'戊子'};
  if(smallMeet[m]===name||(m===4&&name==='庚辰')||(m===10&&name==='甲戌'))override('jx10-build-special','阴阳小会或阴位','all-forbidden','月建条列出的阴阳小会、阴位日，本条诸事皆忌。月份采用节气月建口径。','月建');
  if(m===7&&name==='己未')override('jx10-yang-error','未月己未阳错','exclude-virtue-relief','本条不作德合论，不能单凭命中德合去忌。','月建');
  gods.push(...collectAdditionalRules({monthBranchIndex:m,dayCycle,officer}));
  const specialDays=specialDayClauses({monthBranchIndex:m,dayCycle});
  overrides.push(...specialDays);
  const nextTerm=terms[nextDate(civilDate)];
  if(['春分','夏至','秋分','冬至','立春','立夏','立秋','立冬'].includes(nextTerm))override('jx10-four-separations','四离／四绝','restrict-to-enumerated-exceptions','下一公历日为'+nextTerm+'；本条只保留祭祀、解除、沐浴等列明例外。例外须另有宜神，不自动转成宜。','上朔、四离、四绝、晦日');
  if(['冬至','夏至','春分','秋分'].includes(terms[civilDate]))override('jx10-equinox-solstice','二分二至','suppress-listed-yi','本条不注上册、庆赏、宴会、行幸遣使等列明事项；“不注宜”不自动变成“忌”。','冬至、夏至、春分、秋分');
  if(d===2||gods.some(x=>x.name==='天狗'))override('jx10-worship-priority','天狗或寅日的祭祀限制','suppress-dependent-yi','忌祭祀，同时不注宜祈福、求嗣；按活动语义处理求福/祈福、祈嗣/求嗣异文。','铺注条例');
  if(d===3||stem==='壬')override('jx10-water-priority','开渠与穿井联动','suppress-dependent-yi','卯日忌穿井时不注宜开渠；壬日忌开渠时不注宜穿井。','铺注条例');
  if(officer==='开')override('jx10-open-burial','开日葬事取舍','suppress-yi-do-not-invent-ji','不注宜破土、安葬、启攒；不能只凭“不注宜”再新增忌，遇其他忌则仍注。','铺注条例');

  const completion={virtueBoundary:heavenlyVirtueBoundary(m),soil:null,pendingHits:[],lunar:null,noSalary:null,suppressions:[]};
  const nonOpposing=nonOpposingClause(m,dayCycle);
  if(nonOpposing){if(nonOpposing.certainty)completion.pendingHits.push(nonOpposing);else gods.push(nonOpposing);}
  if(includeCalendarRules){
    if(!civilDate.startsWith('2026-')||calendarDayCycle(civilDate).index!==n||!calendarMonthState(civilDate).candidates.some(c=>c.monthBranchIndex===m))throw new RangeError('Calendar-dependent rules require the actual verified date and its month candidates.');
    completion.soil=soilWindow(civilDate,terms);
    if(completion.soil.status!=='outside'){
      const soilHit=ruleHit('jx10-soil-king','土王用事',[],SOIL_JI,{invariantJi:[...SOIL_JI],conditionSource:completion.soil.source,certainty:completion.soil.status,reason:completion.soil.explanation});
      if(soilHit.certainty==='certain')gods.push(soilHit);else completion.pendingHits.push(soilHit);
    }
    for(const mother of motherStorehouseClauses({monthBranchIndex:m,dayCycle,soil:completion.soil,godNames:gods.map(g=>g.name),officer})){
      if(mother.certainty&&mother.certainty!=='certain')completion.pendingHits.push(mother);else gods.push(mother);
    }
    completion.lunar=lunarDateClauses(civilDate);gods.push(...completion.lunar.hits);completion.suppressions.push(...completion.lunar.suppressions);
    completion.noSalary=noSalaryClause({civilDate,dayCycle,monthBranchIndex:m,terms,knownGodNames:gods.map(g=>g.name),heavenDeKnown:![0,3,6,9].includes(m)});
    if(completion.noSalary.suppression)completion.suppressions.push(completion.noSalary.suppression);
  }

  // Preserve provenance even where canonically equivalent activities overlap.
  const provenance=new Map();
  const allRules=[...baseRules,...gods,...seasonalHits.filter(x=>x.certainty==='certain')];
  for(const rule of allRules)for(const [prop,side] of [['directYi','yiRules'],['directJi','jiRules']])for(const act of rule[prop]||[])for(const key of activityKeys(act)){
    if(!provenance.has(key))provenance.set(key,{activity:key,yiRules:[],jiRules:[]});
    const list=provenance.get(key)[side];if(!list.includes(rule.ruleId))list.push(rule.ruleId);
  }
  const conflicts=[...provenance.values()].filter(x=>x.yiRules.length&&x.jiRules.length);
  const universe=[...ADDITIONAL_RULE_CATALOG.map(x=>x.name),...SPECIAL_DAY_NAMES,'平日','收日','闭日','满日','建日','破日','月德','月德合','天德合','天赦','天愿'];
  if(![0,3,6,9].includes(m))universe.push('天德');
  const gradeAnalysis=gradingCandidates({monthBranch:B[m],knownGodNames:[...gods.map(x=>x.name),officer+'日',...specialDays.map(x=>x.name)],verifiedGodUniverse:universe});
  const scopedEffects=applyScopedEffects({rules:allRules,monthBranchIndex:m,dayCycle,officer,activityKeys,suppressions:completion.suppressions});
  const missingRules=[
    '神煞尚未全量实现；当前只列已核定的直接条与部分并神条件。',
    '六等级按本条白名单及转从生成候选，来源级豁免已有可追溯执行；跨根优先级与全部铺注覆盖仍未闭合。',
    '不将、母仓、土王与农历禁例已补已核部分；无禄年界及年/月干、土旺原季母仓保留、八月不将疑字、上朔年界仍未闭合。',
    '月份采用十二节月建；未另做农历月份变体，不保证与百度或其他通书一致。',
    '季节分界当天没有采用已许可的精确交节时刻，标为边界命中而非全天命中。',
    '古籍电子转录尚未逐条影印校勘；不将没有命中解释为诸事不忌。',
  ];
  if([0,3,6,9].includes(m))missingRules.unshift('本月天德涉及四维卦位及日支取法争议，本版不猜定天德日。');
  return {status:'partial',version:VERIFIED_RULE_VERSION,godHits:gods,seasonalHits,overrides,conflicts,gradeAnalysis,scopedEffects,completion,missingRules,
    knownVirtueHit:namedDe,finalGrade:null,finalYi:null,finalJi:null,
    sourceRevisions:{vol3:787338,vol4:787340,vol5:787341,vol6:787343,vol10:787351,vol11:787353}};
}

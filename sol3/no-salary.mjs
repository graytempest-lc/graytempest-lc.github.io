// 无禄: determine clauses and source-scoped restrictions, never final daily advice.
import {parseCivilDate} from './date-contract.mjs';
import {ALLOWED_LUNAR_ACTIVITIES,checkedTermEntries} from './completion-rules.mjs';
const B='子丑寅卯辰巳午未申酉戌亥',T='甲乙丙丁戊己庚辛壬癸';
const S='https://zh.wikisource.org/w/index.php?oldid=787351';
const salary=[2,3,5,6,5,6,8,9,11,0];
const solarWindows={'甲辰':['小雪','冬至'],'乙巳':['霜降','小雪'],'丙申':['處暑','秋分'],'丁亥':['大暑','處暑'],'戊戌':['處暑','秋分'],'己丑':['大暑','處暑'],'庚辰':['小滿','夏至'],'辛巳':['穀雨','小滿'],'壬申':['雨水','春分']};
function validateDay(c){if(!c||!Number.isInteger(c.index)||c.index<0||c.index>59||c.stemIndex!==c.index%10||c.branchIndex!==c.index%12||c.name!==T[c.stemIndex]+B[c.branchIndex])throw new RangeError('Invalid no-salary day.');}
function index(n,max,label){if(n!==null&&(!Number.isInteger(n)||n<0||n>max))throw new RangeError(label+' must be known index or null');}
export function isNoSalaryDay(dayCycle){validateDay(dayCycle);const firstEmpty=(10-2*Math.floor(dayCycle.index/10)+12)%12;return [firstEmpty,(firstEmpty+1)%12].includes(salary[dayCycle.stemIndex]);}
export function noSalaryClause({civilDate,dayCycle,monthBranchIndex,terms,knownGodNames=[],heavenDeKnown=false,yearStemIndex=null,yearBranchIndex=null,monthStemIndex=null}){
 parseCivilDate(civilDate);validateDay(dayCycle);index(monthBranchIndex,11,'month');if(monthBranchIndex===null)throw new TypeError('Month branch required');
 index(yearStemIndex,9,'year stem');index(yearBranchIndex,11,'year branch');index(monthStemIndex,9,'month stem');
 if(!Array.isArray(knownGodNames)||knownGodNames.some(x=>typeof x!=='string'||!x.trim())||typeof heavenDeKnown!=='boolean')throw new TypeError('Known deity context required');
 const base={name:'无禄',ruleId:'jx10-no-salary',source:S,status:'not-applicable',relief:[],unknown:[],candidate:isNoSalaryDay(dayCycle),finalYi:null,finalJi:null};
 if(!base.candidate)return base;
 if(dayCycle.name==='癸亥')return {...base,status:'active',reason:'癸亥干支俱尽，虽天月二德、岁月太阳填实及岁德会合仍以无禄论。',suppression:{ruleId:'jx10-no-salary-protected',name:'癸亥无禄',allowedYi:[...ALLOWED_LUNAR_ACTIVITIES.noSalary],source:S,reason:'只保留有其他宜来源的列明活动，余事不注宜；不是自动添加诸事皆忌。'}};
 const relief=[],unknown=[],name=dayCycle.name,s=dayCycle.stemIndex,m=monthBranchIndex,branch=salary[s];
 if(knownGodNames.some(n=>['天德','月德'].includes(n)))relief.push('天德或月德同日');else if(!heavenDeKnown)unknown.push('四仲天德日支未定义，不能据缺少命中断为无德');
 if(m===branch)relief.push('月建填实禄空');
 if(yearBranchIndex===branch)relief.push('岁支填实禄空');else if(yearBranchIndex===null)unknown.push('岁支及年界未核');
 const window=solarWindows[name];
 if(window){
  const entries=checkedTermEntries(civilDate,terms),start=entries.find(([,t])=>t===window[0])?.[0],end=entries.find(([,t])=>t===window[1])?.[0];
  if(!start||!end)throw new RangeError('Solar relief window terms missing');
  for(const d of [start,end]){parseCivilDate(d);if(d.slice(0,4)!==civilDate.slice(0,4))throw new RangeError('Solar relief term year mismatch');}
  if(start>=end)throw new RangeError('Solar relief terms must be ordered');
  if(civilDate>start&&civilDate<end)relief.push('太阳填实：'+window.join('至')+'之间');
  else if(civilDate===start||civilDate===end)unknown.push('交中气日：太阳填实前后条件并存');
 }
 if(yearStemIndex===s||monthStemIndex===s)relief.push('年干或月干同日干：天干三朋');
 else{if(yearStemIndex===null)unknown.push('年干及年界未核');if(monthStemIndex===null)unknown.push('月干与年干换年契约未核');}
 if(yearStemIndex!==null){
  const y=T[yearStemIndex],mb=B[m];
  if([['甲己','亥卯未','己丑'],['乙庚','巳酉丑','乙巳'],['丙辛','寅午戌','辛巳'],['丁壬','申子辰','丁亥']].some(([ys,ms,d])=>ys.includes(y)&&ms.includes(mb)&&d===name))relief.push('岁德合月德合会辰');
  if([['乙庚','亥','庚辰'],['丙辛','巳','丙申'],['丁壬','寅','壬申'],['戊癸','申','戊戌']].some(([ys,ms,d])=>ys.includes(y)&&ms===mb&&d===name))relief.push('天德合岁德会辰');
 }
 if(relief.length)return {...base,status:'relieved',relief,unknown,reason:'至少一个独立、已知解除条件成立；只撤无禄本条，不撤其他来源禁忌。'};
 if(unknown.length)return {...base,status:'pending',unknown,reason:'候选无禄仍有未决解除条件，不执行全日宜项限制。'};
 return {...base,status:'active',reason:'已给定上下文未命中本条解除。',suppression:{ruleId:'jx10-no-salary-active',name:'无禄',allowedYi:[...ALLOWED_LUNAR_ACTIVITIES.noSalary],source:S,reason:'只保留已有宜来源的允许活动，余事不注宜，不额外生忌。'}};
}

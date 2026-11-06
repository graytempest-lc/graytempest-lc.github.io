// Apply only individually verified, source-owned exemptions and suppressions.
// No global grade or final daily verdict is inferred from this partial ledger.
const S='https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351';
const B='子丑寅卯辰巳午未申酉戌亥',T='甲乙丙丁戊己庚辛壬癸';
const DE=['天德','月德','天德合','月德合'];
const MILITARY=['安撫邊境','選將訓兵','出師'];
export function applyScopedEffects({rules,monthBranchIndex,dayCycle,officer,activityKeys}){
 if(!Array.isArray(rules)||typeof activityKeys!=='function')throw new TypeError('须提供可追溯规则数组和活动归一函数。');
 if(!Number.isInteger(monthBranchIndex)||monthBranchIndex<0||monthBranchIndex>11||!dayCycle||!Number.isInteger(dayCycle.index)||dayCycle.index<0||dayCycle.index>59||dayCycle.stemIndex!==dayCycle.index%10||dayCycle.branchIndex!==dayCycle.index%12||dayCycle.name!==T[dayCycle.stemIndex]+B[dayCycle.branchIndex])throw new RangeError('局部豁免上下文无效。');
 if(officer!==['建','除','满','平','定','执','破','危','成','收','开','闭'][(dayCycle.branchIndex-monthBranchIndex+12)%12])throw new RangeError('局部豁免值日不一致。');
 const names=new Set(rules.map(r=>r.name)), has=xs=>xs.some(x=>names.has(x)),m=monthBranchIndex;
 const trace=[],state=rules.map(r=>{
  if(!r||typeof r.ruleId!=='string'||!Array.isArray(r.directYi)||(r.directJi!==null&&!Array.isArray(r.directJi)))throw new TypeError('规则须含来源 ID 和活动数组。');
  return {...r,yi:new Set(r.directYi.flatMap(activityKeys)),ji:new Set((r.directJi||[]).flatMap(activityKeys)),originalJi:new Set((r.directJi||[]).flatMap(activityKeys))};
 });
 if(new Set(state.map(r=>r.ruleId)).size!==state.length)throw new TypeError('规则来源 ID 不能重复。');
 const remove=(targets,keep,why)=>{
  for(const r of state.filter(r=>targets.includes(r.name))){
   const retained=new Set([...keep,...(r.invariantJi||[])].flatMap(activityKeys)),removed=[...r.ji].filter(x=>!retained.has(x));
   for(const x of removed)r.ji.delete(x);
   if(removed.length)trace.push({operation:'remove-source-ji',targetRuleId:r.ruleId,activities:removed,reason:why,source:S});
  }
 };
 const suppress=(activities,why)=>{
  const set=new Set(activities.flatMap(activityKeys));
  for(const r of state){const removed=[...r.yi].filter(x=>set.has(x));for(const x of removed)r.yi.delete(x);
   if(removed.length)trace.push({operation:'suppress-source-yi',targetRuleId:r.ruleId,activities:removed,reason:why,source:S});}
 };
 if(names.has('小耗')&&![0,3,6,9].includes(m)&&has([...DE,'天愿']))remove(['小耗'],[],'小耗遇德合天愿，只撤小耗来源');
 if(has([...DE,'六合']))remove(['五虚'],[],'五虚遇德合或六合');
 if(has([...DE,'天赦','三合','六合']))remove(['五离'],[],'五离遇德合赦、三合六合');
 if(has([...DE,'天赦']))remove(['厌对','招摇'],[],'厌对招摇遇德合天赦；月破等其他来源保留');
 if(names.has('四耗')&&(([4].includes(m)&&has(['天德','月德']))||([2,8].includes(m)&&has(['天德合']))||(m===5&&has(['月德合']))||([1,4,7,10].includes(m)&&has(['三合']))))remove(['四耗'],MILITARY,'四耗按指定月份、德神或三合，只留军务');
 if([0,6].includes(m)&&has(['月德']))remove(['五墓'],[],'五月十一月五墓与月德并');
 if(m===2&&dayCycle.name==='乙亥'&&has(['天愿']))remove(['四穷'],MILITARY,'正月乙亥四穷并天愿，只留军务');
 if(names.has('八专')&&has(['天愿']))remove(['八专'],MILITARY,'八专并天愿，只留军务');
 if(has([...DE,'天赦','六合'])&&has(['复日','重日'])){
  remove(['复日','重日'],[],'重复遇德赦六合，不忌但亦不注宜');
  suppress(['破土','安葬','啟攢'],'重复遇德赦六合，不注葬事宜；不撤其他独立忌');
 }
 if(dayCycle.name[1]==='寅'||names.has('天狗'))suppress(['祈福','求嗣'],'天狗或寅日忌祭祀，不注宜祈福求嗣');
 if(dayCycle.name[1]==='卯')suppress(['開渠'],'卯日忌穿井，不注宜开渠');
 if(dayCycle.name[0]==='壬')suppress(['穿井'],'壬日忌开渠，不注宜穿井');
 if(officer==='开')suppress(['破土','安葬','啟攢'],'开日不注葬事宜，已有忌另依其来源');
 const ledger=new Map();
 for(const r of state)for(const side of ['yi','ji'])for(const act of r[side]){
  if(!ledger.has(act))ledger.set(act,{activity:act,yiRules:[],jiRules:[]});ledger.get(act)[side+'Rules'].push(r.ruleId);
 }
 return {status:'partial-source-scoped',trace,activities:[...ledger.values()],
  remainingConflicts:[...ledger.values()].filter(x=>x.yiRules.length&&x.jiRules.length),
  invariantProhibitions:state.flatMap(r=>(r.invariantJi||[]).flatMap(activityKeys).map(activity=>({activity,ruleId:r.ruleId,source:r.source}))),
  finalYi:null,finalJi:null,limitations:['仅执行本模块列明的来源级豁免和不注宜条款；未运行完整日级六等及全部铺注覆盖。','活动账本保留未裁定冲突，不能作为最终宜忌。']};
}

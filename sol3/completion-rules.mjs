// Newly verified clauses. No final daily Yi/Ji is inferred from these matches.
import {parseCivilDate} from './date-contract.mjs';
import {lunarDayContext} from './lunar-context.mjs';
import {calculateLunarPhases2026} from './lunar-phases.mjs';
const S4='https://zh.wikisource.org/w/index.php?oldid=787340',S5='https://zh.wikisource.org/w/index.php?oldid=787341',S6='https://zh.wikisource.org/w/index.php?oldid=787343',S10='https://zh.wikisource.org/w/index.php?oldid=787351';
const S1='https://zh.wikisource.org/wiki/欽定協紀辨方書_(四庫全書本)/卷01';
const B='子丑寅卯辰巳午未申酉戌亥',T='甲乙丙丁戊己庚辛壬癸', split=s=>s?s.split(' '):[];
const freeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
// Month order: 寅..丑. 六月戊午 is removed by the editor's subsequent correction.
// 八月癸己 is NOT silently repaired to 癸巳: that one entry is a pending candidate.
const NON_OPPOSING_ROWS=freeze([
 '辛亥 辛丑 辛卯 庚子 庚寅 己亥 己丑 己卯 丁亥 丁丑 丁卯 丙子 丙寅',
 '庚戌 庚子 庚寅 己亥 己丑 丁亥 丁丑 丙戌 丙子 丙寅 乙亥 乙丑',
 '己酉 己亥 己丑 丁酉 丁亥 丁丑 丙戌 丙子 乙酉 乙亥 乙丑 甲戌 甲子',
 '丁酉 丁亥 丙申 丙戌 丙子 乙酉 乙亥 甲申 甲戌 甲子 戊申 戊戌 戊子',
 '丙申 丙戌 乙未 乙酉 乙亥 甲申 甲戌 戊申 戊戌 癸未 癸酉 癸亥',
 '乙未 乙酉 甲午 甲申 甲戌 戊申 戊戌 癸未 癸酉 壬午 壬申 壬戌',
 '乙巳 乙未 乙酉 甲午 甲申 戊午 戊申 癸巳 癸未 癸酉 壬午 壬申',
 '甲辰 甲午 甲申 戊辰 戊午 戊申 癸未 壬辰 壬午 壬申 辛巳 辛未',
 '戊辰 戊午 癸卯 癸巳 癸未 壬辰 壬午 辛卯 辛巳 辛未 庚辰 庚午',
 '癸卯 癸巳 壬寅 壬辰 壬午 辛卯 辛巳 庚寅 庚辰 庚午 己卯 己巳',
 '壬寅 壬辰 辛丑 辛卯 辛巳 庚寅 庚辰 己丑 己卯 己巳 丁丑 丁卯 丁巳',
 '辛丑 辛卯 庚子 庚寅 庚辰 己丑 己卯 丁丑 丁卯 丙子 丙寅 丙辰'
].map(split));
export {NON_OPPOSING_ROWS};
export const ALLOWED_LUNAR_ACTIVITIES=freeze({
 monthTaboo:split('祭祀 宴會 沐浴 整容 剃頭 整手足甲 求醫療病 補垣 掃舍宇 修飾垣牆 平治道塗'),
 lastDay:split('祭祀 解除 沐浴 整容 剃頭 整手足甲 補垣 塞穴 掃舍宇 修飾垣牆 平治道塗 破屋壞垣 伐木'),
 noSalary:split('祭祀 解除 沐浴 整容 剃頭 整手足甲 掃舍宇 修飾垣牆 平治道塗 破屋壞垣 伐木')
});
export const SOIL_JI=freeze(split('營建宮室 修宮室 繕城郭 築堤防 興造動土 修倉庫 修置產室 開渠穿井 安碓磑 補垣 修飾垣牆 平治道塗 破屋壞垣 栽種 破土'));
export function ruleHit(ruleId,name,yi=[],ji=[],extra={}){return {ruleId,name,directYi:[...yi],directJi:[...ji],source:S10,conditionSource:S10,sourceSection:name,coverage:'verified-clause-only',...extra};}
function validateCycle(c){if(!c||!Number.isInteger(c.index)||c.index<0||c.index>59||c.stemIndex!==c.index%10||c.branchIndex!==c.index%12||c.name!==T[c.stemIndex]+B[c.branchIndex])throw new RangeError('Invalid day-cycle context.');}
export function heavenlyVirtueBoundary(monthBranchIndex){
 if(!Number.isInteger(monthBranchIndex)||monthBranchIndex<0||monthBranchIndex>11)throw new RangeError('Invalid month.');
 const directions={0:'巽',3:'坤',6:'乾',9:'艮'};
 return directions[monthBranchIndex]?{status:'day-branch-undefined',direction:directions[monthBranchIndex],heavenlyVirtueDay:null,heavenlyVirtueHe:false,source:S5,
  explanation:'四仲取四维卦位；编者按不许把十干天德混入十二支起例。本版不将卦位换成申亥寅巳或未戌丑辰。'}:null;
}
export function checkedTermEntries(civilDate,terms){
 parseCivilDate(civilDate);
 if(!terms||typeof terms!=='object'||Array.isArray(terms))throw new TypeError('A named term/date object is required.');
 const entries=Object.entries(terms).sort(([a],[b])=>a.localeCompare(b));
 if(new Set(entries.map(x=>x[1])).size!==entries.length)throw new RangeError('Duplicate named solar term.');
 for(const [date,name] of entries){parseCivilDate(date);if(date.slice(0,4)!==civilDate.slice(0,4)||typeof name!=='string'||!name.trim())throw new RangeError('Invalid solar term date/name/year.');}
 return entries;
}
// Common whole-day interior of two plausible interpretations: civil D-18..D-1,
// and [estimated term instant -18 days, term instant). End/start dates remain unknown.
export function soilWindow(civilDate,terms){
 const selected=checkedTermEntries(civilDate,terms).filter(([,t])=>['立春','立夏','立秋','立冬'].includes(t));
 if(selected.length!==4||selected.map(x=>x[1]).join(' ')!=='立春 立夏 立秋 立冬')throw new RangeError('Four distinct same-year seasonal terms required.');
 for(const [date] of selected){parseCivilDate(date);if(date.slice(0,4)!==civilDate.slice(0,4))throw new RangeError('Term year mismatch.');}
 for(const [end,term] of selected){const days=(Date.parse(end+'T12:00:00Z')-Date.parse(civilDate+'T12:00:00Z'))/86400000;
  if(days>=0&&days<=18)return {status:days===0||days===18?'boundary':'certain',daysBefore:days,term,endDate:end,source:S1,
   explanation:'四立之前各旺十八日。这里只采用两种日/时边界解释共同覆盖的完整日期；起止当天待核，不宣称原典已规定精确时刻。'};
 }
 return {status:'outside',source:S1};
}
export function nonOpposingClause(monthBranchIndex,dayCycle){
 validateCycle(dayCycle);if(!Number.isInteger(monthBranchIndex)||monthBranchIndex<0||monthBranchIndex>11)throw new RangeError('Invalid month.');
 if(monthBranchIndex===9&&dayCycle.name==='癸巳')return ruleHit('jx4-non-opposing-transcription','不将（疑字待核）',['嫁娶'],[],{certainty:'unverified-transcription',conditionSource:S4,reason:'八月转录作癸己，不能仅因它不合法就悄然校为癸巳；须补影印核字。'});
 return NON_OPPOSING_ROWS[(monthBranchIndex+10)%12].includes(dayCycle.name)?ruleHit('jx4-non-opposing','不将',['嫁娶'],[],{conditionSource:S4,sourceSection:'阴阳不将；六月戊午按后文剔除',reason:'只列嫁娶直接宜，不取消其他婚姻忌。'}):null;
}
export function motherStorehouseClauses({monthBranchIndex,dayCycle,soil,godNames=[],officer}){
 validateCycle(dayCycle);if(!Number.isInteger(monthBranchIndex)||monthBranchIndex<0||monthBranchIndex>11||!['certain','boundary','outside'].includes(soil?.status))throw new RangeError('Invalid mother-storehouse context.');
 if(!Array.isArray(godNames)||godNames.some(n=>typeof n!=='string'||!n.trim()||n!==n.trim()))throw new TypeError('Known deity names must be trimmed nonempty strings.');
 if(officer!==['建','除','满','平','定','执','破','危','成','收','开','闭'][(dayCycle.branchIndex-monthBranchIndex+12)%12])throw new RangeError('Mother-storehouse officer mismatch.');
 const season=Math.floor(((monthBranchIndex+10)%12)/3),branch=B[dayCycle.branchIndex],seasonHit=['亥子','寅卯','辰戌丑未','申酉'][season].includes(branch),fireHit='巳午'.includes(branch);
 const yi=split('納財 栽種 牧養 納畜');if(officer==='开'||godNames.some(n=>['月恩','四相'].includes(n)))yi.push('修倉庫');
 if(soil.status==='outside'&&seasonHit)return [ruleHit('jx5-mother-season','母仓',yi,[],{conditionSource:S5,sourceSection:'母仓四时起例；卷十并月恩四相开日加修仓库'})];
 if(soil.status!=='outside'&&seasonHit)return [ruleHit('jx5-mother-season-pending','母仓（季例待核）',yi,[],{conditionSource:S5,certainty:soil.status==='boundary'?'boundary':'interpretation-pending',reason:'土王期间原季母仓保留与否，月表的“添”字不足以替代逐日影印核验；不据此作确定宜。'})];
 if(soil.status!=='outside'&&fireHit)return [ruleHit('jx5-mother-soil','母仓',yi,[],{conditionSource:S5,certainty:soil.status==='boundary'?'boundary':'certain',sourceSection:'土王后巳午；四季月表添母仓',reason:'只在土王共同完整日期确认；边界不合成为全日结论。'})];
 return [];
}
export function lunarDateClauses(civilDate){
 const c=lunarDayContext(civilDate);if(!c)return {context:null,hits:[],suppressions:[],phases:[]};
 const hits=[],suppressions=[],n=c.dayNumber,add=(...args)=>hits.push(ruleHit(...args));
 if(n===6-Math.floor(c.firstBranchIndex/2))add('jx6-reverse-branch','反支',[],split('上冊進表章 陳詞訟'),{conditionSource:S6,invariantJi:split('上冊進表章 陳詞訟'),sourceSection:'反支按本农历月朔支；遇德合赦愿仍忌',reason:'朔日支 '+B[c.firstBranchIndex]+'，只在本月初'+n+'命中，不每十二天重复。'});
 if([12,15].includes(n))add('jx10-human-spirit-hair','人神所在日·剃头',[],['剃頭'],{invariantJi:['剃頭'],sourceSection:'人神所在日：十二、十五'});
 if([1,6,15,19,21,23].includes(n))add('jx10-human-spirit-nails','人神所在日·整手足甲',[],['整手足甲'],{invariantJi:['整手足甲'],sourceSection:'人神所在日：初一、初六、十五、十九、廿一、廿三'});
 if(n===15)add('jx10-lunar-fifteen','农历十五',[],['求醫療病'],{invariantJi:['求醫療病'],reason:'独立十五专条，不以十五代替天文望日。仅史料展示，不应据此延误就医。'});
 if([5,14,23].includes(n))suppressions.push({ruleId:'jx10-month-taboo',name:'月忌日',allowedYi:[...ALLOWED_LUNAR_ACTIVITIES.monthTaboo],source:S10,conditionSource:S6,reason:'农历初五、十四、廿三只注列明活动；没有来源宜的不自动生宜，不因不注而新增忌。'});
 if(c.lastDay)suppressions.push({ruleId:'jx10-last-lunar-day',name:'晦日',allowedYi:[...ALLOWED_LUNAR_ACTIVITIES.lastDay],source:S10,reason:'采用晦日专门按语：余事虽不忌亦不注宜；不把总列文字误做全日诸事皆忌。'});
 const phases=calculateLunarPhases2026().filter(p=>p.civilDate===civilDate);
 for(const p of phases)add('jx10-moon-phase-'+p.quarter,'天文'+p.name,[],['求醫療病'],{invariantJi:['求醫療病'],sourceSection:'朔弦望：忌求医疗病',conditionSource:'https://github.com/cosinekitty/astronomy/commit/61dc07020aaa6885d2c7f688a4d82beaf6edb9ef',coverage:'phase-civil-date-UTC8-convention',reason:'以本地天文模型的东八区民用日归日，已独立核对2026全部50个月相日期。古籍时宪日界未完整复原；仅史料展示，不作医疗建议。'});
 return {context:c,hits,suppressions,phases};
}

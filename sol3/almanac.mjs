import {calculateSolarTerms2026} from './solar-terms.mjs';
import { parseCivilDate, civilDateAt } from './date-contract.mjs';
import { lunar2026, terms2026, editions } from './calendar-data.mjs';
import { RULES, OFFICERS, RULE_VERSION } from './rules.mjs';
import { calculateVerifiedRules, VERIFIED_RULE_VERSION } from './verified-rules.mjs';
export { parseCivilDate, civilDateAt };
import {SUPPORTED_RANGE,BRANCHES,STEMS,dayCycle,officerFor,solarMonthState} from './calendar-core.mjs';
export {SUPPORTED_RANGE,BRANCHES,STEMS,dayCycle,officerFor,solarMonthState};
export function calculateDay(isoDate) {
  parseCivilDate(isoDate);
  const base={civilDate:isoDate,timeZone:'Asia/Shanghai',ruleVersion:RULE_VERSION,verifiedRuleVersion:VERIFIED_RULE_VERSION,
    finalYi:null,finalJi:null,resolutionStatus:'partial',
    conventions:{civilDay:'00:00 UTC+08:00',dayCycle:'civil-date label; no 23:00 rollover',
      lunarYear:'Chinese New Year',month:'12 jie boundaries, not lunar month',
      transition:'both sides shown; exact instant unavailable'},
    comparison:{baidu:'not-verified',matchesBaidu:null},
    edition:editions.includes(isoDate)?`${isoDate}.html`:null};
  if (isoDate<SUPPORTED_RANGE.from||isoDate>SUPPORTED_RANGE.to) return {...base,
    resolutionStatus:'unavailable',reason:'outside-verified-year',lunar:null,solarTerm:null,dayCycle:null,monthState:null,contexts:[]};
  const cycle=dayCycle(isoDate), monthState=solarMonthState(isoDate);
  return {...base,lunar:{...lunar2026[isoDate]},solarTerm:terms2026[isoDate]??null,solarTermEstimate:calculateSolarTerms2026().find(t=>t.civilDate===isoDate)??null,dayCycle:cycle,monthState,
    contexts:monthState.candidates.map(candidate=>{
      const context={...candidate,...officerFor(cycle.branchIndex,candidate.monthBranchIndex)};
      return {...context,verifiedRules:calculateVerifiedRules({civilDate:isoDate,dayCycle:cycle,
        monthBranchIndex:context.monthBranchIndex,officer:context.name,terms:terms2026,baseRules:context.baseRuleHits})};
    }),
    limitations:['已核神煞与局部取舍，不是完整黄历。','尚未完成全量神煞、当日六等级判定及全部覆盖；最终宜忌不输出。',
      '十二节交节日仅分交节前后，不给单一全天结论。','民俗文献参考，不是科学预测或医疗、财务、法律建议。']};
}

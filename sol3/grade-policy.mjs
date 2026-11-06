// A pure, conditional policy evaluator. Does not compute gods or final activities.
import {GRADE_ROWS,GRADE_POLICIES} from './grade-data.mjs';
export {GRADE_ROWS,GRADE_POLICIES};
const BRANCHES='子丑寅卯辰巳午未申酉戌亥';
const ALIASES={'劫煞':'刼煞','灾煞':'災煞','月厌':'月厭','大时':'大時','闭日':'閉日','满日':'滿日','建日':'月建','破日':'月破','天愿':'天願','四废':'四廢','岁薄':'歲薄','逐阵':'逐陣','平':'平日','收':'收日','闭':'閉日','满':'滿日','建':'月建','破':'月破'};
const normalize=n=>ALIASES[n]||n;
export const MINIMUM_GOD_UNIVERSE=Object.freeze([...new Set([...GRADE_ROWS.map(r=>r.root),...GRADE_ROWS.flatMap(r=>r.reliefAny),'月建','月破','滿日','四廢','歲薄','逐陣'])]);
function names(value,label){
 if(!Array.isArray(value)||value.some(n=>typeof n!=='string'||!n.trim()||n!==n.trim()))throw new TypeError(label+' must be an array of nonempty trimmed names');
 return new Set(value.map(normalize));
}
export function evaluateGradeContext({root,monthBranch,knownGodNames=[],verifiedGodUniverse=[]}){
 root=normalize(root);
 if(!BRANCHES.includes(monthBranch)||typeof monthBranch!=='string'||monthBranch.length!==1)throw new RangeError('monthBranch must be one of twelve earthly branches');
 const present=names(knownGodNames,'knownGodNames'),universe=names(verifiedGodUniverse,'verifiedGodUniverse');
 // Explicit known hits prove presence, even if no full absence universe was supplied.
 const trace=[],visited=new Set();
 while(true){
  if(visited.has(root))throw new Error('cyclic canonical redirect');visited.add(root);
  const row=GRADE_ROWS.find(r=>r.root===root&&r.monthBranches.includes(monthBranch));
  if(!row)return {status:'blocked',root,trace,reason:'dedicated-clause-or-unmapped-context',grade:null,mode:null};
  trace.push(row.id);
  if(row.redirectTo){root=row.redirectTo;continue;}
  const hit=row.reliefAny.filter(n=>present.has(n));
  const unknown=row.reliefAny.filter(n=>!present.has(n)&&!universe.has(n));
  if(row.grade!==0&&row.grade!==5&&!hit.length&&unknown.length)return {status:'blocked',root,trace,reason:'relief-presence-unknown',unknown,grade:row.grade,mode:null};
  const relief=hit.length>0;
  return {status:'conditional',root,trace,grade:row.grade,mode:GRADE_POLICIES[row.grade][relief?'withRelief':'withoutRelief'],relief,reliefHits:hit,retainedJi:(relief||row.grade===0)?[...row.retainedWhenRelieved]:[],source:row.source,sourceLine:row.sourceLine,scope:'monthly-context-only'};
 }
}
export function gradingCandidates({monthBranch,knownGodNames,verifiedGodUniverse=[]}){
 if(typeof monthBranch!=='string'||monthBranch.length!==1||!BRANCHES.includes(monthBranch))throw new RangeError('monthBranch must be one of twelve earthly branches');
 const present=names(knownGodNames,'knownGodNames'),universe=names(verifiedGodUniverse,'verifiedGodUniverse');
 const roots=[...new Set(GRADE_ROWS.map(r=>r.root))].filter(n=>present.has(n));
 const raw=roots.map(root=>evaluateGradeContext({root,monthBranch,knownGodNames:[...present],verifiedGodUniverse:[...universe]}));
 const seen=new Set(),candidates=raw.filter(r=>{const key=r.root+':'+r.mode+':'+r.reason;if(seen.has(key))return false;seen.add(key);return true;});
 const blockers=[];
 for(const name of ['月建','月破','滿日'])if(present.has(name))blockers.push({kind:'dedicated-clause-required',name});
 for(const name of ['四廢','歲薄','逐陣'])if(present.has(name))blockers.push({kind:'special-override-required',name});
 for(const c of candidates)if(c.status==='blocked')blockers.push({kind:c.reason,root:c.root,unknown:c.unknown||[]});
 const missing=MINIMUM_GOD_UNIVERSE.filter(n=>!present.has(n)&&!universe.has(n));
 if(missing.length)blockers.push({kind:'incomplete-god-knowledge',names:missing});
 const modes=[...new Set(candidates.map(c=>c.mode).filter(Boolean))];
 if(modes.length>1)blockers.push({kind:'cross-root-order-unverified',modes});
 if(!candidates.length)blockers.push({kind:'no-covered-grade-context'});
 return {status:'partial',candidates,blockers,conditionalMode:!blockers.length&&modes.length===1?modes[0]:null,finalGrade:null,finalYi:null,finalJi:null,scope:'monthly-context-candidates-not-final-daily-verdict'};
}

// Explicit month/day clauses in volume 10, oldid 787351, 月厭 paragraph.
// These are local clause matches, not final daily outcomes.
const S='https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷10&oldid=787351';
const B='子丑寅卯辰巳午未申酉戌亥',T='甲乙丙丁戊己庚辛壬癸';
const rows=[
 ['great-meeting','阴阳大会',{2:'甲戌',3:'乙酉',6:'丙午',7:'丁巳',8:'庚辰',9:'辛卯',0:'壬子',1:'癸亥'},'all-forbidden'],
 ['small-meeting','阴阳小会',{3:'己卯',4:'戊辰',5:'己巳',6:'戊午',9:'己酉',10:'戊戌',11:'己亥',0:'戊子'},'all-forbidden'],
 ['yin-position','阴位',{4:'庚辰',10:'甲戌'},'all-forbidden'],
 ['yin-yang-break','阴阳交破',{5:'癸亥',11:'丁巳'},'all-forbidden'],
 ['yin-yang-clash','阴阳击冲',{6:'壬子',0:'丙午'},'all-forbidden'],
 ['yang-break','阳破阴冲',{7:'癸丑',1:'丁未'},'all-forbidden'],
 ['yin-clash-yang','阴道冲阳',{3:'己酉',9:'己卯'},'all-forbidden'],
 ['year-thin','岁薄',{5:'丙午 戊午',11:'壬子 戊子'},'follow-month-aversion'],
 ['pursuing','逐阵',{7:'丙午 戊午',1:'壬子 戊子'},'follow-month-aversion'],
 ['three-yin','三阴',{2:'辛酉',8:'乙卯'},'all-forbidden'],
 ['yang-error','阳错',{2:'甲寅',3:'乙卯',4:'甲辰',5:'丁巳 己巳',7:'丁未 己未',8:'庚申',9:'辛酉',10:'庚戌',11:'癸亥',1:'癸丑'},'follow-month-build'],
 ['yin-error','阴错',{2:'庚戌',3:'辛酉',4:'庚申',5:'丁未 己未',7:'丁巳 己巳',8:'甲辰',9:'乙卯',10:'甲寅',11:'癸丑',1:'癸亥'},'follow-month-aversion'],
 ['both-error','阴阳俱错',{6:'丙午',0:'壬子'},'all-forbidden'],
 ['extreme-yin','绝阴',{5:'戊辰'},'all-forbidden'],['extreme-yang','绝阳',{11:'戊戌'},'all-forbidden'],
];
export const SPECIAL_DAY_NAMES=Object.freeze(rows.map(r=>r[1]));
export function specialDayClauses({monthBranchIndex:m,dayCycle}){
 if(!Number.isInteger(m)||m<0||m>11||!dayCycle||!Number.isInteger(dayCycle.index)||dayCycle.index<0||dayCycle.index>59||dayCycle.stemIndex!==dayCycle.index%10||dayCycle.branchIndex!==dayCycle.index%12||dayCycle.name!==T[dayCycle.stemIndex]+B[dayCycle.branchIndex])throw new RangeError('特殊日上下文无效。');
 const name=dayCycle.name, out=[];
 for(const [id,title,table,effect] of rows)if((table[m]||'').split(' ').includes(name)){
  let e=effect;
  if(title==='阴错'&&([3,9].includes(m)||(m===7&&name==='丁巳')||(m===1&&name==='癸亥')))e='all-forbidden';
  if(title==='阳错'&&m===5&&name==='己巳')e='all-forbidden';
  const noRelief=(title==='岁薄'&&m===5&&name==='丙午')||(title==='逐阵'&&m===7&&name==='戊午')||(title==='阳错'&&m===7&&name==='己未')||(title==='阴错'&&m===7&&name==='己巳');
  out.push({ruleId:'jx10-special-'+id,name:title,effect:e,excludeVirtueRelief:noRelief,source:S,sourceSection:'月厌：阴阳会冲、岁薄逐阵及错绝专条',reason:'按本条月建 '+B[m]+' 与 '+name+' 命中；'+(noRelief?'本条不得据德合或天愿解除。':'')+'仅记录原典局部作用，未裁定全日。'});
 }
 return out;
}

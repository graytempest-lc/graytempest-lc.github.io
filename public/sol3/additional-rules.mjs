// Independent transcription from the public-domain Qing text, not a vendor table.
// Every hit is a direct clause. This does not establish complete daily Yi/Ji.
const B='子丑寅卯辰巳午未申酉戌亥',T='甲乙丙丁戊己庚辛壬癸';
const mod=(n,m)=>((n%m)+m)%m;
const words=s=>s?s.split(' '):[];
const url=(v,r)=>`https://zh.wikisource.org/w/index.php?title=欽定協紀辨方書_(四庫全書本)/卷${v}&oldid=${r}`;
export const ADDITIONAL_SOURCES=Object.freeze({vol3:url('03',787338),vol4:url('04',787340),vol5:url('05',787341),vol6:url('06',787343),vol10:url('10',787351)});
const S=ADDITIONAL_SOURCES;
const MILITARY='安撫邊境 選將訓兵 出師';
const GOODS='修倉庫 開市 立券交易 納財 開倉庫 出貨財';
const EARTH='營建宮室 修宮室 繕城郭 築堤防 興造動土 修倉庫 修置產室 開渠穿井 安碓磑 補垣 修飾垣牆 平治道塗 破屋壞垣 栽種 破土';
const THREE_SHA='祈福 求嗣 上冊進表章 頒詔 施恩封拜 詔命公卿 招賢 舉正直 宣布政事 慶賜賞賀 宴會 冠帶 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 安床 解除 整容剃頭 整手足甲 求醫療病 裁製 營建宮室 修宮室 繕城郭 築堤防 興造動土 豎柱上梁 修倉庫 鼓鑄 經絡 醞釀 開市 立券交易 納財 開倉庫 出貨財 修置產室 開渠穿井 安碓磑 補垣塞穴 修飾垣牆 破屋壞垣 栽種 牧養 納畜 破土 安葬 啟攢';
const GREAT_TIME='祈福 求嗣 上冊進表章 施恩封拜 詔命公卿 招賢 舉正直 冠帶 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 安床 解除 求醫療病 營建宮室 修宮室 繕城郭 築堤防 興造動土 豎柱上梁 修倉庫 開市 立券交易 納財 開倉庫 出貨財 修置產室 栽種 牧養 納畜';
const defs=[];
function def(id,name,volume,match,yi='',ji='',condition='',fixed=''){
  if(['往亡','四废','四忌'].includes(name))fixed=ji;
  defs.push({id,name,volume,match,yi,ji,condition,fixed});
}
// j = ordinal solar month, 0 = 寅. m = branch index, 0 = 子.
for(const [id,name,start,ji] of [
 ['rob','劫煞',11,THREE_SHA],['disaster','灾煞',0,THREE_SHA],['month-sha','月煞',1,THREE_SHA],
 ['great-time','大时',3,GREAT_TIME],['wandering','游祸',5,'祈福 求嗣 解除 求醫療病'],['heaven-officer','天吏',9,GREAT_TIME],
])def(id,name,6,c=>c.d===mod(start-3*c.j,12),'',ji,`正月${B[start]}，逆行四${[1].includes(start)?'季':[0,3,9].includes(start)?'仲':'孟'}；卷六本条`,name==='游祸'?ji:'');
def('heaven-fire','天火',6,c=>c.d===mod(-3*c.j,12),'','苫蓋','卷六按语纠正为与灾煞同位，逆行四仲');
def('month-empty','月虚',6,c=>c.d===mod(1-3*c.j,12),'','修倉庫 開倉庫 出貨財','与月煞同位；卷六、卷十');
def('month-punishment','月刑',3,c=>c.d===[3,10,5,0,4,8,6,1,2,9,7,11][c.m],'',THREE_SHA,'卷六月刑引卷三岁刑，逐支刑向；卷十忌同劫煞');
def('month-harm','月害',6,c=>c.d===mod(5-c.j,12),'','祈福 求嗣 上冊進表章 慶賜賞賀 宴會 安撫邊境 選將訓兵 出師 結婚姻 納采問名 嫁娶 進人口 求醫療病 修倉庫 經絡 醞釀 開市 立券交易 納財 開倉庫 出貨財 置產室 牧養 納畜 破土 安葬 啟攢','正月巳，逆行十二辰');
def('month-aversion','月厌',4,c=>c.d===mod(10-c.j,12),'',THREE_SHA+' 遠廻 平治道塗 伐木','正月戌，逆行十二辰；全部并神与日名特殊条另行审定');
def('earth-fire','地火',4,c=>c.d===mod(10-c.j,12),'','栽種 修築園圃','与月厌同位');
def('aversion-opposite','厌对',4,c=>c.d===mod(4-c.j,12),'','嫁娶','月厌对冲');
def('beckoning','招摇',4,c=>c.d===mod(4-c.j,12),'','取魚 乘船渡水','月厌对冲，与六仪同位');
def('six-ceremonies','六仪',4,c=>c.d===mod(4-c.j,12),'臨政親民','','月厌对冲');
def('salt-pool','咸池',6,c=>c.d===mod(3-3*c.j,12),'','取魚 乘船渡水','与大时同位');
def('death-qi','死气',4,c=>mod(c.d-c.m,12)===4,'',MILITARY+' 解除 求醫療病 修置產室 栽種','月建前四辰，与定日同位');
def('heaven-thief','天贼',6,c=>c.d===mod(1-c.j,12),'','行幸遣使 修倉庫 開倉庫 出貨財','正月丑，逆行十二辰','行幸遣使 修倉庫 開倉庫 出貨財');
def('four-strikes','四击',5,c=>c.d===[10,1,4,7][c.season],'',MILITARY,'春戌夏丑秋辰冬未',MILITARY);
def('four-losses','四耗',5,c=>c.name===['壬子','乙卯','戊午','辛酉'][c.season],'',MILITARY+' '+GOODS,'春壬子夏乙卯秋戊午冬辛酉',MILITARY);
def('four-wastes','四废',5,c=>[['庚申','辛酉'],['壬子','癸亥'],['甲寅','乙卯'],['丙午','丁巳']][c.season].includes(c.name),'',THREE_SHA.split(' ').filter(x=>!['整容剃頭','整手足甲','破屋壞垣'].includes(x)).join(' '),'春庚申辛酉、夏壬子癸亥、秋甲寅乙卯、冬丙午丁巳；遇德合犹忌');
def('four-taboos','四忌',5,c=>c.name===['甲子','丙子','庚子','壬子'][c.season],'',MILITARY+' 結婚姻 納采問名 嫁娶 安葬','春甲子夏丙子秋庚子冬壬子');
def('four-poverties','四穷',5,c=>c.name===['乙亥','丁亥','辛亥','癸亥'][c.season],'',MILITARY+' 結婚姻 納采問名 嫁娶 安葬 進人口 '+GOODS,'春乙亥夏丁亥秋辛亥冬癸亥');
def('five-voids','五虚',5,c=>['巳酉丑','申子辰','亥卯未','寅午戌'][c.season].includes(c.branch),'','修倉庫 開倉庫 出貨財','春巳酉丑夏申子辰秋亥卯未冬寅午戌');
def('five-tombs','五墓',5,c=>c.name===(c.j%3===2?'戊辰':['乙未','丙戌','辛丑','壬辰'][c.season]),'','冠帶 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 結婚姻 納采問名 嫁娶 進人口 般移 安床 解除 求醫療病 營建宮室 修宮室 繕城郭 興造動土 豎柱上梁 開市 立券交易 修置產室 栽種 牧養 納畜 破土 安葬 啟攢','四季月戊辰，其余春乙未夏丙戌秋辛丑冬壬辰');
def('nine-empty','九空',5,c=>c.d===mod(4-3*c.j,12),'','進人口 '+GOODS,'正月辰，逆行四季');
def('nine-pits','九坎',5,c=>c.d===[4,1,10,7,3,0,9,6,2,11,8,5][c.j],'','補垣塞穴 取魚 乘船渡水','正至四月逆行四季；五至八月逆行四仲；九至十二月逆行四孟','補垣塞穴 取魚 乘船渡水');
def('nine-scorches','九焦',5,c=>c.d===[4,1,10,7,3,0,9,6,2,11,8,5][c.j],'','鼓鑄 栽種 修築園圃','与九坎同位','鼓鑄 栽種 修築園圃');
def('earth-token','土符',6,c=>c.d===[1,5,9,2,6,10,3,7,11,4,8,0][c.j],'',EARTH,'正月至十二月：丑巳酉寅午戌卯未亥辰申子',EARTH);
const EARTH_BAG=[['庚子','庚午'],['乙未','癸丑'],['甲子','壬午'],['己卯','己酉'],['壬戌','甲辰'],['丙辰','丙戌'],['丁巳','丁亥'],['丙寅','丙申'],['辛丑','辛未'],['戊寅','戊申'],['辛卯','辛酉'],['癸酉','乙卯']];
def('earth-bag','地囊',6,c=>EARTH_BAG[c.j].includes(c.name),'',EARTH,'采用卷六按语校正表；不用前文旧历例误表',EARTH);
def('soldier-taboo','兵禁',6,c=>c.d===mod(2-2*c.j,12),'',MILITARY,'正月寅，逆行六阳辰',MILITARY);
def('great-sha','大煞',6,c=>c.d===[10,5,6,7,2,3,4,11,0,1,8,9][c.j],'',MILITARY,'正月至十二月：戌巳午未寅卯辰亥子丑申酉',MILITARY);
def('return-taboo','归忌',6,c=>c.d===[1,2,0][c.j%3],'','般移 遠廻','孟月丑、仲月寅、季月子；按语明确不忌嫁娶','般移 遠廻');
def('departing','往亡',6,c=>c.d===[2,5,8,11,3,6,9,0,4,7,10,1][c.j],'','上冊進表章 頒詔 詔命公卿 招賢 宣政事 行幸遣使 安撫邊境 選將訓兵 出師 上官赴任 臨政親民 嫁娶 進人口 般移 求醫療病 捕捉 畋獵 取魚','正月至十二月：寅巳申亥卯午酉子辰未戌丑');
def('five-unions','五合',5,c=>'寅卯'.includes(c.branch),'宴會 結婚姻 立券交易','','寅卯日；不额外加入嫁娶');
def('five-separations','五离',5,c=>'申酉'.includes(c.branch),'','慶賜賞賀 宴會 結婚姻 納采問名 立券交易','申酉日；不额外加入嫁娶');
def('removal-god','除神',5,c=>'申酉'.includes(c.branch),'解除 沐浴 整容剃頭 整手足甲 求醫療病 掃舍宇','','申酉日');
def('release-god','解神',5,c=>c.d===mod(8+2*Math.floor(c.j/2),12),'上表章 陳詞訟 解除 沐浴 整容剃頭 整手足甲 求醫療病','','正二月申，三四月戌，五六月子，七八月寅，九十月辰，十一十二月午');
def('repeated','复日',5,c=>c.stem==='甲乙戊丙丁己庚辛戊壬癸己'[c.j],'裁製','破土 安葬 啟攢','卷五按语：本月令星单干；不采前文正七甲庚等双干旧表');
def('double','重日',5,c=>'巳亥'.includes(c.branch),'','破土 安葬 啟攢','巳亥二支，不是仅己亥一干支；卷五解释与卷十');
def('eight-special','八专',5,c=>['丁未','己未','庚申','甲寅','癸丑'].includes(c.name),'',MILITARY+' 結婚姻 納采問名 嫁娶','八专实为丁未己未庚申甲寅癸丑五日',MILITARY);
def('water-dragon','触水龙',5,c=>['丙子','癸丑','癸未'].includes(c.name),'','取魚 乘船渡水','不论四时，丙子癸丑癸未三日','取魚 乘船渡水');
def('dedicated','专日',5,c=>['甲寅','乙卯','丁巳','丙午','庚申','辛酉','癸亥','壬子','戊辰','戊戌','己丑','己未'].includes(c.name),'',MILITARY,'卷五专日十二日，军事实忌；非诸事皆忌',MILITARY);
def('attacking','伐日',5,c=>['庚午','辛巳','丙子','戊寅','己卯','癸未','癸丑','甲申','乙酉','丁亥','壬辰','壬戌'].includes(c.name),'',MILITARY,'卷五伐日十二日',MILITARY);
def('month-space','月空',5,c=>c.stem==='壬庚丙甲'[c.j%4],'上表章','','寅午戌壬，亥卯未庚，申子辰丙，巳酉丑甲');
def('approaching','临日',6,c=>mod(c.d-c.m,12)===(c.m%2===0?4:8),'上冊進表章 上官赴任 臨政親民 陳詞訟','','阳月定、阴月成；十二月丑为阴月，其成日在酉，与原表一致');
def('horse','驿马',6,c=>c.d===mod(8-3*c.j,12),'行幸遣使 般移','','正月申，逆行四孟');
def('heaven-empress','天后',6,c=>c.d===mod(8-3*c.j,12),'求醫療病','','与驿马同位');
def('heaven-horse','天马',6,c=>c.d===mod(6+2*c.j,12),'行幸遣使 般移','','正月午，顺行六阳辰');
def('soldier-good','兵吉',6,c=>mod(c.d+c.j,12)<4,MILITARY,'','正月子丑寅卯，逐月退一辰');
def('five-rich','五富',6,c=>c.d===mod(11+3*c.j,12),'經絡 醞釀 開市 立券交易 納財 開倉庫 出貨財 栽種 牧養 納畜','','正月亥顺行四孟；逆行说仅附存，不混用');
def('heaven-store','天仓',6,c=>c.d===mod(2-c.j,12),'進人口 納財 納畜','','正月寅，逆行十二辰');
for(const [id,name,start,yi] of [
 ['need-peace','要安',2,'安神'],['jade-house','玉宇',3,'修祠宇'],['gold-hall','金堂',4,'修祠宇'],
 ['respect-peace','敬安',7,'安神'],['universal-care','普护',8,'祭祀 祈福'],['blessing','福生',9,'祭祀 祈福'],
 ['sacred-heart','圣心',11,'祭祀 祈福'],['benefit-heirs','益后',0,'祭祀 祈福 求嗣'],['continue','续世',1,'祭祀 祈福 求嗣'],
])def(id,name,6,c=>c.d===mod(start+Math.floor(c.j/2)+(c.j%2)*6,12),yi,'','卷六九神逐月起例；按语限定祈禳，不沿用旧文扩大为一般修造');
def('yang-virtue','阳德',6,c=>c.d===mod(10+2*c.j,12),'施恩惠 恤孤惸 行惠愛 雪冤枉 緩刑獄','','正月戌，顺行六阳辰');
def('yin-virtue','阴德',6,c=>c.d===mod(9-2*c.j,12),'施恩惠 恤孤惸 行惠愛 雪冤枉 緩刑獄','','正月酉，逆行六阴辰');
// Explicit same-officer aliases add their own activities instead of silently
// importing all historical aliases, several of which the editors rejected.
for(const [id,name,officer,yi,ji] of [
 ['soldier-blessing','兵福','建',MILITARY,''],['good-period','吉期','除','施恩封拜 舉正直 行幸遣使 上官赴任 臨政親民',''],
 ['soldier-treasure','兵宝','除',MILITARY,''],['heaven-shaman','天巫','满','祭祀 祈福',''],
 ['blessing-virtue','福德','满','上冊進表章 慶賜賞賀 宴會 修宮室 繕城郭',''],['time-yin','时阴','定','運謀算畫計策',''],
 ['heaven-joy','天喜','成','施恩封拜 舉正直 慶賜賞賀 宴會 行幸遣使 上官赴任 臨政親民 結婚姻 納采問名 嫁娶',''],
 ['heaven-doctor','天医','成','求醫療病',''],['blood-branch','血支','闭','','針刺'],
])def(id,name,4,c=>c.officer===officer,yi,ji,'卷四起例、卷十明确“又为”直条，按本版校正建除位置',ji);

export const ADDITIONAL_RULE_CATALOG=Object.freeze(defs.map(x=>Object.freeze({ruleId:'jx-add-'+x.id,name:x.name,
  condition:x.condition,conditionSource:S['vol'+x.volume],source:S.vol10,sourceSection:x.name,
  coverage:'direct-clause-only',directYi:Object.freeze(words(x.yi)),directJi:Object.freeze(words(x.ji)),
  invariantJi:Object.freeze(words(x.fixed))})));
export function collectAdditionalRules({monthBranchIndex:m,dayCycle,officer}){
  if(!Number.isInteger(m)||m<0||m>11||!dayCycle||!Number.isInteger(dayCycle.index)||dayCycle.index<0||dayCycle.index>59||dayCycle.stemIndex!==dayCycle.index%10||dayCycle.branchIndex!==dayCycle.index%12||dayCycle.name!==T[dayCycle.stemIndex]+B[dayCycle.branchIndex])throw new RangeError('新增规则的干支/月建上下文无效。');
  const expected=['建','除','满','平','定','执','破','危','成','收','开','闭'][mod(dayCycle.branchIndex-m,12)];
  if(officer!==expected)throw new RangeError('新增规则值日不一致。');
  const j=mod(m-2,12), c={m,j,d:dayCycle.branchIndex,stem:T[dayCycle.stemIndex],branch:B[dayCycle.branchIndex],name:dayCycle.name,season:Math.floor(j/3),officer};
  return defs.flatMap((x,i)=>x.match(c)?[{...ADDITIONAL_RULE_CATALOG[i],directYi:words(x.yi),directJi:words(x.ji),invariantJi:words(x.fixed)}]:[]);
}

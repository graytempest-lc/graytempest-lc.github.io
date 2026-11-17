// Dates transcribed as factual government schedule; do not label all rest days statutory holidays.
export const holidaySource = Object.freeze({year:2026,region:'中国大陆',title:'国务院办公厅关于2026年部分节假日安排的通知',document:'国办发明电〔2025〕7号',url:'https://www.beijing.gov.cn/zhengce/zhengcefagui/202511/t20251104_4258873.html',published:'2025-11-04'});
export const holidaySource2027=Object.freeze({year:2027,region:'中国大陆',title:'国务院办公厅关于2027年部分节假日安排的通知',document:'国办发明电〔2026〕10号',url:'https://www.shache.gov.cn/scx/c118335/202611/6dbd74b2ceba40f886c7decc9a81e527.shtml',published:'2026-11-05'});
export function holidaySourceFor(date){return date.startsWith('2027-')?holidaySource2027:holidaySource;}
export const holidayPeriods = Object.freeze([
 ['元旦','2027-01-01','2027-01-03'],['春节','2027-02-05','2027-02-13'],
 ['清明节','2027-04-03','2027-04-05'],['劳动节','2027-05-01','2027-05-05'],
 ['端午节','2027-06-09','2027-06-09'],['中秋节','2027-09-15','2027-09-15'],
 ['国庆节','2027-10-01','2027-10-07'],
 ['元旦','2026-01-01','2026-01-03'],['春节','2026-02-15','2026-02-23'],
 ['清明节','2026-04-04','2026-04-06'],['劳动节','2026-05-01','2026-05-05'],
 ['端午节','2026-06-19','2026-06-21'],['中秋节','2026-09-25','2026-09-27'],
 ['国庆节','2026-10-01','2026-10-07']
].map(Object.freeze));
export const adjustedWorkdays = Object.freeze({'2027-01-31':'春节','2027-02-14':'春节','2027-05-08':'劳动节','2027-09-26':'国庆节','2027-10-09':'国庆节','2026-01-04':'元旦','2026-02-14':'春节','2026-02-28':'春节','2026-05-09':'劳动节','2026-09-20':'国庆节','2026-10-10':'国庆节'});
export function holidayFor(date){
 if(!/^202[67]-\d{2}-\d{2}$/.test(date))return null;
 if(adjustedWorkdays[date])return {kind:'work',name:adjustedWorkdays[date],label:adjustedWorkdays[date]+'调休上班'};
 const p=holidayPeriods.find(([,start,end])=>date>=start&&date<=end);
 return p?{kind:'rest',name:p[0],label:p[0]+'放假'}:null;
}

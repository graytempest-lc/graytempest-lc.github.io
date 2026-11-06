import {SearchMoonQuarter,NextMoonQuarter} from './vendor/astronomy.mjs';
import {utc8Timestamp} from './solar-terms.mjs';
const NAMES=Object.freeze(['朔','上弦','望','下弦']);let cache;
export function calculateLunarPhases2026(){
 if(cache)return cache;const out=[];let q=SearchMoonQuarter(new Date('2026-01-01T00:00:00+08:00'));
 for(let guard=0;guard<55;guard++){
  const instantUtc=q.time.date.toISOString(),timestampUtc8=utc8Timestamp(instantUtc),civilDate=timestampUtc8.slice(0,10);
  if(civilDate>'2026-12-31')break;
  if(civilDate<'2026-01-01'||!Number.isInteger(q.quarter)||q.quarter<0||q.quarter>3)throw new Error('Invalid lunar phase root.');
  out.push(Object.freeze({quarter:q.quarter,name:NAMES[q.quarter],instantUtc,timestampUtc8,civilDate,
   status:'model-estimate',exact:false,dateConvention:'00:00 UTC+08:00',model:'Astronomy Engine 2.1.19 / MIT',
   validation:'2026 UTC+8 civil dates independently compared with all 50 HKO phase dates; no proven timing error bound'}));
  q=NextMoonQuarter(q);
 }
 if(out.length!==50)throw new Error('Unexpected count for independently validated 2026 lunar phases.');
 cache=Object.freeze(out);return cache;
}

import fs from 'node:fs';
import {parseCivilDate} from '../public/sol3/date-contract.mjs';
const files=fs.readdirSync('content/editions').filter(f=>f.endsWith('.json')).sort();
const issues=files.map(f=>{const x=JSON.parse(fs.readFileSync('content/editions/'+f));if(f!==x.editionDate+'.json'||x.id!==x.editionDate)throw Error('Filename/date mismatch: '+f);parseCivilDate(x.editionDate);return x;}).filter(x=>x.status==='published');
if(!issues.length)throw Error('No published editions');
const news={};
for(const x of issues){
 const ids=new Set();
 for(const item of x.items){
  if(ids.has(item.id))throw Error('Duplicate article ID: '+x.id+'#'+item.id);ids.add(item.id);
  if(item.titleId!==item.id+'-title')throw Error('Title ID mismatch');parseCivilDate(item.sourceDate);
  for(const src of item.sources){const u=new URL(src.url);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Unsafe source link');}
 }
 for(const item of x.overview)if(!ids.has(item.id))throw Error('Broken overview: '+x.id);
 news[x.editionDate]={dateBasis:'edition-publication-date',href:x.editionDate+'.html',items:x.items.slice(0,3).map(i=>({title:i.title,summary:i.paragraphs.slice(0,2).map(p=>p.text).join(' '),href:x.editionDate+'.html#'+i.id}))};
}
fs.writeFileSync('public/sol3/news-data.mjs','// Generated from content/editions; publication date is not event date.\nexport const newsByDate = '+JSON.stringify(news)+';\n');
const p='public/sol3/calendar-data.mjs';const data=fs.readFileSync(p,'utf8');
if(!/export const editions = \[[^\]]*\];/.test(data))throw Error('Calendar edition contract changed');
fs.writeFileSync(p,data.replace(/export const editions = \[[^\]]*\];/,`export const editions = ${JSON.stringify(issues.map(i=>i.editionDate))};`));
console.log(`Prepared ${issues.length} editions, ${issues.reduce((n,i)=>n+i.items.length,0)} articles; latest ${issues.at(-1).editionDate}.`);

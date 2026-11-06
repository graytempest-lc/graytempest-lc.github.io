// Regenerate the homepage calendar after adding an edition. No network or dependencies.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=process.argv[2]?path.resolve(process.argv[2]):path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const files=fs.readdirSync(root).filter(f=>/^\d{4}-\d{2}-\d{2}\.html$/.test(f)).sort();
if(!files.length)throw Error('No dated editions found');
const entity=s=>s.replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[n]);
const plain=s=>entity(s.replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();
const news={};
for(const f of files){
 const content=fs.readFileSync(path.join(root,f),'utf8'),items=[];
 for(const [,attrs,a] of [...content.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)].slice(0,3)){
  const id=attrs.match(/\bid="([^"]+)"/)?.[1],h=a.match(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/)?.[1];
  const ps=[...a.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].slice(0,2).map(m=>plain(m[1]));
  if(!id||!h||!ps.length)throw Error(`Unsupported article markup in ${f}`);
  items.push({title:plain(h),summary:ps.join(' '),href:f+'#'+id});
 }
 if(!items.length)throw Error(`No public articles in ${f}`);
 news[f.slice(0,10)]={dateBasis:'edition-publication-date',href:f,items};
}
fs.writeFileSync(path.join(root,'sol3/news-data.mjs'),'// Generated from existing public editions; publication date is not event date.\nexport const newsByDate = '+JSON.stringify(news)+';\n');
const data=path.join(root,'sol3/calendar-data.mjs');
fs.writeFileSync(data,fs.readFileSync(data,'utf8').replace(/export const editions = \[[^\]]*\];/,`export const editions = ${JSON.stringify(files.map(f=>f.slice(0,10)))};`));
const {renderCalendar}=await import(pathToFileURL(path.join(root,'sol3/month-render.mjs')));
const supported=files.map(f=>f.slice(0,10)).filter(d=>d>='2026-01-01'&&d<='2026-12-31');
const selected=supported.at(-1)||'2026-01-01';
const {calculateDay}=await import(pathToFileURL(path.join(root,'sol3/almanac.mjs')));
let page=fs.readFileSync(path.join(root,files.at(-1)),'utf8');
if(page.includes('id="sol3-calendar"'))throw Error('Dated archive must not contain the homepage calendar');
const oldMenuStart=page.indexOf('<details class="archive-menu">');
if(oldMenuStart!==-1){
 const tokens=page.slice(oldMenuStart).matchAll(/<\/?details\b[^>]*>/g);let depth=0,end=-1;
 for(const t of tokens){depth+=t[0].startsWith('</')?-1:1;if(depth===0){end=oldMenuStart+t.index+t[0].length;break;}}
 if(end===-1)throw Error('Unclosed archive navigation');
 page=page.slice(0,oldMenuStart)+page.slice(end);
}
page=page.replace('</head>','<link rel="stylesheet" href="sol3/month.css?v=2"></head>');
page=page.replace(/<title>[\s\S]*?<\/title>/,'<title>L星团快讯 · Sol3 本土日历与计算机快讯</title>');
page=page.replace('<main ',renderCalendar(selected,null,calculateDay(selected))+'\n<main ');
if(!page.includes('data-build="sol3-month-2026-v2"'))throw Error('Homepage insert failed');
page=page.replace('</body>','<script type="module" src="sol3/month-ui.mjs?v=2"></script></body>');
fs.writeFileSync(path.join(root,'index.html'),page);
console.log(`Built homepage from ${files.at(-1)}; preserved ${files.length} dated editions.`);

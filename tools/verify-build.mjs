import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {analyzeLegacyEdition,all,attr,tag,clean} from './html-analysis.mjs';
const source=fs.readdirSync('content/editions').filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(fs.readFileSync('content/editions/'+f))).filter(i=>i.status==='published');
export const fingerprint=i=>createHash('sha256').update(JSON.stringify({id:i.id,title:i.title,description:i.description,editionLabel:i.editionLabel,introduction:i.introduction,overview:i.overview,items:i.items})).digest('hex');
const manifest=JSON.parse(fs.readFileSync('tests/migration-manifest.json'));
let articles=0,sources=0;
for(const issue of source){
 const html=fs.readFileSync(`dist/${issue.editionDate}.html`,'utf8'),actual=analyzeLegacyEdition(html,issue.editionDate);
 assert.deepEqual(actual.items,issue.items,'Article content/source/anchor drift in '+issue.id);
 assert.deepEqual(actual.overview,issue.overview,'Overview drift');assert.deepEqual(actual.introduction,issue.introduction,'Introduction drift');
 assert.equal(actual.title,issue.title);assert.equal(actual.description,issue.description);assert.equal(actual.editionLabel,issue.editionLabel);
 if(manifest[issue.id])assert.equal(fingerprint(actual),manifest[issue.id].sha256,'Historical content differs from reviewed migration baseline: '+issue.id);
 articles+=actual.items.length;sources+=actual.items.reduce((n,i)=>n+i.sources.length,0);
}
const homepage=fs.readFileSync('dist/index.html','utf8'),latest=source.at(-1);
assert.deepEqual(analyzeLegacyEdition(homepage,latest.id).items,latest.items,'Homepage differs from latest edition');
assert.ok(homepage.includes('data-build="sol3-month-2026-v3"'),'Repaired calendar missing');
assert.ok(homepage.includes('home-almanac'),'Inline almanac missing');
assert.ok(!homepage.includes('class="archive-menu"'),'Removed homepage calendar menu returned');
assert.ok(homepage.includes('RSS 视窗'));
const docCache=new Map();
function htmlDoc(file){if(!docCache.has(file))docCache.set(file,parse(fs.readFileSync(file,'utf8')));return docCache.get(file);}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
let links=0;
for(const file of walk('dist').filter(f=>f.endsWith('.html'))){
 const doc=htmlDoc(file),ids=all(doc,n=>attr(n,'id')).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length,'Duplicate DOM IDs in '+file);
 for(const n of all(doc,n=>n?.tagName)){
  for(const key of ['aria-labelledby','aria-describedby'])for(const id of (attr(n,key)||'').split(/\s+/).filter(Boolean))assert.ok(ids.includes(id),`Broken ${key} ${id} in ${file}`);
  for(const key of ['href','src']){const raw=attr(n,key);if(!raw||/^(?:https?:|mailto:|data:|tel:)/i.test(raw))continue;
   assert.ok(!/^[a-z]+:/i.test(raw),'Unsafe local link');const u=new URL(raw,'https://local.invalid/'+file.slice(5));
   let dest=path.join('dist',decodeURIComponent(u.pathname));if(u.pathname.endsWith('/'))dest=path.join(dest,'index.html');
   assert.ok(fs.existsSync(dest),`Broken local ${raw} in ${file}`);
   if(u.hash&&dest.endsWith('.html')){const target=decodeURIComponent(u.hash.slice(1));assert.ok(all(htmlDoc(dest),n=>attr(n,'id')===target).length,`Broken anchor ${raw} in ${file}`);}links++;
  }
 }
}
const rss=fs.readFileSync('dist/rss.xml','utf8');for(const i of source)assert.ok(rss.includes(i.id+'.html'));
assert.equal((rss.match(/<item>/g)||[]).length,source.length,'RSS issue count');
assert.ok(!walk('dist').some(f=>f.includes('node_modules')||f.endsWith('.json')&&f.includes('feeds-cache')||f.endsWith('go.xml')),'Private/build input leaked into output');
console.log(JSON.stringify({editions:source.length,articles,sourceLinks:sources,checkedLocalLinks:links,historyFingerprints:'all matched',homepage:'latest and inline almanac preserved',rssItems:source.length},null,2));

// Public ESM dependencies must share one content revision. Versioning only the
// entry point leaves old cached exports/data underneath the new entry point.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'es-module-lexer';
function rewriteImports(source,revision=null){
 const imports=parse(source)[0].filter(i=>i.specifier&&!i.glob&&/^\.{1,2}\/[^?'"\s]+\.mjs(?:\?v=[^?'"\s]+)?$/.test(i.specifier));
 for(const i of imports.sort((a,b)=>b.start-a.start)){
  const file=i.specifier.replace(/\?v=.*$/,''),value=file+(revision?'?v='+revision:'');
  source=source.slice(0,i.start)+(i.type==='dynamic'?JSON.stringify(value):value)+source.slice(i.end);
 }
 return source;
}
const canonical=source=>rewriteImports(source);
export function versionCalendarModules(){
 const dir='public/sol3';
 const files=fs.readdirSync(dir).filter(f=>f.endsWith('.mjs')).sort();
 const sources=files.map(file=>[file,canonical(fs.readFileSync(path.join(dir,file),'utf8'))]);
 // Include the vendored engine in the revision without modifying its licensed source.
 const vendor=fs.readFileSync(path.join(dir,'vendor/astronomy.mjs'));
 const revision=createHash('sha256').update(JSON.stringify(sources)).update(vendor).digest('hex').slice(0,16);
 for(const [file,source] of sources){
  fs.writeFileSync(path.join(dir,file),rewriteImports(source,revision));
 }
 for(const [file,entry] of [['src/pages/index.astro','month-ui.mjs'],['public/almanac.html','ui.mjs']]){
  const source=fs.readFileSync(file,'utf8'),pattern=new RegExp(`(sol3/${entry.replace('.','\\.')})(?:\\?v=[^"']*)?`, 'g');
  fs.writeFileSync(file,source.replace(pattern,`$1?v=${revision}`));
 }
 return revision;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {versionCalendarModules} from '../tools/version-calendar.mjs';
test('Calendar cache revision covers the entry, transitive imports and daily data, and is idempotent',()=>{
 const previous=process.cwd(),dir=fs.mkdtempSync(path.join(os.tmpdir(),'sol3-cache-test-'));
 try{
  process.chdir(dir);fs.mkdirSync('public/sol3/vendor',{recursive:true});fs.mkdirSync('src/pages',{recursive:true});
  fs.writeFileSync('public/sol3/vendor/astronomy.mjs','export const model=1;');
  fs.writeFileSync('public/sol3/month-ui.mjs',"import {render} from './month-render.mjs?v=old'; import('./almanac.mjs?v=old');\n");
  fs.writeFileSync('public/sol3/month-render.mjs',"import {data} from './news-data.mjs'; export const render=data;\n");
  const example=`export const data = {summary: \"示例 from './demo.mjs' 和 import('./other.mjs')\"};\n`;
  fs.writeFileSync('public/sol3/news-data.mjs',example);
  fs.writeFileSync('public/sol3/almanac.mjs',"import {model} from './vendor/astronomy.mjs';\n");
  fs.writeFileSync('src/pages/index.astro','<script src="/sol3/month-ui.mjs?v=old"></script>');
  fs.writeFileSync('public/almanac.html','<script src="sol3/ui.mjs?v=old"></script>');
  const first=versionCalendarModules();assert.match(first,/^[a-f0-9]{16}$/);assert.equal(versionCalendarModules(),first);
  assert.equal(fs.readFileSync('public/sol3/news-data.mjs','utf8'),example,'News prose and code examples must not be rewritten');
  for(const file of ['public/sol3/month-ui.mjs','public/sol3/month-render.mjs','public/sol3/almanac.mjs','src/pages/index.astro','public/almanac.html']){
   const content=fs.readFileSync(file,'utf8');assert.ok(content.includes('?v='+first),file);assert.ok(!content.includes('?v=old'),file);
  }
  fs.writeFileSync('public/sol3/news-data.mjs','export const data=2;\n');
  const second=versionCalendarModules();assert.notEqual(second,first);assert.equal(versionCalendarModules(),second);
  assert.ok(fs.readFileSync('public/sol3/month-render.mjs','utf8').includes('?v='+second));
 }finally{process.chdir(previous);fs.rmSync(dir,{recursive:true,force:true});}
});

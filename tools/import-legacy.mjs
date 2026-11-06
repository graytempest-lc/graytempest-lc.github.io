// Explicit one-off import, never scrape rendered HTML during a normal build.
import fs from 'node:fs';
import path from 'node:path';
import {analyzeLegacyEdition} from './html-analysis.mjs';
const source=process.argv[2];
if(!source)throw Error('Usage: node tools/import-legacy.mjs <HTML file or directory> [--replace]');
const target=path.resolve('content/editions');fs.mkdirSync(target,{recursive:true});
const files=fs.statSync(source).isDirectory()?fs.readdirSync(source).filter(f=>/^\d{4}-\d{2}-\d{2}\.html$/.test(f)).map(f=>path.join(source,f)):[source];
for(const file of files){
 const date=path.basename(file,'.html');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Dated filename required');
 const out=path.join(target,date+'.json');if(fs.existsSync(out)&&!process.argv.includes('--replace'))throw Error('Existing source will not be overwritten: '+out);
 const issue=analyzeLegacyEdition(fs.readFileSync(file,'utf8'),date);fs.writeFileSync(out,JSON.stringify(issue,null,2)+'\n');
 console.log('Imported',date,issue.items.length,'articles');
}

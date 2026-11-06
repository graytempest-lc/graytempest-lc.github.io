import fs from 'node:fs';
import {fetchFeed} from './feed-core.mjs';
const sources=JSON.parse(fs.readFileSync('data/feed-sources.json'));
const file='data/feeds-cache.json',old=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{};
const now=new Date().toISOString(),results=await Promise.all(sources.map(async source=>[source.id,await fetchFeed(source,old[source.id],now)]));
const next=Object.fromEntries(results);fs.writeFileSync(file+'.tmp',JSON.stringify(next,null,2)+'\n');fs.renameSync(file+'.tmp',file);
for(const [id,result] of results)console.log(id,result.status,result.items.length,'items; last successful fetch',result.lastSuccessAt,result.error||'');
// Feed failure must not block publication of verified local editions.

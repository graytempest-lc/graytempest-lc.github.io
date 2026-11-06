import {XMLParser,XMLValidator} from 'fast-xml-parser';
import {parseFragment} from 'parse5';
const MAX_BYTES=3*1024*1024;
export function plain(value,max=300){
 const raw=typeof value==='object'?value?.['#text']||'':String(value??'');
 const node=parseFragment(raw);
 const visit=n=>['script','style','iframe','object','template'].includes(n.tagName)?'':n.nodeName==='#text'?n.value:(n.childNodes||[]).map(visit).join('');
 return visit(node).replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
}
export function safeUrl(value,base){
 try{const u=new URL(String(value??''),base);if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port)return null;const h=u.hostname.toLowerCase();if(h==='localhost'||h.endsWith('.localhost')||h.endsWith('.local')||h.endsWith('.internal')||h==='[::1]'||h.includes(':')||/^\d+(?:\.\d+){0,3}$/.test(h))return null;return u.href;}catch{return null;}
}
export function feedRequestUrl(value,source){const u=safeUrl(value);if(!u||!u.startsWith('https:')||!source.allowedHosts.includes(new URL(u).hostname))throw Error('Feed redirect outside approved HTTPS hosts');return u;}
const array=x=>x==null?[]:Array.isArray(x)?x:[x];
function dateInfo(raw){const text=plain(raw,100);if(!text)return {publishedAt:null,dateOriginal:null};const explicitZone=/(?:Z|[+-]\d{2}:?\d{2}|GMT|UTC)\s*$/i.test(text);const time=explicitZone?Date.parse(text):NaN;return {publishedAt:Number.isFinite(time)?new Date(time).toISOString():null,dateOriginal:text};}
export function parseFeed(xml,source){
 if(Buffer.byteLength(xml)>MAX_BYTES)throw Error('Feed exceeds 3 MiB');
 if(/<!\s*(DOCTYPE|ENTITY)\b/i.test(xml))throw Error('DTD and entities are not allowed');
 // Bound nesting and token count before the XML parser handles remote data.
 let depth=0,count=0;
 for(const token of xml.matchAll(/<\/?[A-Za-z_][^>]*>/g)){const t=token[0];if(++count>100000)throw Error('Too many XML nodes');if(t.startsWith('</'))depth--;else if(!t.endsWith('/>'))depth++;if(depth>40)throw Error('XML nesting exceeds limit');}
 const valid=XMLValidator.validate(xml);if(valid!==true)throw Error('Invalid XML');
 const doc=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_',processEntities:false,parseTagValue:false,trimValues:true}).parse(xml);
 const atom=!!doc.feed,entries=atom?array(doc.feed.entry):array(doc.rss?.channel?.item);
 if(!entries.length)throw Error('No RSS/Atom items');
 const seen=new Set(),items=[];
 for(const e of entries.slice(0,100)){
  const title=plain(e.title);const rawLink=atom?array(e.link).find(l=>typeof l==='object'&&(!l['@_rel']||l['@_rel']==='alternate'))?.['@_href']:e.link;
  const linkText=plain(rawLink,2048);if(!linkText)continue;
  const url=safeUrl(linkText,source.url);if(!title||!url||seen.has(url))continue;
  if(!source.allowedHosts.includes(new URL(url).hostname))continue;
  seen.add(url);const date=dateInfo(atom?(e.published||e.updated):e.pubDate);
  const author=plain(atom?array(e.author).map(a=>plain(a.name||a,250)).join(', '):(e['dc:creator']||e.author),500);
  items.push({title,url,...date,author:author||null});if(items.length===5)break;
 }
 if(!items.length)throw Error('No safe feed items');return items;
}
export async function fetchFeed(source,previous,now=new Date().toISOString(),fetcher=fetch){
 const headers={'Accept':'application/atom+xml,application/rss+xml,application/xml,text/xml','User-Agent':'LClusterDispatchRSS/1.0 (+https://graytempest-lc.github.io/feeds.html)'};
 if(previous?.etag)headers['If-None-Match']=previous.etag;
 if(previous?.lastModified)headers['If-Modified-Since']=previous.lastModified;
 try{
  let url=feedRequestUrl(source.feed,source),response;
  for(let redirects=0;redirects<=3;redirects++){
   response=await fetcher(url,{headers,redirect:'manual',signal:AbortSignal.timeout(15000)});
   if([301,302,303,307,308].includes(response.status)){const target=response.headers.get('location');if(!target||redirects===3)throw Error('Too many feed redirects');url=feedRequestUrl(new URL(target,url).href,source);continue;}break;
  }
  if(response.status===304&&previous?.items?.length)return {...previous,lastAttemptAt:now,lastSuccessAt:now,status:'ok',error:null};
  if(!response.ok)throw Error('HTTP '+response.status);
  if(Number(response.headers.get('content-length'))>MAX_BYTES)throw Error('Feed exceeds 3 MiB');
  const reader=response.body.getReader();let size=0;const chunks=[];
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BYTES)throw Error('Feed exceeds 3 MiB');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
  const items=parseFeed(Buffer.concat(chunks).toString('utf8'),source);
  return {status:'ok',lastAttemptAt:now,lastSuccessAt:now,etag:response.headers.get('etag'),lastModified:response.headers.get('last-modified'),items,error:null};
 }catch(error){return {...previous,status:'unavailable',lastAttemptAt:now,lastSuccessAt:previous?.lastSuccessAt||null,items:previous?.items||[],error:String(error.message).slice(0,160)};}
}
export function visibleItems(cache,now=Date.now()){const age=now-Date.parse(cache?.lastSuccessAt||'');return Number.isFinite(age)&&age>=-86400000&&age<=7*86400000?cache.items||[]:[];}

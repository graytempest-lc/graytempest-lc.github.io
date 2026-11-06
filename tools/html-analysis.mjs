import {parse} from 'parse5';
export const attr=(n,k)=>n?.attrs?.find(a=>a.name===k)?.value;
export const children=n=>(n?.childNodes||[]).filter(n=>n.tagName);
export const all=(n,p)=>[...(p(n)?[n]:[]),...(n?.childNodes||[]).flatMap(c=>all(c,p))];
export const first=(n,p)=>all(n,p)[0];
export const tag=(n,t)=>first(n,n=>n?.tagName===t);
export const cls=(n,c)=>first(n,n=>(attr(n,'class')||'').split(' ').includes(c));
export const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes||[]).map(text).join('');
export const clean=n=>text(n).trim();
export function analyzeLegacyEdition(html,date){
  const doc=parse(html),main=tag(doc,'main');
  if(!main)throw Error('No main in '+date);
  const articles=all(main,n=>n.tagName==='article');
  const overview=children(tag(cls(articles[0],'issue-index'),'ul')).map(li=>({id:attr(tag(li,'a'),'href')?.slice(1),title:clean(tag(li,'a')),category:clean(tag(li,'span'))}));
  const items=articles.map(a=>{
    const body=cls(a,'lead-copy')||cls(a,'brief-body'),heading=tag(body,'h2'),byline=cls(body,'byline');
    if(!body||!heading||!byline)throw Error('Unsupported article in '+date);
    const paras=children(body).filter(n=>n.tagName==='p');
    for(const p of paras)if(children(p).length)throw Error('Inline HTML requires explicit migration: '+date);
    return {id:attr(a,'id'),title:clean(heading),titleId:attr(heading,'id'),
      paragraphs:paras.map(p=>({text:clean(p),variant:attr(p,'class')||''})),
      sourceDate:attr(tag(byline,'time'),'datetime'),dateLabel:clean(tag(byline,'time')),
      eventDate:null,sourcePublishedAt:null,
      sources:children(byline).filter(n=>n.tagName==='a').map(n=>({label:clean(n),url:attr(n,'href'),icon:!!tag(n,'svg')}))};
  });
  const header=tag(doc,'header');
  return {id:date,editionDate:date,status:'published',title:clean(tag(doc,'title')),
    description:attr(first(doc,n=>n.tagName==='meta'&&attr(n,'name')==='description'),'content'),
    editionLabel:clean(tag(header,'time')),dateBasis:'edition-publication-date',
    legacyDateNote:'sourceDate and dateLabel preserve the original displayed date; eventDate/sourcePublishedAt were not inferred.',
    introduction:children(main).filter(n=>n.tagName==='p').map(n=>clean(n)),overview,items};
}

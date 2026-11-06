import {getCollection} from 'astro:content';
export async function publishedEditions(){return (await getCollection('editions')).filter(e=>e.data.status==='published').sort((a,b)=>a.data.editionDate.localeCompare(b.data.editionDate));}
export const issueUrl=(date:string)=>`/${date}.html`;
export const shortDate=(date:string)=>`${Number(date.slice(5,7))}月${Number(date.slice(8,10))}日`;

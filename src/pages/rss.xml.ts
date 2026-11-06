import rss from '@astrojs/rss';
import {publishedEditions,issueUrl} from '../lib/editions';
export async function GET(context){const issues=await publishedEditions();return rss({title:'L星团快讯',description:'科技、开发与本地 AI 简报。按东八区刊载日发布；订阅时间归一为刊载日零点。',site:context.site,items:issues.slice().reverse().map(({data:i})=>({title:i.title,description:i.description,link:issueUrl(i.editionDate),pubDate:new Date(i.editionDate+'T00:00:00+08:00')})),customData:'<language>zh-CN</language>'});}

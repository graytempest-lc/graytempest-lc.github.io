import {lunar2026,terms2026} from './calendar-data.mjs?v=1f1ae4ac7dab4dd1';
import {lunar2027,terms2027} from './calendar-2027.mjs?v=1f1ae4ac7dab4dd1';
export function lunarFor(date){return date.startsWith('2026-')?lunar2026[date]:lunar2027[date];}
export function termFor(date){return (date.startsWith('2026-')?terms2026:terms2027)[date]??null;}

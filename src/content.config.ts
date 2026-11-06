import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';
const civil=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const editions=defineCollection({
 loader:glob({pattern:'*.json',base:'./content/editions'}),
 schema:z.object({
  id:civil,editionDate:civil,status:z.enum(['draft','published']),title:z.string().min(1),description:z.string().min(1),
  editionLabel:z.string(),dateBasis:z.literal('edition-publication-date'),legacyDateNote:z.string().optional(),
  introduction:z.array(z.string()),overview:z.array(z.object({id:z.string(),title:z.string(),category:z.string()})),
  items:z.array(z.object({id:z.string().regex(/^[a-z0-9][a-z0-9-]*$/),title:z.string().min(1),titleId:z.string(),
    paragraphs:z.array(z.object({text:z.string().min(1),variant:z.enum(['','dek','takeaway'])})).min(1),
    sourceDate:civil,dateLabel:z.string(),eventDate:civil.nullable(),sourcePublishedAt:z.string().nullable(),
    sources:z.array(z.object({label:z.string().min(1),url:z.url(),icon:z.boolean()})).min(1)
  })).min(1)
 })
});
export const collections={editions};

import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const noMiddleDot = (field: string) =>
  z.string().refine((val) => !/[·•ㆍ・]/.test(val), {
    message: `Middle dot (·) is not allowed in ${field}. Use standard conjunctions or commas instead.`,
  });

const baseSchema = z.object({
  title: noMiddleDot('title'),
  description: noMiddleDot('description'),
  date: z.coerce.date(),
  draft: z.boolean().default(false),
  thumbnail: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects', deferRender: true }),
  schema: baseSchema,
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes', deferRender: true }),
  schema: baseSchema.extend({
    project: reference('projects').optional(),
  }),
});

export const collections = { projects, notes };

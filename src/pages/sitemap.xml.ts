import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const site = (context.site?.toString() ?? 'https://jiminu.github.io').replace(/\/$/, '');

  const [projects, notes] = await Promise.all([
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  const urls = [
    `${site}/`,
    `${site}/projects/`,
    `${site}/notes/`,
    ...projects.map((item) => `${site}/projects/${item.id}/`),
    ...notes.map((item) => `${site}/notes/${item.id}/`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const [projects, notes] = await Promise.all([
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  const items = [
    ...projects.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/projects/${item.id}/`,
    })),
    ...notes.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/notes/${item.id}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'jiminu',
    description: '개발 기록',
    site: context.site ?? 'https://jiminu.github.io',
    items,
    customData: '<language>ko</language>',
  });
};

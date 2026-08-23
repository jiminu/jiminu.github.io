import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const rejectRawHtml = ({ fileURL }) => ({
  name: 'reject-raw-html',
  options: { position: true },
  html(node) {
    const source = fileURL
      ? decodeURIComponent(fileURL.pathname.split('/').slice(-4).join('/'))
      : 'Markdown';
    const line = node.position?.start?.line;
    throw new Error(
      `Raw HTML is not allowed in ${source}${line ? `:${line}` : ''}. Use Markdown syntax instead.`,
    );
  },
});

export default defineConfig({
  site: 'https://jiminu.github.io',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ mdastPlugins: [rejectRawHtml] }),
  },
});

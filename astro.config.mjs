import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const rejectRawHtml = {
  name: 'reject-raw-html',
  html(node) {
    const line = node.position?.start?.line;
    throw new Error(
      `Raw HTML is not allowed in Markdown${line ? ` (line ${line})` : ''}. Use Markdown syntax instead.`,
    );
  },
};

export default defineConfig({
  site: 'https://jiminu.github.io',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ mdastPlugins: [rejectRawHtml] }),
  },
});

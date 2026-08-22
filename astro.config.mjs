import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

const externalLinksPlugin = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener noreferrer');
      }
    },
  },
};

export default defineConfig({
  site: 'https://jiminu.github.io',
  markdown: {
    processor: satteri({
      hastPlugins: [externalLinksPlugin],
    }),
  },
});


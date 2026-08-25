import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const remarkRejectRawHtml = () => {
  const walk = (node, file) => {
    if (node.type === 'html') {
      const source = file?.history?.[0]
        ? file.history[0].split('/').slice(-4).join('/')
        : file?.path
          ? file.path.split('/').slice(-4).join('/')
          : 'Markdown';
      const line = node.position?.start?.line;
      throw new Error(
        `Raw HTML is not allowed in ${source}${line ? `:${line}` : ''}. Use Markdown syntax instead.`,
      );
    }
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child, file);
      }
    }
  };

  return (tree, file) => {
    walk(tree, file);
  };
};

const remarkRejectMiddleDot = () => {
  const walk = (node, file) => {
    if (node.type === 'text' && /[·•ㆍ・]/.test(node.value)) {
      const source = file?.history?.[0]
        ? file.history[0].split('/').slice(-4).join('/')
        : file?.path
          ? file.path.split('/').slice(-4).join('/')
          : 'Markdown';
      const line = node.position?.start?.line;
      throw new Error(
        `Middle dot (·) is not allowed in ${source}${line ? `:${line}` : ''}. Use standard conjunctions or commas instead.`,
      );
    }
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child, file);
      }
    }
  };

  return (tree, file) => {
    walk(tree, file);
  };
};

export default defineConfig({
  site: 'https://jiminu.github.io',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkRejectRawHtml, remarkRejectMiddleDot],
      rehypePlugins: [rehypeKatex],
    }),
  },
});

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'dist/index.html',
  'dist/projects/index.html',
  'dist/notes/index.html',
];

await Promise.all(requiredFiles.map((file) => access(file)));
await assert.rejects(access('dist/about/index.html'), { code: 'ENOENT' });

const home = await readFile('dist/index.html', 'utf8');
assert.match(home, /href="https:\/\/github\.com\/jiminu"/);

const css = await readFile('src/styles/global.css', 'utf8');
for (const forbidden of ['linear-gradient(', 'box-shadow:', '@keyframes']) {
  if (css.includes(forbidden)) {
    throw new Error(`Forbidden decorative CSS found: ${forbidden}`);
  }
}

const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
for (const required of [
  'withastro/action@v6',
  'actions/deploy-pages@v5',
  'pages: write',
  'id-token: write',
]) {
  if (!workflow.includes(required)) {
    throw new Error(`Missing GitHub Pages setting: ${required}`);
  }
}

console.log('Build verification passed.');

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'dist/index.html',
  'dist/projects/index.html',
  'dist/projects/selfishell/index.html',
  'dist/projects/factory-tycoon/index.html',
  'dist/notes/index.html',
  'dist/images/selfishell/shell.png',
  'dist/images/selfishell/nvim.png',
  'dist/images/factory-tycoon/overview.png',
  'dist/images/factory-tycoon/architecture.png',
  'dist/images/factory-tycoon/anomaly-detection.png',
  'dist/images/factory-tycoon/ai-assistant.png',
];

await Promise.all(requiredFiles.map((file) => access(file)));
await assert.rejects(access('dist/about/index.html'), { code: 'ENOENT' });

const home = await readFile('dist/index.html', 'utf8');
assert.match(home, /href="https:\/\/github\.com\/jiminu"/);
assert.match(home, /href="\/projects\/selfishell\/"/);

const selfishell = await readFile('dist/projects/selfishell/index.html', 'utf8');
assert.match(selfishell, /src="\/images\/selfishell\/shell\.png"/);
assert.match(selfishell, /src="\/images\/selfishell\/nvim\.png"/);
assert.match(selfishell, /href="https:\/\/github\.com\/jiminu\/selfishell"/);

assert.match(home, /href="\/projects\/factory-tycoon\/"/);

const factoryTycoon = await readFile('dist/projects/factory-tycoon/index.html', 'utf8');
for (const image of ['overview', 'architecture', 'anomaly-detection', 'ai-assistant']) {
  assert.match(factoryTycoon, new RegExp(`src="/images/factory-tycoon/${image}\\.png"`));
}
assert.match(factoryTycoon, /href="https:\/\/github\.com\/factorytycoon"/);

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

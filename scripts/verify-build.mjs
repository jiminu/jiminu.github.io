import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'dist/index.html',
  'dist/about/index.html',
  'dist/projects/index.html',
  'dist/notes/index.html',
];

await Promise.all(requiredFiles.map((file) => access(file)));

const css = await readFile('src/styles/global.css', 'utf8');
for (const forbidden of ['linear-gradient(', 'box-shadow:', '@keyframes']) {
  if (css.includes(forbidden)) {
    throw new Error(`Forbidden decorative CSS found: ${forbidden}`);
  }
}

console.log('Build verification passed.');

import { readFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

const violations = [];
for await (const path of glob('app/**/*.tsx')) {
  const source = await readFile(path, 'utf8');
  if (!source.includes('/demo-data')) continue;
  if (!source.includes('statusBanner') || !/DEMO/.test(source)) violations.push(path);
}

if (violations.length > 0) {
  console.error('Demo-data consumers must render an explicit DEMO status banner:');
  for (const path of violations) console.error(`- ${path}`);
  process.exitCode = 1;
} else {
  console.log('Demo-data boundary check passed.');
}

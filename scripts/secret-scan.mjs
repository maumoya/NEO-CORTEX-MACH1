import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', '.next', '.test-dist', 'node_modules']);
const textExtensions = new Set(['', '.css', '.env', '.example', '.js', '.json', '.md', '.mjs', '.sql', '.ts', '.tsx', '.yaml', '.yml']);
const rules = [
  ['OpenAI-style API key', /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['assigned Stripe secret', /^STRIPE_SECRET_KEY=.+$/m],
  ['assigned Clerk secret', /^CLERK_SECRET_KEY=.+$/m]
];

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(path));
    else if (entry.isFile() && textExtensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const findings = [];
for (const path of await collect(root)) {
  const content = await readFile(path, 'utf8');
  for (const [label, pattern] of rules) {
    if (pattern.test(content)) findings.push(`${relative(root, path)}: ${label}`);
  }
}

if (findings.length > 0) {
  console.error('Potential committed secret material detected (values suppressed):');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log('Secret-pattern scan passed.');
}

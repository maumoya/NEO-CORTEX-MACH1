import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const root = await realpath(process.cwd());
const profile = JSON.parse(await readFile(resolve(root, 'config/ecc-profile.json'), 'utf8'));
assert.match(profile.commit, /^[a-f0-9]{40}$/);
assert.equal(profile.hooksImported, false);
assert.equal(profile.upstreamExecutablesEnabled, false);
assert.equal(profile.license, 'MIT');
assert.match(await readFile(resolve(root, profile.licenseFile), 'utf8'), /Copyright \(c\) 2026 Affaan Mustafa/);
for (const module of profile.modules) {
  const path = await realpath(resolve(root, module.path));
  assert.ok(path.startsWith(root + sep) && path.endsWith('/SKILL.md'), 'Profile path outside repository skill scope');
  assert.match(module.upstreamSha256, /^[a-f0-9]{64}$/);
  const hash = createHash('sha256').update(await readFile(path)).digest('hex');
  assert.equal(hash, module.sha256, 'ECC skill changed without profile review: ' + module.path);
}
console.log('ECC profile provenance/digest check passed; no upstream executables or hooks enabled.');

import assert from 'node:assert/strict';
import test from 'node:test';
import { demoBoundaryPasses } from '../scripts/check-demo-boundary.mjs';

const fixture = body => `import { metrics } from '@/src/product/demo-data'; export default function Page(){${body}}`;
const banner = '<div className="statusBanner">DEMO MODE · Seeded values</div>';
test('demo guard accepts an unconditional banner, not a credential-dependent one', () => {
  assert.equal(demoBoundaryPasses(fixture(`return <main>${banner}<p>{metrics.value}</p></main>`)), true);
  assert.equal(demoBoundaryPasses(fixture(`return <main>{!configured && ${banner}}<p>{metrics.value}</p></main>`)), false);
});
test('demo guard does not accept labels hidden in comments, strings or unused functions', () => {
  assert.equal(demoBoundaryPasses(fixture(`/* statusBanner DEMO */ return <main>{metrics.value}</main>`)), false);
  assert.equal(demoBoundaryPasses(fixture(`const text='statusBanner DEMO'; return <main>{text}</main>`)), false);
  assert.equal(demoBoundaryPasses(fixture(`function unused(){return ${banner}} return <main>{metrics.value}</main>`)), false);
});
test('demo guard checks alternate returns and leaves non-demo pages alone', () => {
  assert.equal(demoBoundaryPasses(fixture(`if(configured) return <main>{metrics.value}</main>; return ${banner}`)), false);
  assert.equal(demoBoundaryPasses('export default function Page(){ return <main>Real data adapter</main> }'), true);
});

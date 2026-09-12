import { readFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import parser from 'next/dist/compiled/babel/parser.js';

// Deliberately narrow: seeded pages must render a literal, unconditional banner
// in every JSX-bearing return of their default function. This is not visual proof.
export function demoBoundaryPasses(source) {
  // Use the parser bundled with our pinned Next.js version; TypeScript 7 no longer
  // exposes the old compiler API from its package root.
  const file = parser.parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
  const consumesDemo = file.program.body.some(node => node.type === 'ImportDeclaration' && node.source.value.endsWith('/demo-data'));
  if (!consumesDemo) return true;
  const component = file.program.body.find(node => node.type === 'ExportDefaultDeclaration')?.declaration;
  if (component?.type !== 'FunctionDeclaration') return false;
  if (!component?.body) return false;
  const renders = [];
  function unconditionalBanner(node) {
    if (node.type === 'ParenthesizedExpression') return unconditionalBanner(node.expression);
    if (node.type === 'JSXElement') {
      const banner = node.openingElement.attributes.some(attribute => attribute.type === 'JSXAttribute' &&
        attribute.name.name === 'className' && attribute.value?.type === 'StringLiteral' &&
        attribute.value.value.split(/\s+/).includes('statusBanner'));
      if (banner && node.children.some(child => child.type === 'JSXText' && /\bDEMO\b/.test(child.value))) return true;
      return node.children.some(unconditionalBanner);
    }
    if (node.type === 'JSXFragment') return node.children.some(unconditionalBanner);
    // Never descend through conditionals, expressions, loops or child components.
    return false;
  }
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression', 'ObjectMethod', 'ClassMethod'].includes(node.type)) return;
    if (node.type === 'ReturnStatement') { renders.push(Boolean(node.argument && unconditionalBanner(node.argument))); return; }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(child => visit(child));
      else if (value?.type) visit(value);
    }
  }
  visit(component.body);
  return renders.length > 0 && renders.every(Boolean);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const violations = [];
  for await (const path of glob('app/**/*.tsx')) {
    if (!demoBoundaryPasses(await readFile(path, 'utf8'))) violations.push(path);
  }
  if (violations.length > 0) {
    console.error('Seeded pages must render an unconditional literal DEMO status banner in every return:');
    for (const path of violations) console.error(`- ${path}`);
    process.exitCode = 1;
  } else console.log('Demo-data source boundary check passed.');
}

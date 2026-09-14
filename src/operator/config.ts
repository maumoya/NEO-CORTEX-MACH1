import { realpathSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, resolve, sep } from 'node:path';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

function expandHome(value: string): string {
  if (value === '~') return homedir();
  if (value.startsWith('~/')) return resolve(homedir(), value.slice(2));
  return value;
}

function canonicalDirectory(value: string): string | null {
  const expanded = expandHome(value.trim());
  if (!isAbsolute(expanded)) return null;
  try {
    const canonical = realpathSync(expanded);
    return statSync(canonical).isDirectory() ? canonical : null;
  } catch {
    return null;
  }
}

export function localCanonicalUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password || !['http:', 'https:'].includes(url.protocol) || !LOCAL_HOSTS.has(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

export function operatorWorkspaceRoots(value: string | undefined): readonly string[] | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.some(item => typeof item !== 'string')) return null;
    const home = canonicalDirectory(homedir());
    const roots = [...new Set(parsed.map(item => canonicalDirectory(item)).filter((item): item is string => Boolean(item)))];
    if (roots.length !== parsed.length || roots.some(root => root === dirname(root) || root === home)) return null;
    return roots;
  } catch {
    return null;
  }
}

export function resolveOperatorWorkspace(value: string, roots: readonly string[]): string | null {
  const workspace = canonicalDirectory(value);
  if (!workspace) return null;
  return roots.some(root => workspace === root || workspace.startsWith(root + sep)) ? workspace : null;
}

export function operatorAvailability(environment: Readonly<Record<string, string | undefined>> = process.env) {
  if (environment.NEO_CORTEX_OPERATOR_ENABLED !== 'true') return { enabled: false, reason: 'operator_disabled' } as const;
  if (environment.VERCEL) return { enabled: false, reason: 'local_operator_unavailable_on_vercel' } as const;
  if (!environment.NEO_CORTEX_DATA_DIR) return { enabled: false, reason: 'persistent_data_directory_required' } as const;
  if (!localCanonicalUrl(environment.NEXT_PUBLIC_APP_URL)) return { enabled: false, reason: 'local_canonical_app_url_required' } as const;
  if (!operatorWorkspaceRoots(environment.NEO_CORTEX_OPERATOR_WORKSPACE_ROOTS)) {
    return { enabled: false, reason: 'operator_workspace_roots_required' } as const;
  }
  return { enabled: true, reason: 'local_operator_configured' } as const;
}

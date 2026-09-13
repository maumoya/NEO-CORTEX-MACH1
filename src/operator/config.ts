const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

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

export function operatorAvailability(environment: Readonly<Record<string, string | undefined>> = process.env) {
  if (environment.NEO_CORTEX_OPERATOR_ENABLED !== 'true') return { enabled: false, reason: 'operator_disabled' } as const;
  if (environment.VERCEL) return { enabled: false, reason: 'local_operator_unavailable_on_vercel' } as const;
  if (!environment.NEO_CORTEX_DATA_DIR) return { enabled: false, reason: 'persistent_data_directory_required' } as const;
  if (!localCanonicalUrl(environment.NEXT_PUBLIC_APP_URL)) return { enabled: false, reason: 'local_canonical_app_url_required' } as const;
  return { enabled: true, reason: 'local_operator_configured' } as const;
}

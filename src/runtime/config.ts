export function runtimeAvailability(environment: Readonly<Record<string, string | undefined>> = process.env) {
  if (environment.NEO_CORTEX_RUNTIME_ENABLED !== 'true') return { enabled: false, reason: 'runtime_disabled' } as const;
  if (environment.VERCEL) return { enabled: false, reason: 'shared_durable_store_required_on_vercel' } as const;
  if (!environment.NEO_CORTEX_DATA_DIR) return { enabled: false, reason: 'persistent_data_directory_required' } as const;
  return { enabled: true, reason: 'self_hosted_runtime_configured' } as const;
}

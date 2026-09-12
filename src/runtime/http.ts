import { directorRequestSchema, RuntimeFault, type RuntimeActor } from './contracts';
import { runDirector } from './director';
import type { ExecutionModeState } from '../core/kill-switch';
import type { SqliteTaskStore } from './task-store';

export interface DirectorHttpDependencies {
  availability: { enabled: boolean; reason: string };
  authConfigured: boolean;
  getActor: () => Promise<RuntimeActor | null>;
  openStore: () => SqliteTaskStore;
  mode: ExecutionModeState;
  appUrl?: string;
}

function response(body: unknown, status: number) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length') ?? 0) > 1024) throw new RuntimeFault('request_too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new RuntimeFault('invalid_director_request');
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new RuntimeFault('request_body_timeout'));
        void reader.cancel().catch(() => undefined);
      }, 5000);
    });
    const read = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 1024) throw new RuntimeFault('request_too_large');
        chunks.push(value);
      }
      try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { throw new RuntimeFault('invalid_director_request'); }
    };
    return await Promise.race([read(), timeout]);
  } finally { if (timer) clearTimeout(timer); void reader.cancel().catch(() => undefined); }
}

export async function handleDirectorHttp(request: Request, dependencies: DirectorHttpDependencies): Promise<Response> {
  let store: SqliteTaskStore | undefined;
  try {
    if (request.method !== 'POST') return response({ error: 'method_not_allowed' }, 405);
    if (!dependencies.availability.enabled) return response({ error: dependencies.availability.reason }, 503);
    if (!dependencies.authConfigured) return response({ error: 'authentication_not_configured' }, 503);
    const actor = await dependencies.getActor();
    if (!actor?.authenticated) return response({ error: 'authentication_required' }, 401);
    if (actor.role !== 'admin') return response({ error: 'administrator_required' }, 403);
    if (dependencies.mode.mode === 'halted') return response({ error: 'execution_halted' }, 423);
    if (!dependencies.appUrl) return response({ error: 'canonical_app_url_required' }, 503);
    const canonical = new URL(dependencies.appUrl);
    if (canonical.username || canonical.password || !['http:', 'https:'].includes(canonical.protocol)) {
      return response({ error: 'canonical_app_url_invalid' }, 503);
    }
    if (canonical.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(canonical.hostname)) {
      return response({ error: 'https_required' }, 503);
    }
    if (request.headers.get('origin') !== canonical.origin) return response({ error: 'origin_not_allowed' }, 403);
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return response({ error: 'json_content_type_required' }, 415);
    }
    const input = await readBody(request);
    if (!directorRequestSchema.safeParse(input).success) return response({ error: 'invalid_director_request' }, 400);
    store = dependencies.openStore();
    const result = runDirector(input, actor, store, dependencies.mode, request.signal);
    return response(result, result.task.state === 'succeeded' ? 200 : result.task.state === 'failed' ? 409 : 202);
  } catch (error) {
    const code = error instanceof RuntimeFault ? error.code : 'runtime_unavailable';
    const status = code === 'idempotency_conflict' ? 409 : code === 'rate_limited' ? 429
      : code === 'request_too_large' ? 413 : code === 'invalid_director_request' ? 400
      : code === 'request_body_timeout' ? 408 : code === 'request_cancelled' ? 409 : 503;
    return response({ error: code }, status);
  } finally { store?.close(); }
}

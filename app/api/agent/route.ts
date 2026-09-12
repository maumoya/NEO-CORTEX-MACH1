import { auth } from '@clerk/nextjs/server';
import { clerkConfigured, isAdminUserId } from '@/src/auth/config';
import { executionModeFromEnvironment } from '@/src/core/kill-switch';
import { runtimeAvailability } from '@/src/runtime/config';
import { handleDirectorHttp } from '@/src/runtime/http';
import { SqliteTaskStore } from '@/src/runtime/task-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;

export async function POST(request: Request) {
  return handleDirectorHttp(request, {
    availability: runtimeAvailability(), authConfigured: clerkConfigured(),
    mode: executionModeFromEnvironment(), appUrl: process.env.NEXT_PUBLIC_APP_URL,
    getActor: async () => {
      const { userId } = await auth();
      return userId ? { id: userId, authenticated: true, role: isAdminUserId(userId) ? 'admin' : 'viewer' } : null;
    },
    openStore: () => new SqliteTaskStore(process.env.NEO_CORTEX_DATA_DIR ?? '')
  });
}

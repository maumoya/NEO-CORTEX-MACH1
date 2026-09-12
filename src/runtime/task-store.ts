import { createHash, randomUUID } from 'node:crypto';
import { closeSync, chmodSync, lstatSync, mkdirSync, openSync, realpathSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { RuntimeFault, type DirectorRequest, type TaskRecord, type TaskState } from './contracts';

const FINAL = new Set<TaskState>(['succeeded', 'failed', 'cancelled']);
const TRANSITIONS: Record<TaskState, readonly TaskState[]> = {
  queued: ['running', 'cancelled'], running: ['succeeded', 'failed', 'cancelled'],
  succeeded: [], failed: [], cancelled: []
};
const MAX_TASKS = 10_000;
export function digest(value: string): string { return createHash('sha256').update(value).digest('hex'); }

// Single-host adapter only. The directory must be operator-owned and persistent.
export class SqliteTaskStore {
  private readonly database: DatabaseSync;

  constructor(directory: string) {
    if (!isAbsolute(directory)) throw new RuntimeFault('absolute_data_directory_required');
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const directoryInfo = lstatSync(directory);
    if (directoryInfo.isSymbolicLink() || !directoryInfo.isDirectory()) throw new RuntimeFault('unsafe_data_directory');
    if (process.getuid && directoryInfo.uid !== process.getuid()) throw new RuntimeFault('data_directory_not_owned');
    if ((directoryInfo.mode & 0o077) !== 0) throw new RuntimeFault('private_data_directory_required');
    const path = join(realpathSync(directory), 'tasks.sqlite');
    try { closeSync(openSync(path, 'wx', 0o600)); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
    }
    const fileInfo = lstatSync(path);
    if (!fileInfo.isFile() || fileInfo.isSymbolicLink() || fileInfo.nlink !== 1) throw new RuntimeFault('unsafe_database_file');
    if (process.getuid && fileInfo.uid !== process.getuid()) throw new RuntimeFault('database_file_not_owned');
    chmodSync(path, 0o600);
    this.database = new DatabaseSync(path, { allowExtension: false, timeout: 1000 });
    try {
      this.database.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;');
      this.database.exec(
        'CREATE TABLE IF NOT EXISTS tasks (' +
        'id TEXT PRIMARY KEY, actor_key TEXT NOT NULL, idempotency_hash TEXT NOT NULL, record TEXT NOT NULL,' +
        'UNIQUE(actor_key,idempotency_hash)) STRICT;' +
        'CREATE TABLE IF NOT EXISTS task_events (' +
        'seq INTEGER PRIMARY KEY AUTOINCREMENT, task_id TEXT NOT NULL REFERENCES tasks(id),' +
        'payload TEXT NOT NULL, previous_hash TEXT NOT NULL, hash TEXT NOT NULL) STRICT;'
      );
      this.verifyIntegrity();
    } catch (error) { this.database.close(); throw error; }
  }

  close(): void { this.database.close(); }

  private transaction<T>(work: () => T): T {
    this.database.exec('BEGIN IMMEDIATE');
    try { const result = work(); this.database.exec('COMMIT'); return result; }
    catch (error) { this.database.exec('ROLLBACK'); throw error; }
  }

  private row(taskId: string): TaskRecord | null {
    const row = this.database.prepare('SELECT record FROM tasks WHERE id=?').get(taskId);
    return row ? JSON.parse(String(row.record)) as TaskRecord : null;
  }

  private append(record: TaskRecord): void {
    const last = this.database.prepare('SELECT hash FROM task_events ORDER BY seq DESC LIMIT 1').get();
    const previous = last ? String(last.hash) : 'genesis';
    const payload = JSON.stringify({ version: 1, taskId: record.taskId, state: record.state, recordHash: digest(JSON.stringify(record)) });
    this.database.prepare('INSERT INTO task_events(task_id,payload,previous_hash,hash) VALUES (?,?,?,?)')
      .run(record.taskId, payload, previous, digest(previous + '\n' + payload));
  }

  private write(record: TaskRecord): void {
    this.database.prepare('UPDATE tasks SET record=? WHERE id=?').run(JSON.stringify(record), record.taskId);
    this.append(record);
  }

  verifyIntegrity(): { taskCount: number; eventCount: number; headHash: string } {
    // Hold one consistent snapshot so another connection cannot create a false mismatch.
    return this.transaction(() => this.inspectIntegrity());
  }

  private inspectIntegrity(): { taskCount: number; eventCount: number; headHash: string } {
    const events = this.database.prepare('SELECT seq,task_id,payload,previous_hash,hash FROM task_events ORDER BY seq').all();
    const latest = new Map<string, string>();
    let previous = 'genesis';
    for (const event of events) {
      const payload = String(event.payload);
      if (String(event.previous_hash) !== previous || String(event.hash) !== digest(previous + '\n' + payload)) {
        throw new RuntimeFault('audit_integrity_failed');
      }
      const parsed = JSON.parse(payload) as { taskId: string; recordHash: string };
      if (parsed.taskId !== event.task_id) throw new RuntimeFault('audit_integrity_failed');
      latest.set(parsed.taskId, parsed.recordHash);
      previous = String(event.hash);
    }
    const rows = this.database.prepare('SELECT id,actor_key,idempotency_hash,record FROM tasks').all();
    if (rows.length !== latest.size) throw new RuntimeFault('audit_integrity_failed');
    for (const row of rows) {
      if (latest.get(String(row.id)) !== digest(String(row.record))) throw new RuntimeFault('audit_integrity_failed');
      const record = JSON.parse(String(row.record)) as TaskRecord;
      if (record.taskId !== row.id || record.actorKey !== row.actor_key || record.idempotencyHash !== row.idempotency_hash) {
        throw new RuntimeFault('audit_integrity_failed');
      }
    }
    return { taskCount: rows.length, eventCount: events.length, headHash: previous };
  }

  accept(actorId: string, request: DirectorRequest, now = new Date()): { task: TaskRecord; replayed: boolean } {
    const actorKey = digest(actorId);
    const idempotencyHash = digest(actorKey + '\n' + request.idempotencyKey);
    const requestHash = digest(JSON.stringify({ version: 1, operation: request.operation }));
    return this.transaction(() => {
      const existing = this.database.prepare('SELECT record FROM tasks WHERE actor_key=? AND idempotency_hash=?').get(actorKey, idempotencyHash);
      if (existing) {
        const task = JSON.parse(String(existing.record)) as TaskRecord;
        if (task.requestHash !== requestHash) throw new RuntimeFault('idempotency_conflict');
        return { task, replayed: true };
      }
      const count = Number(this.database.prepare('SELECT count(*) AS total FROM tasks').get()!.total);
      if (count >= MAX_TASKS) throw new RuntimeFault('task_store_capacity_reached');
      const recent = this.database.prepare('SELECT record FROM tasks WHERE actor_key=?').all(actorKey)
        .filter(row => Date.parse((JSON.parse(String(row.record)) as TaskRecord).createdAt) > now.getTime() - 60_000);
      if (recent.length >= 20) throw new RuntimeFault('rate_limited');
      const task: TaskRecord = {
        taskId: 'task_' + randomUUID(), correlationId: 'corr_' + randomUUID(), actorKey, idempotencyHash, requestHash,
        operation: request.operation, state: 'queued', createdAt: now.toISOString(), updatedAt: now.toISOString(), result: null, reason: null
      };
      this.database.prepare('INSERT INTO tasks(id,actor_key,idempotency_hash,record) VALUES (?,?,?,?)')
        .run(task.taskId, actorKey, idempotencyHash, JSON.stringify(task));
      this.append(task);
      return { task, replayed: false };
    });
  }

  transition(actorId: string, taskId: string, expected: TaskState, next: TaskState,
    update: { result?: Record<string, unknown>; reason?: string } = {}, now = new Date()): TaskRecord {
    return this.transaction(() => {
      const task = this.row(taskId);
      if (!task || task.actorKey !== digest(actorId)) throw new RuntimeFault('task_not_found');
      if (task.state !== expected || !TRANSITIONS[expected].includes(next)) throw new RuntimeFault('invalid_task_transition');
      const record = { ...task, state: next, updatedAt: now.toISOString(), result: update.result ?? task.result, reason: update.reason ?? task.reason };
      if (JSON.stringify(record).length > 16_384) throw new RuntimeFault('task_record_too_large');
      this.write(record);
      return record;
    });
  }

  cancel(actorId: string, taskId: string): TaskRecord {
    const task = this.get(actorId, taskId);
    if (!task) throw new RuntimeFault('task_not_found');
    if (FINAL.has(task.state)) return task;
    return this.transition(actorId, taskId, task.state, 'cancelled', { reason: 'operator_cancelled' });
  }

  get(actorId: string, taskId: string): TaskRecord | null {
    const task = this.row(taskId);
    return task?.actorKey === digest(actorId) ? task : null;
  }

  recoverInterrupted(now = new Date()): number {
    return this.transaction(() => {
      const records = this.database.prepare('SELECT record FROM tasks').all().map(row => JSON.parse(String(row.record)) as TaskRecord);
      let recovered = 0;
      for (const task of records) {
        if (!FINAL.has(task.state) && now.getTime() - Date.parse(task.updatedAt) > 60_000) {
          this.write({ ...task, state: 'failed', updatedAt: now.toISOString(), reason: 'interrupted_execution_no_auto_retry' });
          recovered += 1;
        }
      }
      return recovered;
    });
  }
}

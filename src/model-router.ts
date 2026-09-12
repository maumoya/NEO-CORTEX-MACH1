import { z } from 'zod';
import { DATA_CLASSES, requiresPrivateOrExplicitlyApprovedInference, type DataClass } from './core/data-classification';

export type TaskClass = 'fast' | 'standard' | 'frontier' | 'multimodal' | 'simulation';
export interface GatewayModel {
  id: string;
  type?: string;
  context_window?: number;
  max_tokens?: number;
  tags?: string[];
  pricing?: { input?: string; output?: string };
}
export interface RouteRequest {
  taskClass: TaskClass;
  dataClass: DataClass;
  needsVision?: boolean;
  needsAudio?: boolean;
  needsTools?: boolean;
  minimumContext?: number;
  maxInputCostPerToken?: number;
  approvedProviders?: string[];
}

const gatewayModelSchema = z.object({
  id: z.string().min(1).max(256), type: z.string().optional(),
  context_window: z.number().int().nonnegative().optional(), max_tokens: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).max(100).optional(),
  pricing: z.object({ input: z.string().optional(), output: z.string().optional() }).optional()
});
const routeRequestSchema = z.object({
  taskClass: z.enum(['fast', 'standard', 'frontier', 'multimodal', 'simulation']), dataClass: z.enum(DATA_CLASSES),
  needsVision: z.boolean().optional(), needsAudio: z.boolean().optional(), needsTools: z.boolean().optional(),
  minimumContext: z.number().int().nonnegative().optional(), maxInputCostPerToken: z.number().nonnegative().optional(),
  approvedProviders: z.array(z.string().min(1)).optional()
}).strict();

function numericCost(value?: string): number {
  if (value === undefined || value.trim() === '') return Number.POSITIVE_INFINITY;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : Number.POSITIVE_INFINITY;
}

function providerFromModelId(id: string): string {
  return id.includes('/') ? id.split('/')[0] : 'unknown';
}

export async function getLiveModels(): Promise<GatewayModel[]> {
  const response = await fetch('https://ai-gateway.vercel.sh/v1/models', {
    cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000)
  });
  if (!response.ok) throw new Error('Model catalog failed: ' + response.status);
  const body = await response.json();
  const parsed = z.object({ data: z.array(gatewayModelSchema).max(10_000) }).safeParse(body);
  if (!parsed.success) throw new Error('Invalid model catalog response.');
  return parsed.data.data;
}

function preferenceTuple(model: GatewayModel, taskClass: TaskClass): readonly number[] {
  const tags = new Set(model.tags ?? []);
  const context = model.context_window ?? 0;
  const cost = numericCost(model.pricing?.input);
  if (taskClass === 'frontier') return [tags.has('reasoning') ? 0 : 1, -context, cost];
  if (taskClass === 'multimodal') return [tags.has('multimodal') ? 0 : 1, cost, -context];
  if (taskClass === 'simulation') return [-context, cost];
  return [cost, -context];
}

function compareModels(leftModel: GatewayModel, rightModel: GatewayModel, taskClass: TaskClass): number {
  const left = preferenceTuple(leftModel, taskClass);
  const right = preferenceTuple(rightModel, taskClass);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    if (leftValue !== rightValue) return leftValue < rightValue ? -1 : 1;
  }
  return leftModel.id === rightModel.id ? 0 : leftModel.id < rightModel.id ? -1 : 1;
}

export function routeFromCatalog(models: GatewayModel[], request: RouteRequest) {
  if (!routeRequestSchema.safeParse(request).success) throw new Error('Invalid model route request.');
  if (!Array.isArray(models) || models.length > 10_000) throw new Error('Invalid model catalog.');
  const approvedProviders = new Set(request.approvedProviders ?? []);
  const restricted = requiresPrivateOrExplicitlyApprovedInference(request.dataClass);
  const eligible = models.filter((model) => {
    if (!gatewayModelSchema.safeParse(model).success) return false;
    const tags = new Set(model.tags ?? []);
    const provider = providerFromModelId(model.id);
    if (model.type && model.type !== 'language') return false;
    if (restricted && !approvedProviders.has(provider)) return false;
    if (request.needsVision && !tags.has('vision')) return false;
    if (request.needsAudio && !tags.has('audio') && !tags.has('multimodal')) return false;
    if (request.needsTools && !tags.has('tool-use')) return false;
    if (request.minimumContext && (model.context_window ?? 0) < request.minimumContext) return false;
    if (request.maxInputCostPerToken !== undefined && numericCost(model.pricing?.input) > request.maxInputCostPerToken) return false;
    return true;
  }).sort((left, right) => compareModels(left, right, request.taskClass));

  return {
    eligible,
    recommendation: eligible[0] ?? null,
    reason: eligible.length === 0 && restricted
      ? 'No model matched the restricted-data provider policy. Use a private/local or explicitly approved provider.'
      : 'Hard requirements and data-class policy filtered; deterministic tier preferences applied. Add eval-backed scoring before production.'
  };
}

export async function routeModel(request: RouteRequest) {
  return routeFromCatalog(await getLiveModels(), request);
}

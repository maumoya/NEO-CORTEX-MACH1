import { requiresPrivateOrExplicitlyApprovedInference, type DataClass } from './core/data-classification';

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

function numericCost(value?: string): number {
  if (value === undefined || value === '') return Number.POSITIVE_INFINITY;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.POSITIVE_INFINITY;
}

function providerFromModelId(id: string): string {
  return id.includes('/') ? id.split('/')[0] : 'unknown';
}

export async function getLiveModels(): Promise<GatewayModel[]> {
  const response = await fetch('https://ai-gateway.vercel.sh/v1/models', { cache: 'no-store' });
  if (!response.ok) throw new Error('Model catalog failed: ' + response.status);
  const body = await response.json();
  return body.data ?? [];
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
    const delta = (left[index] ?? 0) - (right[index] ?? 0);
    if (delta !== 0) return delta;
  }
  return leftModel.id.localeCompare(rightModel.id);
}

export function routeFromCatalog(models: GatewayModel[], request: RouteRequest) {
  const approvedProviders = new Set(request.approvedProviders ?? []);
  const restricted = requiresPrivateOrExplicitlyApprovedInference(request.dataClass);
  const eligible = models.filter((model) => {
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

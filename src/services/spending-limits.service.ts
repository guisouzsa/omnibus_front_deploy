import { apiClient } from '@/lib/api-client';
import {
  SpendingLimit,
  CreateSpendingLimitRequest,
  UpdateSpendingLimitRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

function getLimitAmount(limit: Partial<SpendingLimit>): number {
  if (typeof limit.limit_amount === 'number') return limit.limit_amount;
  if (typeof limit.limit_amount === 'string') {
    const parsed = Number(limit.limit_amount);
    if (!Number.isNaN(parsed)) return parsed;
  }
  if (typeof limit.limit_value === 'number') return limit.limit_value;
  if (typeof limit.limit_value === 'string') {
    const parsed = Number(limit.limit_value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function normalizeLimit(limit: any): SpendingLimit {
  return {
    ...limit,
    limit_amount: getLimitAmount(limit),
    limit_value: getLimitAmount(limit),
    month: limit?.month ?? (limit?.created_at ? new Date(limit.created_at).toISOString().slice(5, 7) : ''),
    year: limit?.year ?? (limit?.created_at ? new Date(limit.created_at).toISOString().slice(0, 4) : ''),
  } as SpendingLimit;
}

function normalizeLimitsList(response: any): SpendingLimit[] {
  if (Array.isArray(response)) {
    return response.map(normalizeLimit);
  }

  if (Array.isArray(response?.data)) {
    return response.data.map(normalizeLimit);
  }

  return [];
}

class SpendingLimitsService {
  // Listar todos os limites
  async getAll(
    params?: QueryParams
  ): Promise<PaginatedResponse<SpendingLimit>> {
    return apiClient.get('/api/spending-limits', params);
  }

  // Obter limite por ID
  async getById(id: number): Promise<SpendingLimit> {
    return apiClient.get(`/api/spending-limits/${id}`);
  }

  // Criar novo limite
  async create(
    data: CreateSpendingLimitRequest
  ): Promise<ApiResponse<SpendingLimit>> {
    const payload = {
      user_id: data.user_id,
      limit_amount: data.limit_amount ?? data.limit_value,
    };

    const response = await apiClient.post<ApiResponse<SpendingLimit>>(
      '/api/spending-limits',
      payload
    );

    if (response?.data) {
      response.data = normalizeLimit(response.data);
    }

    return response;
  }

  // Atualizar limite
  async update(
    id: number,
    data: UpdateSpendingLimitRequest
  ): Promise<ApiResponse<SpendingLimit>> {
    const payload = {
      limit_amount: data.limit_amount ?? data.limit_value,
    };

    const response = await apiClient.put<ApiResponse<SpendingLimit>>(
      `/api/spending-limits/${id}`,
      payload
    );

    if (response?.data) {
      response.data = normalizeLimit(response.data);
    }

    return response;
  }

  // Deletar limite
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/spending-limits/${id}`);
  }

  // Obter limites por usuário
  async getByUser(userId: number): Promise<SpendingLimit[]> {
    const response = await apiClient.get(`/api/spending-limits/user/${userId}`);
    return normalizeLimitsList(response);
  }

  // Obter limite por período
  async getByPeriod(
    userId: number,
    year: string,
    month: string
  ): Promise<SpendingLimit | null> {
    try {
      const response = await apiClient.get(
        `/api/spending-limits/user/${userId}/period/${year}/${month}`
      );

      if (!response) {
        return null;
      }

      return normalizeLimit(response);
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }

      const allLimitsResponse = await this.getAll();
      const allLimits = normalizeLimitsList(allLimitsResponse);

      return (
        allLimits.find((limit) => {
          const normalizedMonth = String(limit.month).padStart(2, '0');
          return (
            limit.user_id === userId &&
            String(limit.year) === String(year) &&
            normalizedMonth === String(month).padStart(2, '0')
          );
        }) ?? null
      );
    }
  }

  // Verificar se limite foi excedido
  async checkExceeded(
    userId: number,
    year: string,
    month: string
  ): Promise<{ exceeded: boolean; limit?: SpendingLimit }> {
    return apiClient.get(
      `/api/spending-limits/check/${userId}/${year}/${month}`
    );
  }
}

export const spendingLimitsService = new SpendingLimitsService();

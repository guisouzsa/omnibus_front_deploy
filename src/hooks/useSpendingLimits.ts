'use client';

import { useState, useEffect } from 'react';
import { spendingLimitsService } from '@/services';
import {
  SpendingLimit,
  CreateSpendingLimitRequest,
  UpdateSpendingLimitRequest,
  QueryParams,
} from '@/types/api';

function normalizeLimitsResponse(response: any): {
  items: SpendingLimit[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
} {
  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: response.length,
        total: response.length,
      },
    };
  }

  const items = Array.isArray(response?.data) ? response.data : [];
  return {
    items,
    pagination: {
      currentPage: response?.current_page ?? 1,
      lastPage: response?.last_page ?? 1,
      perPage: response?.per_page ?? items.length,
      total: response?.total ?? items.length,
    },
  };
}

export function useSpendingLimits(autoFetch = true) {
  const [limits, setLimits] = useState<SpendingLimit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  useEffect(() => {
    if (autoFetch) {
      fetchLimits();
    }
  }, [autoFetch]);

  const fetchLimits = async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await spendingLimitsService.getAll(params);
      const normalized = normalizeLimitsResponse(response);
      setLimits(normalized.items);
      setPagination(normalized.pagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar limites');
      setLimits([]);
    } finally {
      setLoading(false);
    }
  };

  const getLimit = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const limit = await spendingLimitsService.getById(id);
      return limit;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar limite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLimit = async (data: CreateSpendingLimitRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await spendingLimitsService.create(data);
      await fetchLimits();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar limite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLimit = async (id: number, data: UpdateSpendingLimitRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await spendingLimitsService.update(id, data);
      await fetchLimits();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar limite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLimit = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await spendingLimitsService.delete(id);
      await fetchLimits();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar limite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLimitByPeriod = async (
    userId: number,
    year: string,
    month: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const limit = await spendingLimitsService.getByPeriod(userId, year, month);
      return limit;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar limite do período');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkExceeded = async (userId: number, year: string, month: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await spendingLimitsService.checkExceeded(
        userId,
        year,
        month
      );
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar limite');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    limits,
    loading,
    error,
    pagination,
    fetchLimits,
    getLimit,
    createLimit,
    updateLimit,
    deleteLimit,
    getLimitByPeriod,
    checkExceeded,
  };
}

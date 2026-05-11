'use client';

import { useState, useEffect, useCallback } from 'react';
import { driversService } from '@/services';
import { Driver, CreateDriverRequest, UpdateDriverRequest, QueryParams } from '@/types/api';

function sortByNewest<T extends { id: number; created_at?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;

    if (bTime !== aTime) {
      return bTime - aTime;
    }

    return b.id - a.id;
  });
}

export function useDrivers(autoFetch = true) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchDrivers = useCallback(async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driversService.getAll(params);
      setDrivers(sortByNewest(response.data || []));
      setPagination({
        currentPage: response.current_page,
        lastPage: response.last_page,
        perPage: response.per_page,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar motoristas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchDrivers();
    }
  }, [autoFetch, fetchDrivers]);

  const getDriver = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const driver = await driversService.getById(id);
      return driver;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar motorista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createDriver = async (data: CreateDriverRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driversService.create(data);
      await fetchDrivers();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar motorista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDriver = async (id: number, data: UpdateDriverRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driversService.update(id, data);
      await fetchDrivers();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar motorista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await driversService.delete(id);
      await fetchDrivers();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar motorista');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    drivers,
    loading,
    error,
    pagination,
    fetchDrivers,
    getDriver,
    createDriver,
    updateDriver,
    deleteDriver,
  };
}

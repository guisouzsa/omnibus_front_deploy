'use client';

import { useEffect, useState } from 'react';
import { schoolsService } from '@/services/schools.service';
import {
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  QueryParams,
} from '@/types/api';

export function useSchools(autoFetch = true) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  });

  useEffect(() => {
    if (autoFetch) {
      fetchSchools();
    }
  }, [autoFetch]);

  const fetchSchools = async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolsService.getAll(params);
      setSchools(response.data || []);
      setPagination({
        currentPage: response.current_page,
        lastPage: response.last_page,
        perPage: response.per_page,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar escolas');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const getSchool = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await schoolsService.getById(id);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar escola');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async (data: CreateSchoolRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolsService.create(data);
      await fetchSchools();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar escola');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchool = async (id: number, data: UpdateSchoolRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await schoolsService.update(id, data);
      await fetchSchools();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar escola');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchool = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await schoolsService.delete(id);
      await fetchSchools();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir escola');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    schools,
    loading,
    error,
    pagination,
    fetchSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,
  };
}

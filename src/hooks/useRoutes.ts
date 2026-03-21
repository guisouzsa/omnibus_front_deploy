'use client';

import { useState, useEffect } from 'react';
import { routesService } from '@/services/routes.service';
import {
  Route,
  RouteDetailsResponse,
  GeocodeAddressOption,
  CreateRouteRequest,
  UpdateRouteRequest,
  QueryParams,
} from '@/types/api';

export function useRoutes(autoFetch = true) {
  const [routes, setRoutes] = useState<Route[]>([]);
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
      fetchRoutes();
    }
  }, [autoFetch]);

  const fetchRoutes = async (params?: QueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await routesService.getAll(params);
      setRoutes(response.data || []);
      setPagination({
        currentPage: response.current_page,
        lastPage: response.last_page,
        perPage: response.per_page,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar rotas');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoute = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await routesService.getById(id);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar rota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async (data: CreateRouteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await routesService.create(data);
      await fetchRoutes();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar rota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = async (id: number, data: UpdateRouteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await routesService.update(id, data);
      await fetchRoutes();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar rota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await routesService.delete(id);
      await fetchRoutes();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar rota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAddressesByCep = async (cep: string): Promise<GeocodeAddressOption[]> => {
    setLoading(true);
    setError(null);
    try {
      return await routesService.getAddressesByCep(cep);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar enderecos por CEP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async (address: string): Promise<GeocodeAddressOption> => {
    setLoading(true);
    setError(null);
    try {
      return await routesService.geocodeAddress(address);
    } catch (err: any) {
      setError(err.message || 'Erro ao geocodificar endereco');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    routes,
    loading,
    error,
    pagination,
    fetchRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    getAddressesByCep,
    geocodeAddress,
  };
}

import { apiClient } from '@/lib/api-client';
import {
  Route,
  RouteDetailsResponse,
  GeocodeAddressOption,
  CreateRouteRequest,
  UpdateRouteRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

class RoutesService {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Route>> {
    return apiClient.get('/api/routes', params);
  }

  async getById(id: number): Promise<RouteDetailsResponse> {
    return apiClient.get(`/api/routes/${id}`);
  }

  async getAddressesByCep(cep: string): Promise<GeocodeAddressOption[]> {
    const response = await apiClient.post<{ data: GeocodeAddressOption[] }>(
      '/api/geocode/addresses-by-cep',
      { cep }
    );

    return response?.data || [];
  }

  async geocodeAddress(address: string): Promise<GeocodeAddressOption> {
    const response = await apiClient.post<{ data: GeocodeAddressOption }>(
      '/api/geocode/address',
      { address }
    );

    return response.data;
  }

  async create(data: CreateRouteRequest): Promise<ApiResponse<Route>> {
    return apiClient.post('/api/routes', data);
  }

  async update(id: number, data: UpdateRouteRequest): Promise<ApiResponse<Route>> {
    return apiClient.put(`/api/routes/${id}`, data);
  }

  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/routes/${id}`);
  }
}

export const routesService = new RoutesService();

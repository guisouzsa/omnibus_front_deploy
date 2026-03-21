import { apiClient } from '@/lib/api-client';
import {
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

class SchoolsService {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<School>> {
    return apiClient.get('/api/schools', params);
  }

  async getById(id: number): Promise<ApiResponse<School>> {
    return apiClient.get(`/api/schools/${id}`);
  }

  async create(data: CreateSchoolRequest): Promise<ApiResponse<School>> {
    return apiClient.post('/api/schools', data);
  }

  async update(id: number, data: UpdateSchoolRequest): Promise<ApiResponse<School>> {
    return apiClient.put(`/api/schools/${id}`, data);
  }

  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/schools/${id}`);
  }
}

export const schoolsService = new SchoolsService();

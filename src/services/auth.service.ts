import { apiClient } from '@/lib/api-client';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from '@/types/api';

// Normaliza resposta do Laravel que retorna { data: user } ou { user } ou direto
const normalizeUser = (resp: any): User => {
  return resp?.data ?? resp?.user ?? resp;
};

class AuthService {
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    return apiClient.post('/api/register', data);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const resp = await apiClient.login('/api/login', credentials);
    // Garante que user está normalizado na resposta
    return {
      ...resp,
      user: normalizeUser(resp),
    };
  }

  async getUser(): Promise<User> {
    const resp = await apiClient.get('/api/user');
    return normalizeUser(resp);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/logout');
    } finally {
      apiClient.removeToken();
    }
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post('/api/forgot-password', { email });
  }

  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse> {
    return apiClient.post('/api/reset-password', data);
  }
}

export const authService = new AuthService();

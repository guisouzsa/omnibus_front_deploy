import { apiClient } from '@/lib/api-client';
import {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
  MonthlyTotal,
  ExpensesDashboardSummary,
} from '@/types/api';

class ExpensesService {
  // ===== Rotas do Motorista =====

  // Listar despesas do motorista autenticado
  async getMyExpenses(
    params?: QueryParams
  ): Promise<PaginatedResponse<Expense>> {
    return apiClient.get('/api/drivers/expenses', params);
  }

  // Criar nova despesa (motorista)
  async createAsDriver(data: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiClient.post('/api/drivers/expenses', data);
  }

  // Criar despesa com arquivo
  async createWithFile(
    data: CreateExpenseRequest,
    file: File
  ): Promise<ApiResponse<Expense>> {
    const formData = new FormData();
    formData.append('vehicle_plate', data.vehicle_plate);
    formData.append('value', String(data.value));
    formData.append('proof_of_payment', file);

    return apiClient.post('/api/drivers/expenses', formData, {
      isFormData: true,
    });
  }

  // Ver despesa específica do motorista
  async getMyExpenseById(id: number): Promise<Expense> {
    return apiClient.get(`/api/drivers/expenses/${id}`);
  }

  // Ver total mensal do motorista
  async getMyMonthlyTotal(): Promise<MonthlyTotal> {
    return apiClient.get('/api/drivers/expenses-monthly-total');
  }

  // Resumo de gastos para dashboard da secretaria
  async getDashboardSummary(): Promise<ExpensesDashboardSummary> {
    return apiClient.get('/api/expenses/summary');
  }

  // ===== Rotas da Secretaria =====

  // Listar todas as despesas (secretaria)
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Expense>> {
    return apiClient.get('/api/expenses', params);
  }

  // Obter despesa por ID (secretaria)
  async getById(id: number): Promise<Expense> {
    return apiClient.get(`/api/expenses/${id}`);
  }

  // Criar nova despesa (secretaria)
  async create(data: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiClient.post('/api/expenses', data);
  }

  // Atualizar despesa (secretaria)
  async update(
    id: number,
    data: UpdateExpenseRequest
  ): Promise<ApiResponse<Expense>> {
    return apiClient.put(`/api/expenses/${id}`, data);
  }

  // Deletar despesa (secretaria)
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/expenses/${id}`);
  }

  // Obter despesas por motorista
  async getByDriver(driverId: number): Promise<Expense[]> {
    return apiClient.get(`/api/expenses/driver/${driverId}`);
  }

  // Aprovar despesa
  async approve(id: number): Promise<ApiResponse<Expense>> {
    return apiClient.patch(`/api/expenses/${id}`, { status: 'approved' });
  }

  // Rejeitar despesa
  async reject(id: number): Promise<ApiResponse<Expense>> {
    return apiClient.patch(`/api/expenses/${id}`, { status: 'rejected' });
  }
}

export const expensesService = new ExpensesService();

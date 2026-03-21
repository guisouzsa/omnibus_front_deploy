// Tipos de dados da API

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  license_number: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  driver_id: number | null;
  plate: string;
  capacity: number;
  mainRoute: string;
  created_at: string;
  updated_at: string;
  driver?: Driver;
}

export interface School {
  id: number;
  user_id: number;
  name: string;
  cep: string;
  address: string;
  reference_point?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: number;
  user_id: number;
  school_id?: number | null;
  name: string;
  start_point: string;
  start_point_cep?: string | null;
  start_point_reference?: string | null;
  start_point_lat?: number | null;
  start_point_lng?: number | null;
  end_point: string;
  end_point_lat?: number | null;
  end_point_lng?: number | null;
  departure_time: string;
  created_at: string;
  updated_at: string;
  school?: School;
}

export interface GeocodeAddressOption {
  address: string;
  lat: number;
  lng: number;
}

export interface RouteDetailsResponse {
  data: Route;
  suggested_duration_minutes: number | null;
  map_points: {
    start: { lat: number | null; lng: number | null; label: string };
    end: { lat: number | null; lng: number | null; label: string };
  };
}

export interface Expense {
  id: number;
  driver_id: number;
  vehicle_plate: string;
  value: number;
  proof_of_payment?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  driver?: Driver;
}

export interface SpendingLimit {
  id: number;
  user_id: number;
  month: string;
  year: string;
  limit_amount: number;
  limit_value?: number;
  current_spent?: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Tipos de requisições
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  driver?: Driver;
  token: string;
}

export interface CreateDriverRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  license_number: string;
  phone_number: string;
}

export interface UpdateDriverRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  license_number?: string;
  phone_number?: string;
}

export interface CreateExpenseRequest {
  vehicle_plate: string;
  value: number;
  proof_of_payment?: string;
}

export interface UpdateExpenseRequest {
  vehicle_plate?: string;
  value?: number;
  proof_of_payment?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface CreateSpendingLimitRequest {
  user_id: number;
  limit_amount?: number;
  limit_value?: number;
  month?: string;
  year?: string;
}

export interface UpdateSpendingLimitRequest {
  month?: string;
  year?: string;
  limit_amount?: number;
  limit_value?: number;
}

export interface CreateVehicleRequest {
  driver_id: number;
  plate: string;
  capacity: number;
  mainRoute: string;
}

export interface UpdateVehicleRequest {
  driver_id?: number;
  plate?: string;
  capacity?: number;
  mainRoute?: string;
}

export interface CreateSchoolRequest {
  name: string;
  cep: string;
  address: string;
  reference_point?: string;
  lat?: number;
  lng?: number;
}

export interface UpdateSchoolRequest {
  name?: string;
  cep?: string;
  address?: string;
  reference_point?: string;
  lat?: number;
  lng?: number;
}

export interface CreateRouteRequest {
  name: string;
  school_id?: number;
  start_point: string;
  start_point_cep?: string;
  start_point_reference?: string;
  start_point_lat?: number;
  start_point_lng?: number;
  end_point: string;
  end_point_lat?: number;
  end_point_lng?: number;
  departure_time: string;
}

export interface UpdateRouteRequest {
  name?: string;
  school_id?: number | null;
  start_point?: string;
  start_point_cep?: string;
  start_point_reference?: string;
  start_point_lat?: number;
  start_point_lng?: number;
  end_point?: string;
  end_point_lat?: number;
  end_point_lng?: number;
  departure_time?: string;
}

// Tipos de respostas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Tipo genérico de resposta da API
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Tipo para parâmetros de query
export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: any;
}

// Tipo para erros de validação
export interface ValidationError {
  field: string;
  messages: string[];
}

// Tipo para resposta de total mensal
export interface MonthlyTotal {
  month: string;
  year: string;
  total: number;
}

export interface ExpensesDashboardSummary {
  current_month_expenses: number;
  min_month_expenses: number;
  current_month_limit: number;
}

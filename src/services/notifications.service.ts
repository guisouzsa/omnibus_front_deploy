import { apiClient } from '@/lib/api-client';
import {
  Notification,
  CreateNotificationRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
  UnreadCountResponse,
} from '@/types/api';

class NotificationsService {
  // ===== Para Secretárias =====

  /**
   * Listar todas as notificações
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Notification>> {
    return apiClient.get('/api/notifications', params);
  }

  /**
   * Obter contagem de notificações não lidas
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiClient.get('/api/notifications/unread-count');
  }

  /**
   * Obter uma notificação específica
   */
  async getById(id: number): Promise<Notification> {
    return apiClient.get(`/api/notifications/${id}`);
  }

  /**
   * Marcar uma notificação como lida
   */
  async markAsRead(id: number): Promise<ApiResponse<Notification>> {
    return apiClient.put(`/api/notifications/${id}/read`, {});
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(): Promise<ApiResponse> {
    return apiClient.post('/api/notifications/mark-all-read', {});
  }

  // ===== Para Motoristas =====

  /**
   * Enviar uma nova notificação (motorista)
   */
  async create(data: CreateNotificationRequest): Promise<ApiResponse<Notification>> {
    return apiClient.post('/api/drivers/notifications', data);
  }

  /**
   * Listar notificações do motorista autenticado
   */
  async getMyNotifications(params?: QueryParams): Promise<PaginatedResponse<Notification>> {
    return apiClient.get('/api/drivers/notifications', params);
  }

  /**
   * Obter notificações por rota (motorista)
   */
  async getByRoute(routeId: number): Promise<Notification[]> {
    return apiClient.get(`/api/drivers/notifications/route/${routeId}`);
  }

  /**
   * Obter uma notificação específica (motorista)
   */
  async getMyNotificationById(id: number): Promise<Notification> {
    return apiClient.get(`/api/drivers/notifications/${id}`);
  }

  /**
   * Marcar uma notificação como lida (motorista)
   */
  async markMyNotificationAsRead(id: number): Promise<ApiResponse<Notification>> {
    return apiClient.put(`/api/drivers/notifications/${id}/read`, {});
  }

  /**
   * Obter contagem de notificações não lidas (motorista)
   */
  async getMyUnreadCount(): Promise<UnreadCountResponse> {
    return apiClient.get('/api/drivers/notifications/unread-count');
  }

  /**
   * Marcar todas as notificações como lidas (motorista)
   */
  async markAllMyNotificationsAsRead(): Promise<ApiResponse> {
    return apiClient.post('/api/drivers/notifications/mark-all-read', {});
  }
}

export const notificationsService = new NotificationsService();

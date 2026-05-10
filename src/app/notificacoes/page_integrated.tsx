"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";
import { useAuth } from "@/hooks";
import { notificationsService } from "@/services";
import { Notification as NotificationData, NotificationType as NotificationTypeEnum } from "@/types/api";

type FilterType = "all" | "route_started" | "route_finished" | "route_delayed" | "vehicle_changed" | "route_maintenance";

interface NotificationUI extends NotificationData {
  title: string;
  filter_category: FilterType;
}

const FILTER_LABELS: Record<FilterType, string> = {
  all:               "Todas",
  route_started:     "Rotas iniciadas",
  route_finished:    "Rotas finalizadas",
  route_delayed:     "Atraso na rota",
  vehicle_changed:   "Troca de veículo",
  route_maintenance: "Mau funcionamento",
};

const TYPE_TITLES: Record<NotificationTypeEnum, string> = {
  route_started:      "Ônibus iniciou a rota",
  route_finished:     "Rota finalizada",
  route_delayed:      "Atraso na rota",
  vehicle_changed:    "Troca de veículo",
  route_maintenance:  "Mau funcionamento do veículo",
  checkpoint_reached: "Ponto de referência alcançado",
  driver_changed:     "Motorista alterado",
  no_transport:       "Sem transporte",
  expense_added:      "Despesa adicionada",
  route_assigned:     "Rota atribuída",
};

const TYPE_ICONS: Record<NotificationTypeEnum, React.ReactElement> = {
  route_started: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <circle cx="7" cy="18" r="1.5" fill="#01233F" />
      <circle cx="17" cy="18" r="1.5" fill="#01233F" />
    </svg>
  ),
  route_maintenance: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2l4 4-8 8-4 1 1-4 8-8z" />
      <path d="M14 2l4 4" />
    </svg>
  ),
  checkpoint_reached: (
    <svg width="14" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z" />
      <circle cx="12" cy="9" r="2" fill="#01233F" />
    </svg>
  ),
  driver_changed: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20v-1a7 7 0 0 1 14 0v1" />
    </svg>
  ),
  vehicle_changed: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h13v8H3z" />
      <path d="M16 8l4 4-4 4" />
    </svg>
  ),
  no_transport: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
  route_finished: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  route_delayed: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  ),
  expense_added: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1v22" />
      <path d="M6 7h12" />
    </svg>
  ),
  route_assigned: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <path d="M3 14h18v6H3z" />
    </svg>
  ),
};

const FILTER_TYPE_MAPPING: Record<NotificationTypeEnum, FilterType> = {
  route_started:      "route_started",
  route_finished:     "route_finished",
  route_delayed:      "route_delayed",
  vehicle_changed:    "vehicle_changed",
  route_maintenance:  "route_maintenance",
  checkpoint_reached: "route_started",
  driver_changed:     "route_started",
  no_transport:       "route_maintenance",
  expense_added:      "route_finished",
  route_assigned:     "route_started",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateMid = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((todayMid.getTime() - dateMid.getTime()) / msPerDay);

  if (diffDays === 0) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Ontem';
  } else if (diffDays > 1 && diffDays < 30) {
    return `${diffDays}d atrás`;
  } else {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }
}

export default function NotificacoesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const initial = (user?.name || user?.email || 'A')?.[0]?.toUpperCase();
  const [notifications, setNotifications] = useState<NotificationUI[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar notificações ao montar o componente
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsService.getAll({ per_page: 50 });
      
      const formattedNotifications: NotificationUI[] = response.data.map((notif) => ({
        ...notif,
        title: TYPE_TITLES[notif.type],
        filter_category: FILTER_TYPE_MAPPING[notif.type],
      }));

      setNotifications(formattedNotifications);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
      setError('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.filter_category === activeFilter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) => 
        prev.map((n) => (n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
    }
  };

  const toggleRead = async (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.read) {
      await markAsRead(id);
    } else if (notification && notification.read) {
      // Opcionalmente, você pode adicionar um endpoint para "desmarcar como lida"
      // Por enquanto, apenas revertemos localmente
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false, read_at: null } : n))
      );
    }
  };

  return (
    <div className="page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
              <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
            </svg>
          </div>
          <div><div className="logo-text">Omnibus</div><div className="logo-sub">Gestão Escolar</div></div>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-label">Principal</span>
          <button className="nav-item" onClick={() => router.push("/dashboard")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Financeiro
          </button>
          <span className="nav-label">Cadastros</span>
          <button className="nav-item" onClick={() => router.push("/lista_onibus")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/></svg>
            Ônibus
          </button>
          <button className="nav-item" onClick={() => router.push("/lista_rotas")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            Rotas
          </button>
          <button className="nav-item" onClick={() => router.push("/lista_motoristas")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
            Motoristas
          </button>
          <button className="nav-item" onClick={() => router.push("/lista_escolas")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Escolas
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="user-row" onClick={() => router.push("/perfil")}> 
            <div className="avatar-sb">{initial}</div>
            <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
          </button>
          <SidebarLogoutButton />
        </div>
      </aside>

      {/* CONTENT */}
      <div className="content-wrap">
        <header className="topbar">
          <div>
            <div className="topbar-title">Notificações</div>
            <div className="topbar-sub">Acompanhe os eventos do sistema</div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn-top" onClick={() => router.push("/perfil")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </header>

        <main className="main">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">NOTIFICAÇÕES</h2>
            </div>

            {error && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>Carregando notificações...</div>
              </div>
            ) : (
              <>
                <div className="toolbar">
                  <div className="filters">
                    {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
                      <button
                        key={f}
                        className={`filter-btn${activeFilter === f ? " active" : ""}`}
                        onClick={() => setActiveFilter(f)}
                      >
                        {FILTER_LABELS[f]}
                        {f === "all" && unreadCount > 0 && (
                          <span className="badge">{unreadCount}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {unreadCount > 0 && (
                    <button className="mark-all-btn" onClick={markAllAsRead}>
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {filtered.length === 0 && (
                    <div className="empty">Nenhuma notificação encontrada.</div>
                  )}
                  {filtered.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-row${n.read ? " read" : ""}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="notif-check">
                        <button
                          className={`checkbox${n.read ? " checked" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleRead(n.id); }}
                        >
                          {n.read && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="2,6 5,9 10,3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="notif-icon-cell">
                        <span className="notif-type-icon">{TYPE_ICONS[n.type]}</span>
                      </div>
                      <div className="notif-content">
                        <span className="notif-title">{n.title}</span>
                        <span className="notif-desc">{n.message}</span>
                        {(n.route?.name || n.driver?.name) && (
                          <span className="notif-meta">
                            {[n.route?.name && `Rota: ${n.route.name}`, n.driver?.name && `Motorista: ${n.driver.name}`]
                              .filter(Boolean)
                              .join(' | ')}
                          </span>
                        )}
                      </div>
                      {/* lupa removida */}
                      <div className="notif-date">{formatDate(n.created_at)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page { min-height: 100vh; background: #f0f2f5; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; }

        .sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
        .sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
        .logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
        .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
        .nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
        .nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
        .user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
        .user-row:hover { background: rgba(255,255,255,0.07); }
        .avatar-sb { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
        .user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

        .content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

        .topbar { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .topbar-title { font-size: 16px; font-weight: 600; color: #01233F; }
        .topbar-sub { font-size: 12px; color: #6b7a8d; margin-top: 1px; font-weight: 400; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .icon-btn-top { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e6ea; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #01233F; transition: all 0.15s; position: relative; }
        .icon-btn-top:hover { background: #f0f2f5; }

        .main { display: flex; flex-direction: column; align-items: center; padding: 40px 20px; flex: 1; }

        .card { background: #ffffff; border-radius: 5px; width: 100%; max-width: 1000px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden; }
        .card-header { background: #01233F; padding: 16px 28px; text-align: center; }
        .card-title { font-size: 15px; font-weight: 900; color: #ffffff; letter-spacing: 3px; text-transform: uppercase; }

        .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #f0f0f0; gap: 12px; flex-wrap: wrap; }
        .filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn { height: 32px; padding: 0 14px; border-radius: 20px; border: 1.5px solid #e0e0e0; background: #fff; font-size: 12px; font-weight: 700; color: #666; cursor: pointer; letter-spacing: 0.5px; transition: all 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; gap: 6px; }
        .filter-btn:hover { border-color: #f1bb13; color: #1a1a1a; }
        .filter-btn.active { background: #01233F; border-color: #01233F; color: #ffffff; }
        .badge { background: #f1bb13; color: #fff; font-size: 10px; font-weight: 900; border-radius: 10px; padding: 1px 6px; line-height: 1.4; }
        .mark-all-btn { font-size: 11px; font-weight: 700; color: #888; background: none; border: none; cursor: pointer; text-decoration: underline; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; white-space: nowrap; }
        .mark-all-btn:hover { color: #01233F; }

        .notif-list { display: flex; flex-direction: column; }
        .empty { padding: 40px; text-align: center; color: #aaa; font-size: 13px; }
        .notif-row { display: flex; align-items: center; padding: 12px 20px; border-bottom: 1px solid #f5f5f5; cursor: pointer; gap: 12px; transition: background 0.12s; }
        .notif-row:hover { background: #fafafa; }
        .notif-row.read { opacity: 0.6; }
        .notif-check { flex-shrink: 0; }
        .checkbox { width: 16px; height: 16px; border: 1.5px solid #ccc; border-radius: 3px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: background 0.15s, border-color 0.15s; }
        .checkbox.checked { background: #01233F; border-color: #01233F; }
        .notif-icon-cell { flex-shrink: 0; width: 28px; text-align: center; font-size: 16px; }
        .notif-content { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .notif-title { font-size: 12px; font-weight: 800; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.3px; white-space: normal; }
        .notif-desc { font-size: 12px; font-weight: 500; color: #555; white-space: normal; line-height: 1.35; }
        .notif-meta { font-size: 11px; font-weight: 600; color: #8a8a8a; white-space: normal; }
        .notif-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .action-icon { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 4px; transition: background 0.15s; padding: 0; }
        .action-icon:hover { background: #f0f0f0; }
        .notif-date { font-size: 11px; color: #aaa; font-weight: 600; flex-shrink: 0; min-width: 48px; text-align: right; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .content-wrap { margin-left: 0; }
          .main { padding: 20px 16px; }
          .notif-title { white-space: normal; }
          .notif-desc { display: block; }
          .notif-meta { display: block; }
          .toolbar { padding: 10px 14px; }
          .notif-row { padding: 10px 14px; }
        }
      `}</style>
    </div>
  );
}

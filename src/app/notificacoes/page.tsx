"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";
import { useAuth } from "@/hooks";
import { notificationsService } from "@/services";
import { Notification as NotificationData, NotificationType as NotificationTypeEnum } from "@/types/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
function BusSideIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="38" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
      <rect x="3"  y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
      <rect x="13" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
      <rect x="23" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
      <rect x="38" y="5" width="3" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <circle cx="8"  cy="24" r="4" stroke="white" strokeWidth="1.8"/>
      <circle cx="30" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
      <line x1="0" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
    </svg>
  );
}
function BusFrontIcon({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5V15a2 2 0 0 1-1 1.732V18a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-.5H8V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1.268A2 2 0 0 1 4 15V6.5zM7.5 5A1.5 1.5 0 0 0 6 6.5V9h12V6.5A1.5 1.5 0 0 0 16.5 5h-9zM6 11v2h12v-2H6zm1.5 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  );
}
function RouteIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
    </svg>
  );
}
function DriverIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21a7 7 0 0 1 14 0H5z"/>
    </svg>
  );
}
function SchoolIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
      <path d="M5 13.18V17c0 2.21 3.13 4 7 4s7-1.79 7-4v-3.82l-7 3.82-7-3.82z"/>
    </svg>
  );
}
function DashIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
function FinanceIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a1 1 0 0 1 1 1v1.07C16.39 4.56 19 6.58 19 9c0 .55-.45 1-1 1s-1-.45-1-1c0-1.3-2.06-2.5-5-2.5S7 7.7 7 9s2.06 2.5 5 2.5c3.87 0 6 1.93 6 4.5 0 2.42-2.61 4.44-6 4.93V22a1 1 0 1 1-2 0v-1.07C6.61 20.44 4 18.42 4 16c0-.55.45-1 1-1s1 .45 1 1c0 1.3 2.06 2.5 5 2.5s5-1.2 5-2.5-2.06-2.5-5-2.5c-3.87 0-6-1.93-6-4.5C5 6.58 7.61 4.56 11 4.07V3a1 1 0 0 1 1-1z"/>
    </svg>
  );
}
function BellIconFilled({ size = 19, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a6 6 0 0 0-6 6c0 3.53-.88 5.7-1.76 7.04C3.46 16.43 3 17 3 17h18s-.46-.57-1.24-1.96C18.88 13.7 18 11.53 18 8a6 6 0 0 0-6-6z"/>
      <path d="M10.27 21a2 2 0 0 0 3.46 0H10.27z"/>
    </svg>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #01233F; --yellow: #f1bb13; --yellow-dark: #d9a700;
    --bg: #f0f2f5; --border: #e2e6ea; --muted: #6b7a8d;
    --red: #ef4444; --sidebar-w: 220px;
  }
  body { font-family: 'DM Sans', sans-serif; font-weight: 400; }
  .layout { display: flex; min-height: 100vh; background: var(--bg); }

  /* ── Loading ── */
  .loading-screen {
    position: fixed; inset: 0;
    background: #01233F;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; z-index: 9999;
  }
  .loading-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2.5px solid rgba(241,187,19,0.15);
    border-top-color: #f1bb13;
    animation: spin 0.8s cubic-bezier(0.4,0,0.2,1) infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label {
    font-size: 14px; font-weight: 600;
    color: rgba(255,255,255,0.75);
    letter-spacing: 1.5px; text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Sidebar ── */
  .sidebar { width: var(--sidebar-w); background: var(--navy); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { padding: 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; }
  .logo-image { width: 188px; max-width: 100%; height: auto; display: block; }
  .logo-texts { display: none; }
  .logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nav-item.active { background: var(--yellow); color: var(--navy); font-weight: 600; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 4px; }
  .user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .user-row:hover { background: rgba(255,255,255,0.07); }
  .avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* ── Content ── */
  .content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── Topbar ── */
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--navy); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; flex-shrink: 0; }
  .topbar-avatar:hover { border-color: var(--yellow-dark); }

  /* ── Body / Main ── */
  .body { padding: 40px 30px; display: flex; flex-direction: column; align-items: center; flex: 1; }

  /* ── Notification Card — mantido fiel ao original ── */
  .notif-card { background: #fff; border-radius: 5px; width: 100%; max-width: 1350px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden; }
  .notif-card-header { background: var(--navy); padding: 16px 28px; text-align: center; }
  .notif-card-title { font-size: 15px; font-weight: 900; color: #fff; letter-spacing: 3px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }

  .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #f0f0f0; gap: 12px; flex-wrap: wrap; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-btn { height: 32px; padding: 0 14px; border-radius: 20px; border: 1.5px solid #e0e0e0; background: #fff; font-size: 12px; font-weight: 700; color: #666; cursor: pointer; letter-spacing: 0.5px; transition: all 0.15s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; }
  .filter-btn:hover { border-color: var(--yellow); color: #1a1a1a; }
  .filter-btn.active { background: var(--navy); border-color: var(--navy); color: #fff; }
  .badge { background: var(--yellow); color: #fff; font-size: 10px; font-weight: 900; border-radius: 10px; padding: 1px 6px; line-height: 1.4; }
  .mark-all-btn { font-size: 11px; font-weight: 700; color: #888; background: none; border: none; cursor: pointer; text-decoration: underline; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
  .mark-all-btn:hover { color: var(--navy); }

  .notif-list { display: flex; flex-direction: column; }
  .empty { padding: 40px; text-align: center; color: #aaa; font-size: 13px; font-family: 'DM Sans', sans-serif; }
  .notif-row { display: flex; align-items: center; padding: 12px 20px; border-bottom: 1px solid #f5f5f5; cursor: pointer; gap: 12px; transition: background 0.12s; }
  .notif-row:hover { background: #fafafa; }
  .notif-row.read { opacity: 0.6; }
  .notif-check { flex-shrink: 0; }
  .checkbox { width: 16px; height: 16px; border: 1.5px solid #ccc; border-radius: 3px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: background 0.15s, border-color 0.15s; }
  .checkbox.checked { background: var(--navy); border-color: var(--navy); }
  .notif-icon-cell { flex-shrink: 0; width: 28px; text-align: center; font-size: 16px; }
  .notif-content { flex: 1; display: flex; align-items: center; gap: 16px; min-width: 0; }
  .notif-title { font-size: 12px; font-weight: 800; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; flex-shrink: 0; font-family: 'DM Sans', sans-serif; }
  .notif-desc { font-size: 12px; font-weight: 500; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'DM Sans', sans-serif; }
  .notif-date { font-size: 11px; color: #aaa; font-weight: 600; flex-shrink: 0; min-width: 48px; text-align: right; font-family: 'DM Sans', sans-serif; }

  .error-msg { padding: 20px; text-align: center; color: var(--red); font-family: 'DM Sans', sans-serif; font-size: 14px; }

  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .body { padding: 20px 16px; }
    .notif-title { white-space: normal; }
    .notif-desc { display: none; }
    .toolbar { padding: 10px 14px; }
    .notif-row { padding: 10px 14px; }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
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
  route_started:      "Motorista iniciou a rota",
  route_finished:     "Motorista finalizou a rota",
  route_delayed:      "Atraso registrado na rota",
  vehicle_changed:    "Veículo da rota alterado",
  route_maintenance:  "Ocorrência de manutenção na rota",
  checkpoint_reached: "Ponto de referência alcançado",
  driver_changed:     "Motorista da rota alterado",
  no_transport:       "Rota sem transporte disponível",
  expense_added:      "Despesa lançada na rota",
  route_assigned:     "Rota atribuída ao motorista",
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
  if (diffDays === 0) return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Ontem";
  if (diffDays > 1 && diffDays < 30) return `${diffDays}d atrás`;
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NotificacoesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const initial = (user?.name || user?.email || 'A')?.[0]?.toUpperCase();
  const [notifications, setNotifications] = useState<NotificationUI[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsService.getAll({ per_page: 50 });
      const formatted: NotificationUI[] = response.data.map((notif) => ({
        ...notif,
        title: TYPE_TITLES[notif.type],
        filter_category: FILTER_TYPE_MAPPING[notif.type],
      }));
      setNotifications(formatted);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
      setError("Erro ao carregar notificações");
    } finally {
      setLoading(false);
    }
  };

  const filtered = (activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.filter_category === activeFilter)
  ).reverse();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
    }
  };

  const toggleRead = async (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) return;
    if (!notification.read) {
      await markAsRead(id);
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false, read_at: null } : n))
      );
    }
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="loading-screen">
          <div className="loading-spinner" />
          <span className="loading-label">Carregando</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="layout">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <img src="/banneromnibus.png" alt="Omnibus" className="logo-image" />
            <div className="logo-texts">
              <div className="logo-text">Omnibus</div>
              <div className="logo-sub">Gestão Escolar</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <span className="nav-label">Principal</span>
            <button className="nav-item" onClick={() => router.push("/dashboard")}><DashIconFilled /> Dashboard</button>
            <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}><FinanceIconFilled /> Financeiro</button>
            <span className="nav-label">Cadastros</span>
            <button className="nav-item" onClick={() => router.push("/lista_onibus")}><BusFrontIcon /> Ônibus</button>
            <button className="nav-item" onClick={() => router.push("/lista_rotas")}><RouteIconFilled /> Rotas</button>
            <button className="nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIconFilled /> Motoristas</button>
            <button className="nav-item" onClick={() => router.push("/lista_escolas")}><SchoolIconFilled /> Escolas</button>
          </nav>
          <div className="sidebar-footer">
            <button className="user-row" onClick={() => router.push("/perfil")}> 
              <div className="avatar">{initial}</div>
              <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="content">
          {/* ── Topbar ── */}
          <header className="topbar">
            <div>
              <div className="topbar-title">Notificações</div>
              <div className="topbar-sub">Acompanhe os eventos do sistema</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled />
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">{initial}</div>
            </div>
          </header>

          {/* ── Conteúdo ── */}
          <div className="body">
            <div className="notif-card">
              <div className="notif-card-header">
                <div className="notif-card-title">Notificações</div>
              </div>

              {error && <div className="error-msg">{error}</div>}

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
                    </div>
                    <div className="notif-date">{formatDate(n.created_at)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useExpenses, useSpendingLimits } from "@/hooks";
import { notificationsService, routesService } from "@/services";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { Notification } from "@/types/api";

const kmChartData = [
  { rota: "Rota A", km: 1250, fill: "#01233F" }, { rota: "Rota B", km: 1180, fill: "#f1bb13" },
  { rota: "Rota C", km: 1420, fill: "#01233F" }, { rota: "Rota D", km: 1350, fill: "#f1bb13" },
  { rota: "Rota E", km: 1280, fill: "#01233F" }, { rota: "Rota F", km: 1520, fill: "#f1bb13" },
];

const defaultChartData = [
  { mes: "Jan", valor: 210000 }, { mes: "Fev", valor: 195000 },
  { mes: "Mar", valor: 220000 }, { mes: "Abr", valor: 205000 },
  { mes: "Mai", valor: 195000 }, { mes: "Jun", valor: 230000 },
  { mes: "Jul", valor: 215000 }, { mes: "Ago", valor: 240000 },
  { mes: "Set", valor: 225000 }, { mes: "Out", valor: 210000 },
  { mes: "Nov", valor: 220000 }, { mes: "Dez", valor: 130000 },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
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
function PlusIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

// Quick action icons (outline, for cards)
function BusIconOutline({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="2"/>
      <path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
      <circle cx="7" cy="20" r="2" fill={color} stroke={color}/>
      <circle cx="17" cy="20" r="2" fill={color} stroke={color}/>
      <path d="M5 18h14"/>
    </svg>
  );
}
function RouteIconOutline({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function DriverIconOutline({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
    </svg>
  );
}
function SchoolIconOutline({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

// ─── Notification type map ────────────────────────────────────────────────────
const NOTIFICATION_TYPE_MAP: Record<string, { icon: React.ReactElement; text: string; status: string }> = {
  route_started:      { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><circle cx="7" cy="18" r="1.5" fill="#01233F"/><circle cx="17" cy="18" r="1.5" fill="#01233F"/></svg>), text: "Motorista iniciou a rota", status: "new" },
  route_finished:     { icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>), text: "Motorista finalizou a rota", status: "new" },
  route_delayed:      { icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>), text: "Atraso registrado na rota", status: "warning" },
  vehicle_changed:    { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h13v8H3z"/><path d="M16 8l4 4-4 4"/></svg>), text: "Veículo da rota alterado", status: "update" },
  route_maintenance:  { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2l4 4-8 8-4 1 1-4 8-8z"/></svg>), text: "Ocorrência de manutenção na rota", status: "warning" },
  checkpoint_reached: { icon: (<svg width="14" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 5 5 9c0 6 7 13 7 13s7-7 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2" fill="#01233F"/></svg>), text: "Ponto de referência alcançado", status: "new" },
  driver_changed:     { icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/></svg>), text: "Motorista da rota alterado", status: "update" },
  no_transport:       { icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>), text: "Rota sem transporte disponível", status: "warning" },
  expense_added:      { icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M6 7h12"/></svg>), text: "Despesa lançada na rota", status: "new" },
  route_assigned:     { icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="6" rx="1"/><path d="M3 14h18v6H3z"/></svg>), text: "Rota atribuída ao motorista", status: "new" },
};

const STATUS_COLORS: Record<string, string> = { new: "#22c55e", update: "#3b82f6", warning: "#f59e0b" };
const STATUS_LABELS: Record<string, string> = { new: "Novo", update: "Atualização", warning: "Alerta" };

const quickActions = [
  { id: "bus",    label: "Novo Ônibus",    description: "Cadastrar veículo na frota", route: "/cadastro_onibus",    icon: "bus"    },
  { id: "route",  label: "Nova Rota",      description: "Criar rota de transporte",   route: "/cadastro_rota",      icon: "route"  },
  { id: "driver", label: "Novo Motorista", description: "Registrar motorista",        route: "/cadastro_motorista", icon: "driver" },
  { id: "school", label: "Nova Escola",    description: "Adicionar instituição",      route: "/cadastro_escola",    icon: "school" },
];

const QUICK_ICON_MAP: Record<string, (p: { size?: number; color?: string }) => React.ReactElement> = {
  bus: BusIconOutline, route: RouteIconOutline, driver: DriverIconOutline, school: SchoolIconOutline,
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #01233F; --yellow: #f1bb13; --yellow-dark: #d9a700;
    --bg: #f0f2f5; --card: #ffffff; --border: #e2e6ea;
    --text: #1a2535; --muted: #6b7a8d;
    --green: #22c55e; --red: #ef4444; --blue: #3b82f6;
    --sidebar-w: 220px;
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
  .logo-texts { display: flex; flex-direction: column; }
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

  /* ── Body ── */
  .body { padding: 28px 32px; display: flex; flex-direction: column; gap: 28px; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── Quick Actions ── */
  .quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .quick-card { background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.18s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; gap: 14px; position: relative; overflow: hidden; }
  .quick-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(241,187,19,0.18); border-color: var(--yellow); }
  .quick-card:active { transform: translateY(-1px); }
  .quick-top { display: flex; align-items: center; justify-content: space-between; }
  .quick-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(241,187,19,0.12); }
  .quick-plus { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0; transition: opacity 0.18s, transform 0.18s; transform: scale(0.8); background: rgba(241,187,19,0.15); }
  .quick-card:hover .quick-plus { opacity: 1; transform: scale(1); }
  .quick-label { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .quick-desc { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

  /* ── Charts ── */
  .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .card-badge { font-size: 11px; font-weight: 600; color: var(--muted); background: var(--bg); padding: 4px 10px; border-radius: 20px; }

  /* ── Metrics ── */
  .bottom-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .metric-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
  .metric-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .metric-header { display: flex; align-items: center; gap: 8px; }
  .metric-lbl { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
  .metric-val { font-size: 28px; font-weight: 800; color: var(--text); font-family: 'DM Mono', monospace; letter-spacing: -1px; margin-top: 4px; }
  .metric-desc { font-size: 11px; color: var(--muted); }

  /* ── Activity ── */
  .activity-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .activity-list { display: flex; flex-direction: column; gap: 0; margin-top: 4px; }
  .activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  .act-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .act-text { font-size: 12.5px; color: var(--text); font-weight: 500; line-height: 1.4; flex: 1; }
  .act-meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
  .act-time { font-size: 11px; color: var(--muted); }
  .act-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }

  .btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--yellow); border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px; }
  .btn-primary:hover { background: var(--yellow-dark); }

  @media (max-width: 1200px) {
    .charts-row { grid-template-columns: 1fr; }
    .quick-grid { grid-template-columns: repeat(2, 1fr); }
    .bottom-row { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .bottom-row { grid-template-columns: 1fr; }
    .quick-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffMinutes < 1) return "agora";
  if (diffMinutes < 60) return `há ${diffMinutes}m`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return "ontem";
  if (diffDays < 30) return `há ${diffDays}d`;
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") { const p = Number(value); return Number.isNaN(p) ? 0 : p; }
  return 0;
}

function formatMetricValue(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getCurrentPeriod() {
  const now = new Date();
  return { month: String(now.getMonth() + 1).padStart(2, "0"), year: String(now.getFullYear()) };
}

function getGreeting(name?: string): string {
  return name ? `Bem-vindo, ${name.split(" ")[0]}!` : "Bem-vindo!";
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#01233F", color: "#fff", fontSize: 12, padding: "8px 12px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <p style={{ fontWeight: 700, marginBottom: 2 }}>{label}</p>
        <p>R$ {payload[0].value.toLocaleString("pt-BR")}</p>
      </div>
    );
  }
  return null;
}

function CustomTooltipKm({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#01233F", color: "#fff", fontSize: 12, padding: "8px 12px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <p style={{ fontWeight: 700, marginBottom: 2 }}>{label}</p>
        <p>{payload[0].value} km</p>
      </div>
    );
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const initial = (user?.name || user?.email || 'A')?.[0]?.toUpperCase();
  const { expenses, fetchExpenses } = useExpenses(false);
  const { getLimitByPeriod } = useSpendingLimits(false);
  const [currentMonthLimit, setCurrentMonthLimit] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [distanceChartData, setDistanceChartData] = useState(kmChartData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchExpenses({ per_page: 1000 }),
        loadRecentNotifications(),
        loadDistanceChartData(),
      ]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!user?.id) { setCurrentMonthLimit(0); return; }
    const { month, year } = getCurrentPeriod();
    getLimitByPeriod(user.id, year, month)
      .then((limit) => {
        if (!limit) { setCurrentMonthLimit(0); return; }
        setCurrentMonthLimit(parseNumber((limit as any).limit_amount ?? (limit as any).limit_value));
      })
      .catch(() => setCurrentMonthLimit(0));
  }, [user?.id]);

  const loadDistanceChartData = async () => {
    try {
      const response = await routesService.getDistanceChart();
      const data = response?.data || [];
      if (data.length > 0) {
        setDistanceChartData(
          data.map((item: any, idx: number) => ({
            rota: item.rota,
            km: item.km,
            fill: idx % 2 === 0 ? "#01233F" : "#f1bb13",
          }))
        );
      }
    } catch { setDistanceChartData(kmChartData); }
  };

  const loadRecentNotifications = async () => {
    try {
      const response = await notificationsService.getAll({ per_page: 5 });
      setRecentNotifications(response.data || []);
    } catch { setRecentNotifications([]); }
  };

  const { currentMonthExpenses, minMonthExpenses, chartData: dynamicChartData } = useMemo(() => {
    const { month, year } = getCurrentPeriod();
    const monthlyTotals = new Map<string, number>();
    for (const expense of expenses ?? []) {
      const expenseDate = expense?.created_at ? new Date(expense.created_at) : null;
      if (!expenseDate || Number.isNaN(expenseDate.getTime())) continue;
      const expYear = expenseDate.getFullYear();
      const expMonth = String(expenseDate.getMonth() + 1).padStart(2, "0");
      const key = `${expYear}-${expMonth}`;
      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + parseNumber((expense as any).value));
    }
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const chartDataGenerated = monthNames.map((mes, index) => ({
      mes,
      valor: monthlyTotals.get(`${year}-${String(index + 1).padStart(2, "0")}`) ?? 0,
    }));
    const currentKey = `${year}-${month}`;
    const totals = Array.from(monthlyTotals.values());
    return {
      currentMonthExpenses: monthlyTotals.get(currentKey) ?? 0,
      minMonthExpenses: totals.length > 0 ? Math.min(...totals) : 0,
      chartData: chartDataGenerated.length > 0 ? chartDataGenerated : defaultChartData,
    };
  }, [expenses]);

  const dynamicFinancialMetrics = [
    { label: "META DE GASTOS",       value: `R$ ${formatMetricValue(currentMonthLimit)}`,    sub: "por mês",      color: "#01233F" },
    { label: "GASTOS DO MÊS ATUAL",  value: `R$ ${formatMetricValue(currentMonthExpenses)}`, sub: "em andamento", color: "#f1bb13" },
    { label: "MÊS COM MENOS GASTOS", value: `R$ ${formatMetricValue(minMonthExpenses)}`,     sub: "por mês",      color: "#22c55e" },
  ];

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
          </div>
          <nav className="sidebar-nav">
            <span className="nav-label">Principal</span>
            <button className="nav-item active" onClick={() => router.push("/dashboard")}><DashIconFilled /> Dashboard</button>
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
              <div className="topbar-title">{getGreeting((user as any)?.name)}</div>
              <div className="topbar-sub">
                Visão geral do sistema · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled /><span className="notif-dot" />
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">{initial}</div>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="body">

            {/* Quick Actions */}
            <div>
              <div className="section-header">
                <span className="section-title">Ações Rápidas</span>
              </div>
              <div className="quick-grid">
                {quickActions.map((action) => {
                  const Icon = QUICK_ICON_MAP[action.icon];
                  return (
                    <div key={action.id} className="quick-card" onClick={() => router.push(action.route)}>
                      <div className="quick-top">
                        <div className="quick-icon"><Icon size={22} color="#f1bb13" /></div>
                        <div className="quick-plus"><PlusIcon size={14} color="#f1bb13" /></div>
                      </div>
                      <div>
                        <div className="quick-label">{action.label}</div>
                        <div className="quick-desc">{action.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Charts */}
            <div className="charts-row">
              <div className="chart-card">
                <div className="card-header">
                  <span className="card-title">Gráfico de Gastos</span>
                  <span className="card-badge">{new Date().getFullYear()}</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#01233F" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#01233F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="valor" stroke="#01233F" strokeWidth={2.5}
                      fill="url(#colorValor)"
                      dot={{ r: 3, fill: "#01233F", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#f1bb13", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="card-header">
                  <span className="card-title">Quilometragem por Rota</span>
                  <span className="card-badge">{new Date().getFullYear()}</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={distanceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="rota" tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltipKm />} />
                    <Bar dataKey="km" radius={[6, 6, 0, 0]}>
                      {distanceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics */}
            <div className="bottom-row">
              {dynamicFinancialMetrics.map((m) => (
                <div key={m.label} className="metric-card">
                  <div className="metric-header">
                    <div className="metric-dot" style={{ background: m.color }} />
                    <span className="metric-lbl">{m.label}</span>
                  </div>
                  <div className="metric-val">{m.value}</div>
                  <div className="metric-desc">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="activity-card">
              <div className="card-header">
                <span className="card-title">Atividade Recente</span>
                <button className="btn-primary" onClick={() => router.push("/notificacoes")}>
                  Ver Todas as Notificações
                </button>
              </div>
              <div className="activity-list">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif, i) => {
                    const typeInfo = NOTIFICATION_TYPE_MAP[notif.type as keyof typeof NOTIFICATION_TYPE_MAP];
                    const statusInfo = STATUS_COLORS[typeInfo?.status]
                      ? { color: STATUS_COLORS[typeInfo.status], label: STATUS_LABELS[typeInfo.status] }
                      : { color: STATUS_COLORS.new, label: STATUS_LABELS.new };
                    return (
                      <div key={i} className="activity-item">
                        <div className="act-dot" style={{ background: statusInfo.color }} />
                        <div style={{ flex: 1 }}>
                          <div className="act-text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {typeInfo?.icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{typeInfo.icon}</span>}
                            <span>{typeInfo?.text || notif.message}</span>
                          </div>
                          <div className="act-meta">
                            <span className="act-time">{formatNotificationDate(notif.created_at)}</span>
                            <span className="act-badge" style={{ background: statusInfo.color + "20", color: statusInfo.color }}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "16px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
                    Nenhuma notificação recente
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
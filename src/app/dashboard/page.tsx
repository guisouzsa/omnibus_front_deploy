"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useExpenses, useSpendingLimits } from "@/hooks";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const chartData = [
  { mes: "Jan", valor: 210000 }, { mes: "Fev", valor: 195000 },
  { mes: "Mar", valor: 220000 }, { mes: "Abr", valor: 205000 },
  { mes: "Mai", valor: 195000 }, { mes: "Jun", valor: 230000 },
  { mes: "Jul", valor: 215000 }, { mes: "Ago", valor: 240000 },
  { mes: "Set", valor: 225000 }, { mes: "Out", valor: 210000 },
  { mes: "Nov", valor: 220000 }, { mes: "Dez", valor: 130000 },
];

const recentActivity = [
  { type: "bus",    text: "Ônibus #07 adicionado à frota",         time: "há 12 min",  status: "new"     },
  { type: "route",  text: "Rota Norte-Sul atualizada",             time: "há 45 min",  status: "update"  },
  { type: "driver", text: "Motorista Carlos Silva cadastrado",     time: "há 2 horas", status: "new"     },
  { type: "alert",  text: "Manutenção preventiva: Ônibus #03",     time: "há 3 horas", status: "warning" },
  { type: "route",  text: "Rota Leste desativada temporariamente", time: "há 5 horas", status: "warning" },
];

const quickActions = [
  { id: "bus",    label: "Novo Ônibus",    description: "Cadastrar veículo na frota", route: "/cadastro_onibus",    icon: "bus"    },
  { id: "route",  label: "Nova Rota",      description: "Criar rota de transporte",   route: "/cadastro_rota",      icon: "route"  },
  { id: "driver", label: "Novo Motorista", description: "Registrar motorista",        route: "/cadastro_motorista", icon: "driver" },
  { id: "school", label: "Nova Escola",    description: "Adicionar instituição",      route: "/cadastrar_escola",   icon: "school" },
];

function BusIcon({ size = 22, color = "currentColor" }: any) {
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
function RouteIcon({ size = 22, color = "currentColor" }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function DriverIcon({ size = 22, color = "currentColor" }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
      <path d="M8 7 Q12 3 16 7" fill="none"/>
    </svg>
  );
}
function SchoolIcon({ size = 22, color = "currentColor" }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function PlusIcon({ size = 16, color = "currentColor" }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function DashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function FinanceIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

const ICON_MAP: Record<string, (p: any) => JSX.Element> = {
  bus: BusIcon, route: RouteIcon, driver: DriverIcon, school: SchoolIcon,
};
const STATUS_COLORS: Record<string, string> = {
  new: "#22c55e", update: "#3b82f6", warning: "#f59e0b",
};
const STATUS_LABELS: Record<string, string> = {
  new: "Novo", update: "Atualização", warning: "Alerta",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #01233F;
    --yellow: #f1bb13;
    --yellow-dark: #d9a700;
    --bg: #f0f2f5;
    --card: #ffffff;
    --border: #e2e6ea;
    --text: #1a2535;
    --muted: #6b7a8d;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --sidebar-w: 220px;
  }

  body { font-family: 'DM Sans', sans-serif; }
  .db-layout { display: flex; min-height: 100vh; background: var(--bg); }

  .db-sidebar { width: var(--sidebar-w); background: var(--navy); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .db-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .db-logo-icon { width: 34px; height: 34px; background: var(--yellow); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .db-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .db-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .db-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .db-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .db-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .db-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .db-nav-item.active { background: var(--yellow); color: var(--navy); font-weight: 600; }
  .db-nav-item.active svg { stroke: var(--navy); }

  .db-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 4px; }
  .db-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: background 0.15s; border: none; background: none; width: 100%; text-align: left; }
  .db-user-row:hover { background: rgba(255,255,255,0.07); }
  .db-avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); flex-shrink: 0; }
  .db-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .db-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }
  .db-logout-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; border-radius: 8px; border: none; background: none; color: rgba(255,255,255,0.35); font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; }
  .db-logout-btn:hover { background: rgba(239,68,68,0.15); color: #ef4444; }

  .db-content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .db-topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .db-topbar-title { font-size: 18px; font-weight: 700; color: var(--text); }
  .db-topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .db-topbar-right { display: flex; align-items: center; gap: 12px; }
  .db-icon-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text); transition: all 0.15s; position: relative; }
  .db-icon-btn:hover { background: var(--bg); }
  .db-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 1.5px solid #fff; }

  .db-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 28px; }
  .db-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .db-section-title { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  .db-quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .db-quick-card { background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; gap: 14px; position: relative; overflow: hidden; }
  .db-quick-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(241,187,19,0.18); border-color: var(--yellow); }
  .db-quick-card:active { transform: translateY(-1px); }
  .db-quick-top { display: flex; align-items: center; justify-content: space-between; }
  .db-quick-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(241,187,19,0.12); }
  .db-quick-plus { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0; transition: opacity 0.18s, transform 0.18s; transform: scale(0.8); background: rgba(241,187,19,0.15); }
  .db-quick-card:hover .db-quick-plus { opacity: 1; transform: scale(1); }
  .db-quick-label { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .db-quick-desc { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

  .db-chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .db-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .db-card-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .db-card-badge { font-size: 11px; font-weight: 600; color: var(--muted); background: var(--bg); padding: 4px 10px; border-radius: 20px; }

  .db-bottom-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .db-metric-new { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
  .db-metric-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .db-metric-header { display: flex; align-items: center; gap: 8px; }
  .db-metric-lbl { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
  .db-metric-val { font-size: 28px; font-weight: 800; color: var(--text); font-family: 'DM Mono', monospace; letter-spacing: -1px; margin-top: 4px; }
  .db-metric-desc { font-size: 11px; color: var(--muted); }

  .db-activity-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; }
  .db-activity-list { display: flex; flex-direction: column; gap: 0; margin-top: 4px; }
  .db-activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .db-activity-item:last-child { border-bottom: none; }
  .db-act-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .db-act-text { font-size: 12.5px; color: var(--text); font-weight: 500; line-height: 1.4; flex: 1; }
  .db-act-meta { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
  .db-act-time { font-size: 11px; color: var(--muted); }
  .db-act-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }

  .db-btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--yellow); border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px; }
  .db-btn-primary:hover { background: var(--yellow-dark); }

  @media (max-width: 1200px) {
    .db-quick-grid { grid-template-columns: repeat(2, 1fr); }
    .db-bottom-row { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 900px) {
    .db-bottom-row { grid-template-columns: 1fr; }
    .db-quick-grid { grid-template-columns: repeat(2, 1fr); }
    :root { --sidebar-w: 0px; }
    .db-sidebar { display: none; }
  }
`;

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

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { expenses, fetchExpenses } = useExpenses(false);
  const { getLimitByPeriod } = useSpendingLimits(false);
  const [currentMonthLimit, setCurrentMonthLimit] = useState(0);
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  useEffect(() => { fetchExpenses({ per_page: 1000 }); }, []);

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

  const { currentMonthExpenses, minMonthExpenses } = useMemo(() => {
    const { month, year } = getCurrentPeriod();
    const monthlyTotals = new Map<string, number>();
    for (const expense of expenses ?? []) {
      const expenseDate = expense?.created_at ? new Date(expense.created_at) : null;
      if (!expenseDate || Number.isNaN(expenseDate.getTime())) continue;
      const key = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + parseNumber((expense as any).value));
    }
    const currentKey = `${year}-${month}`;
    const totals = Array.from(monthlyTotals.values());
    return {
      currentMonthExpenses: monthlyTotals.get(currentKey) ?? 0,
      minMonthExpenses: totals.length > 0 ? Math.min(...totals) : 0,
    };
  }, [expenses]);

  const dynamicFinancialMetrics = [
    { label: "META DE GASTOS",       value: `R$ ${formatMetricValue(currentMonthLimit)}`,    sub: "por mês",      color: "#01233F" },
    { label: "GASTOS DO MÊS ATUAL",  value: `R$ ${formatMetricValue(currentMonthExpenses)}`, sub: "em andamento", color: "#f1bb13" },
    { label: "MÊS COM MENOS GASTOS", value: `R$ ${formatMetricValue(minMonthExpenses)}`,     sub: "por mês",      color: "#22c55e" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="db-layout">

        <aside className="db-sidebar">
          <div className="db-sidebar-logo">
            <div className="db-logo-icon"><BusIcon size={18} color="#01233F" /></div>
            <div>
              <div className="db-logo-text">Omnibus</div>
              <div className="db-logo-sub">Gestão Escolar</div>
            </div>
          </div>

          <nav className="db-nav">
            <span className="db-nav-label">Principal</span>
            <button className={`db-nav-item ${activeNav === "dashboard" ? "active" : ""}`} onClick={() => { setActiveNav("dashboard"); router.push("/dashboard"); }}>
              <DashIcon /> Dashboard
            </button>
            <button className={`db-nav-item ${activeNav === "financeiro" ? "active" : ""}`} onClick={() => { setActiveNav("financeiro"); router.push("/visualizar_gastos"); }}>
              <FinanceIcon /> Financeiro
            </button>
            <span className="db-nav-label">Cadastros</span>
            <button className="db-nav-item" onClick={() => router.push("/lista_onibus")}><BusIcon size={17} /> Ônibus</button>
            <button className="db-nav-item" onClick={() => router.push("/lista_rotas")}><RouteIcon size={17} /> Rotas</button>
            <button className="db-nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIcon size={17} /> Motoristas</button>
            <button className="db-nav-item" onClick={() => router.push("/lista_escolas")}><SchoolIcon size={17} /> Escolas</button>
          </nav>

          <div className="db-sidebar-footer">
            <button className="db-user-row" onClick={() => router.push("/perfil")}>
              <div className="db-avatar">A</div>
              <div>
                <div className="db-user-name">Admin</div>
                <div className="db-user-role">Gestor</div>
              </div>
            </button>
            <button className="db-logout-btn" onClick={handleLogout}>
              <LogoutIcon />
              Sair
            </button>
          </div>
        </aside>

        <div className="db-content">
          <header className="db-topbar">
            <div>
              <div className="db-topbar-title">{getGreeting((user as any)?.name)}</div>
              <div className="db-topbar-sub">
                Visão geral do sistema · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="db-topbar-right">
              <button className="db-icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIcon /><span className="db-notif-dot" />
              </button>
              <button className="db-icon-btn" onClick={() => router.push("/perfil")} title="Perfil">
                <UserIcon />
              </button>
            </div>
          </header>

          <div className="db-body">

            <div>
              <div className="db-section-header">
                <span className="db-section-title">Ações Rápidas</span>
              </div>
              <div className="db-quick-grid">
                {quickActions.map((action) => {
                  const Icon = ICON_MAP[action.icon];
                  return (
                    <div key={action.id} className="db-quick-card" onClick={() => router.push(action.route)}>
                      <div className="db-quick-top">
                        <div className="db-quick-icon"><Icon size={22} color="#f1bb13" /></div>
                        <div className="db-quick-plus"><PlusIcon size={14} color="#f1bb13" /></div>
                      </div>
                      <div>
                        <div className="db-quick-label">{action.label}</div>
                        <div className="db-quick-desc">{action.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="db-chart-card">
              <div className="db-card-header">
                <span className="db-card-title">Gráfico de Gastos</span>
                <span className="db-card-badge">2025</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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

            <div className="db-bottom-row">
              {dynamicFinancialMetrics.map((m) => (
                <div key={m.label} className="db-metric-new">
                  <div className="db-metric-header">
                    <div className="db-metric-dot" style={{ background: m.color }} />
                    <span className="db-metric-lbl">{m.label}</span>
                  </div>
                  <div className="db-metric-val">{m.value}</div>
                  <div className="db-metric-desc">{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="db-activity-card">
              <div className="db-card-header">
                <span className="db-card-title">Atividade Recente</span>
                <button className="db-btn-primary" onClick={() => router.push("/visualizar_gastos")}>
                  Visualizar Gastos
                </button>
              </div>
              <div className="db-activity-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="db-activity-item">
                    <div className="db-act-dot" style={{ background: STATUS_COLORS[a.status] }} />
                    <div style={{ flex: 1 }}>
                      <div className="db-act-text">{a.text}</div>
                      <div className="db-act-meta">
                        <span className="db-act-time">{a.time}</span>
                        <span className="db-act-badge" style={{ background: STATUS_COLORS[a.status] + "20", color: STATUS_COLORS[a.status] }}>
                          {STATUS_LABELS[a.status]}
                        </span>
                      </div>
                    </div>
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
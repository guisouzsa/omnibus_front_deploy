"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { expensesService } from "@/services/expenses.service";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────
const systemStatus = [
  { id: "buses",   label: "Ônibus\ncadastrados",    value: 42, icon: "bus"    },
  { id: "routes",  label: "Rotas\ncadastradas",     value: 18, icon: "route"  },
  { id: "drivers", label: "Motoristas\ncadastrados", value: 97, icon: "driver" },
];

const chartData = [
  { mes: "Jan", valor: 210000 },
  { mes: "Fev", valor: 280000 },
  { mes: "Mar", valor: 260000 },
  { mes: "Abr", valor: 230000 },
  { mes: "Mai", valor: 195000 },
  { mes: "Jun", valor: 310000 },
  { mes: "Jul", valor: 340000 },
  { mes: "Ago", valor: 315000 },
  { mes: "Set", valor: 270000 },
  { mes: "Out", valor: 255000 },
  { mes: "Nov", valor: 260000 },
  { mes: "Dez", valor: 130000 },
];

// ─── SVG Icons inline ─────────────────────────────────────────────────────────
function BusIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="2"/>
      <path d="M2 9h20"/>
      <path d="M8 4V2"/>
      <path d="M16 4V2"/>
      <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/>
      <circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/>
      <path d="M5 18h14"/>
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

function DriverIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
      <path d="M8 7 Q12 3 16 7" fill="none"/>
    </svg>
  );
}

const ICON_COMPONENTS: Record<string, () => React.ReactNode> = {
  bus:    BusIcon,
  route:  RouteIcon,
  driver: DriverIcon,
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .db-page { min-height: 100vh; background: #f9f9f9; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }

  /* NAVBAR */
  .db-navbar { width: 100%; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 56px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .db-nav-links { display: flex; align-items: center; gap: 28px; }
  .db-nav-link { font-size: 13px; font-weight: 700; color: #01233F; letter-spacing: 0.5px; text-transform: uppercase; background: none; border: none; cursor: pointer; padding: 16px 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; border-bottom: 2px solid transparent; transition: color 0.15s; }
  .db-nav-link:hover { color: #888; }
  .db-nav-link.active { color: #01233F; }
  .db-nav-link.active:hover { color: #888; }
  .db-nav-right { display: flex; align-items: center; gap: 16px; }
  .db-notif-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  .db-notif-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; color: #01233F; transition: opacity 0.15s; }
  .db-notif-btn:hover { opacity: 0.7; }
  .db-user-btn { background: #01233F; width: 36px; height: 36px; border: 2px solid #01233F; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: opacity 0.15s; padding: 0; color: #fff; }
  .db-user-btn:hover { opacity: 0.8; }

  /* MAIN */
  .db-main { max-width: 900px; margin: 0 auto; padding: 32px 24px; }

  /* SECTION TITLE */
  .db-section-title { font-size: 15px; font-weight: 800; color: #01233F; letter-spacing: 0.5px; margin-bottom: 16px; }

  /* STATUS CARDS */
  .db-status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
  .db-status-card { position: relative; display: flex; align-items: center; height: 96px; background: #fff; border: 1px solid #e8e8e8; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); cursor: pointer; transition: box-shadow 0.15s; }
  .db-status-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .db-status-bar { position: absolute; left: 0; top: 0; height: 100%; width: 8px; background: #f1bb13; }
  .db-status-inner { display: flex; align-items: center; width: 100%; padding-left: 24px; padding-right: 16px; }
  .db-status-icon { width: 56px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .db-status-icon img { width: 40px; height: 40px; object-fit: contain; }
  .db-status-divider { width: 1px; height: 40px; background: #e8e8e8; margin: 0 20px; flex-shrink: 0; }
  .db-status-text { font-size: 13px; color: #555; white-space: pre-line; line-height: 1.4; }

  /* CHART SECTION */
  .db-chart-wrap { display: flex; gap: 20px; align-items: stretch; }
  .db-chart-box { flex: 1; background: #fff; border: 1px solid #e8e8e8; border-radius: 6px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .db-metrics-col { width: 272px; display: flex; flex-direction: column; gap: 12px; }

  /* METRIC CARDS */
  .db-metric-card { display: flex; align-items: center; background: #fff; border: 1px solid #e8e8e8; border-radius: 5px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .db-metric-bar { width: 8px; align-self: stretch; flex-shrink: 0; background: #01233F; }
  .db-metric-label { flex: 1; padding: 14px 14px; font-size: 11px; font-weight: 800; color: #01233F; letter-spacing: 0.8px; text-transform: uppercase; }
  .db-metric-value-wrap { text-align: right; padding: 14px 14px; flex-shrink: 0; }
  .db-metric-value { font-size: 22px; font-weight: 900; color: #01233F; line-height: 1; }
  .db-metric-sub { font-size: 9px; color: #aaa; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 4px; }

  /* CADASTRAR GASTOS BTN */
  .db-btn-gastos { width: 100%; background: #f1bb13; border: none; border-radius: 5px; padding: 12px 0; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .db-btn-gastos:hover { background: #dba900; }

  @media (max-width: 768px) {
    .db-status-grid { grid-template-columns: 1fr; }
    .db-chart-wrap { flex-direction: column; }
    .db-metrics-col { width: 100%; }
    .db-main { padding: 20px 16px; }
  }
`;

// ─── Tooltip do gráfico ───────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#01233F", color: "#fff", fontSize: 12, padding: "8px 12px", borderRadius: 5 }}>
        <p style={{ fontWeight: 700 }}>{label}</p>
        <p>R$ {payload[0].value.toLocaleString("pt-BR")}</p>
      </div>
    );
  }
  return null;
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function formatMetricValue(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function getCurrentPeriod() {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: String(now.getFullYear()),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentMonthLimit, setCurrentMonthLimit] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [minMonthExpenses, setMinMonthExpenses] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setCurrentMonthLimit(0);
      return;
    }

    expensesService
      .getDashboardSummary()
      .then((summary) => {
        setCurrentMonthExpenses(parseNumber(summary?.current_month_expenses));
        setMinMonthExpenses(parseNumber(summary?.min_month_expenses));
        setCurrentMonthLimit(parseNumber(summary?.current_month_limit));
      })
      .catch(() => {
        setCurrentMonthExpenses(0);
        setMinMonthExpenses(0);
        setCurrentMonthLimit(0);
      });
  }, [user?.id]);

  const financialMetrics = [
    { label: "META DE GASTOS", value: formatMetricValue(currentMonthLimit), sub: "POR MÊS" },
    { label: "GASTOS DO MÊS ATUAL", value: formatMetricValue(currentMonthExpenses), sub: "EM ANDAMENTO" },
    { label: "MÊS COM MENOS GASTOS", value: formatMetricValue(minMonthExpenses), sub: "POR MÊS" },
  ];

  const handleCardClick = (id: string) => {
    if (id === "buses")   router.push("/lista_onibus");
    if (id === "routes")  router.push("/lista_rotas");
    if (id === "drivers") router.push("/lista_motoristas");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="db-page">

        {/* NAVBAR */}
        <nav className="db-navbar">
          <div className="db-nav-links">
            <button className="db-nav-link active" onClick={() => router.push("/dashboard")}>DASHBOARD</button>
            <button className="db-nav-link" onClick={() => router.push("/financeiro")}>FINANCEIRO</button>
          </div>
          <div className="db-nav-right">
            <div className="db-notif-wrap">
              <button className="db-notif-btn" title="Notificações" onClick={() => router.push("/notifications")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </div>
            <button className="db-user-btn" title="Usuário" onClick={() => router.push("/infor_instituicao")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="db-main">

          {/* STATUS DO SISTEMA */}
          <p className="db-section-title">Status do sistema</p>
          <div className="db-status-grid">
            {systemStatus.map((s) => {
              const IconComp = ICON_COMPONENTS[s.icon];
              return (
              <div key={s.id} className="db-status-card" onClick={() => handleCardClick(s.id)}>
                <div className="db-status-bar" />
                <div className="db-status-inner">
                  <div className="db-status-icon">
                    <IconComp />
                  </div>
                  <div className="db-status-divider" />
                  <p className="db-status-text">{s.label}</p>
                </div>
              </div>
              );
            })}
          </div>

          {/* GRÁFICO DE GASTOS */}
          <p className="db-section-title">Gráfico de gastos</p>
          <div className="db-chart-wrap">

            {/* Gráfico */}
            <div className="db-chart-box">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c7d7f5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#c7d7f5" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#01233F"
                    strokeWidth={2.5}
                    fill="url(#colorValor)"
                    dot={{ r: 3, fill: "#01233F", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#f1bb13" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Métricas */}
            <div className="db-metrics-col">
              {financialMetrics.map((m) => (
                <div key={m.label} className="db-metric-card">
                  <div className="db-metric-bar" />
                  <p className="db-metric-label">{m.label}</p>
                  <div className="db-metric-value-wrap">
                    <p className="db-metric-value">{m.value}</p>
                    <p className="db-metric-sub">{m.sub}</p>
                  </div>
                </div>
              ))}
              <button className="db-btn-gastos" onClick={() => router.push("/visualizar_gastos")}>
                VISUALIZAR GASTOS
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
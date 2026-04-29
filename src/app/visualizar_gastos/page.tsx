"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useExpenses, useSpendingLimits } from "@/hooks";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

// ─── Icons sidebar ────────────────────────────────────────────────────────────
function BusIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
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
function RouteIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function DriverIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
    </svg>
  );
}
function SchoolIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function FinanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
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
function UserCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

// ─── Icons tabela ─────────────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
    </svg>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

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
    --sidebar-w: 220px;
  }

  body { font-family: 'DM Sans', sans-serif; }

  .gc-layout { display: flex; min-height: 100vh; background: var(--bg); }

  .gc-sidebar {
    width: var(--sidebar-w);
    background: var(--navy);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100;
  }
  .gc-sidebar-logo {
    padding: 24px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; gap: 10px;
  }
  .gc-logo-icon {
    width: 34px; height: 34px; background: var(--yellow);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .gc-logo-text { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .gc-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 500; margin-top: 1px; }
  .gc-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
  .gc-nav-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 12px 0 6px; }
  .gc-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,0.55);
    cursor: pointer; border: none; background: none;
    width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .gc-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .gc-nav-item.active { background: var(--yellow); color: var(--navy); }
  .gc-nav-item.active svg { stroke: var(--navy); }
  .gc-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .gc-user-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    cursor: pointer; transition: background 0.15s;
    border: none; background: none; width: 100%; text-align: left;
  }
  .gc-user-row:hover { background: rgba(255,255,255,0.07); }
  .gc-avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: var(--navy); flex-shrink: 0; }
  .gc-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .gc-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  .gc-content-wrap { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .gc-topbar {
    background: #fff; border-bottom: 1px solid var(--border);
    padding: 0 32px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .gc-topbar-title { font-size: 18px; font-weight: 700; color: var(--text); }
  .gc-topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .gc-topbar-right { display: flex; align-items: center; gap: 12px; }
  .gc-icon-btn {
    width: 38px; height: 38px; border-radius: 8px;
    border: 1px solid var(--border); background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text); transition: all 0.15s; position: relative;
  }
  .gc-icon-btn:hover { background: var(--bg); }
  .gc-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 1.5px solid #fff; }

  .gc-page { min-height: 100vh; background: #f9f9f9; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .gc-main { padding: 32px 40px; }
  .gc-content { width: 100%; }

  .gc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; width: 100%; }
  .gc-btn-wrap { position: relative; flex-shrink: 0; }
  .gc-btn-meta { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .gc-btn-meta:hover { background: #dba900; }
  .gc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; flex: 1; text-align: center; }
  .gc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .gc-btn-cadastrar:hover { background: #dba900; }

  .gc-popover { position: absolute; top: calc(100% + 8px); left: 0; background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 16px; min-width: 220px; z-index: 100; }
  .gc-popover-right { left: auto; right: 0; }
  .gc-popover-label { font-size: 11px; font-weight: 800; color: #01233F; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .gc-meta-display { background: #f9f9f9; border: 1px solid #e8e8e8; border-radius: 5px; padding: 12px 14px; }
  .gc-meta-display-value { font-size: 20px; font-weight: 900; color: #01233F; line-height: 1; }
  .gc-meta-display-sub { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .gc-popover-input { width: 100%; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 8px 10px; font-size: 13px; color: #333; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; outline: none; margin-bottom: 10px; box-sizing: border-box; }
  .gc-popover-input:focus { border-color: #f1bb13; }
  .gc-popover-save { width: 100%; background: none; border: 1.5px solid #f1bb13; border-radius: 4px; padding: 8px 0; font-size: 12px; font-weight: 900; color: #f1bb13; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .gc-popover-save:hover { background: #f1bb13; color: #fff; }
  .gc-popover-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .gc-popover-msg { font-size: 11px; margin-top: 8px; }
  .gc-popover-error { color: #c0392b; }
  .gc-popover-success { color: #27ae60; }
  .gc-meta-loading { font-size: 12px; color: #aaa; }

  .gc-table-wrap { width: 100%; overflow-x: auto; border-radius: 4px; }
  .gc-table { width: 100%; border-collapse: collapse; }
  .gc-table thead tr { background: #01233F; }
  .gc-table thead th { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 14px 18px; text-align: left; }
  .gc-table tbody tr { border-bottom: 1px solid #e8e8e8; background: #fff; }
  .gc-table tbody tr:hover { background: #fafafa; }
  .gc-table tbody td { padding: 14px 18px; font-size: 13px; color: #333; }
  .gc-td-bold { font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 12px; }
  .gc-td-value { font-weight: 800; color: #01233F; font-size: 13px; }
  .gc-td-ops { display: flex; align-items: center; gap: 14px; }
  .gc-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .gc-btn-excluir:hover { opacity: 0.7; }
  .gc-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .gc-btn-editar:hover { opacity: 0.6; }
  .gc-btn-download { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 700; color: #01233F; text-decoration: underline; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .gc-btn-download:hover { opacity: 0.6; }
  .gc-no-receipt { font-size: 12px; color: #bbb; font-style: italic; }
  .gc-feedback { text-align: center; font-size: 14px; padding: 32px; color: #aaa; }
  .gc-feedback.error { color: #c0392b; }

  .gc-alert { 
    margin-bottom: 20px; 
    padding: 16px 20px; 
    border-radius: 8px;
    display: flex; 
    align-items: center; 
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    border-left: 5px solid;
  }
  .gc-alert-warning { 
    background: #fff8e1; 
    border-color: #f1bb13;
    color: #856404;
  }
  .gc-alert-danger { 
    background: #ffe5e5; 
    border-color: #c0392b;
    color: #721c24;
  }
  .gc-alert-icon {
    font-size: 20px;
    flex-shrink: 0;
  }
  .gc-alert-content {
    flex: 1;
  }
  .gc-alert-title {
    font-weight: 800;
    margin-bottom: 2px;
  }
  .gc-alert-message {
    font-weight: 500;
    font-size: 13px;
  }

  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .gc-sidebar { display: none; }
    .gc-content-wrap { margin-left: 0; }
  }
  @media (max-width: 700px) {
    .gc-main { padding: 20px 16px; }
    .gc-top-bar { flex-wrap: wrap; }
    .gc-title { text-align: left; flex: none; width: 100%; order: -1; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getCurrentPeriod() {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: String(now.getFullYear()),
  };
}

function getProofUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function getLimitAmount(limit: { limit_amount?: number | string; limit_value?: number | string } | null) {
  if (!limit) return 0;
  if (typeof limit.limit_amount === "number") return limit.limit_amount;
  if (typeof limit.limit_amount === "string") {
    const parsed = Number(limit.limit_amount);
    if (!Number.isNaN(parsed)) return parsed;
  }
  if (typeof limit.limit_value === "number") return limit.limit_value;
  if (typeof limit.limit_value === "string") {
    const parsed = Number(limit.limit_value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GastosCadastradosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    expenses,
    loading,
    error,
    deleteExpense: deleteExpenseItem,
  } = useExpenses();
  const { getLimitByPeriod, createLimit, updateLimit } = useSpendingLimits(false);

  const [limitId, setLimitId] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState("financeiro");

  const [showMeta, setShowMeta]       = useState(false);
  const [meta, setMeta]               = useState<number | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError]     = useState<string | null>(null);

  const [showForm, setShowForm]         = useState(false);
  const [metaInput, setMetaInput]       = useState("");
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess]   = useState(false);

  const metaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const hasLoadedMetaRef = useRef(false);

  // Carregar meta automaticamente ao abrir a página
  useEffect(() => {
    if (!user || hasLoadedMetaRef.current) return;
    
    hasLoadedMetaRef.current = true;
    setMetaLoading(true);
    
    const { month, year } = getCurrentPeriod();
    getLimitByPeriod(user.id, year, month)
      .then((limit) => {
        if (limit) {
          setMeta(getLimitAmount(limit));
          setLimitId(limit.id);
        } else {
          setMeta(null);
          setLimitId(null);
        }
      })
      .catch(() => {
        setMeta(null);
        setLimitId(null);
      })
      .finally(() => setMetaLoading(false));
  }, [user]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (metaRef.current && !metaRef.current.contains(e.target as Node)) setShowMeta(false);
      if (formRef.current && !formRef.current.contains(e.target as Node)) setShowForm(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const handleOpenMeta = () => {
    setShowForm(false);
    const opening = !showMeta;
    setShowMeta(opening);

    if (opening) {
      if (!user) {
        setMeta(null);
        setLimitId(null);
        setMetaError("Usuário não autenticado.");
        return;
      }

      setMetaLoading(true);
      setMetaError(null);

      const { month, year } = getCurrentPeriod();
      getLimitByPeriod(user.id, year, month)
        .then((limit) => {
          if (limit) {
            setMeta(getLimitAmount(limit));
            setLimitId(limit.id);
            return;
          }
          setMeta(null);
          setLimitId(null);
          setMetaError("Nenhuma meta cadastrada para este mês.");
        })
        .catch(() => setMetaError("Erro ao carregar meta de gastos."))
        .finally(() => setMetaLoading(false));
    }
  };

  const handleOpenForm = () => {
    setShowMeta(false);
    const opening = !showForm;
    setShowForm(opening);
    
    if (opening) {
      // Se abre o formulário, carrega a meta existente para edição
      if (!user) {
        setSaveError("Usuário não autenticado.");
        return;
      }

      setMetaLoading(true);
      setSaveError(null);
      setSaveSuccess(false);

      const { month, year } = getCurrentPeriod();
      getLimitByPeriod(user.id, year, month)
        .then((limit) => {
          if (limit) {
            const amount = getLimitAmount(limit);
            setMeta(amount);
            setLimitId(limit.id);
            setMetaInput(amount.toString());
            return;
          }
          // Se não houver meta, deixa o formulário vazio para criar nova
          setMeta(null);
          setLimitId(null);
          setMetaInput("");
        })
        .catch(() => setSaveError("Erro ao carregar meta de gastos."))
        .finally(() => setMetaLoading(false));
    } else {
      setMetaInput("");
      setSaveError(null);
      setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    const parsed = parseFloat(metaInput.replace(/\./g, "").replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) { setSaveError("Informe um valor válido."); return; }
    if (!user) { setSaveError("Usuário não autenticado."); return; }

    setSaving(true); setSaveError(null); setSaveSuccess(false);

    try {
      if (limitId) {
        await updateLimit(limitId, { limit_amount: parsed });
      } else {
        const created = await createLimit({
          user_id: user.id,
          limit_amount: parsed,
        });
        if (created?.data?.id) {
          setLimitId(created.data.id);
        }
      }
      setSaveSuccess(true);
      setMeta(parsed);
      setMetaInput("");
    } catch (err: any) {
      const apiMessage = err?.response?.message;
      const validationErrors = err?.response?.errors as Record<string, string[]> | undefined;
      const firstValidationMessage = validationErrors
        ? Object.values(validationErrors)[0]?.[0]
        : null;
      setSaveError(firstValidationMessage || apiMessage || "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExpenseItem(id);
    } catch {
      alert("Erro ao excluir gasto. Tente novamente.");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="gc-layout">

        {/* ── SIDEBAR ── */}
        <aside className="gc-sidebar">
          <div className="gc-sidebar-logo">
            <div className="gc-logo-icon">
              <BusIcon size={18} color="#01233F" />
            </div>
            <div>
              <div className="gc-logo-text">Omnibus</div>
              <div className="gc-logo-sub">Gestão Escolar</div>
            </div>
          </div>

          <nav className="gc-nav">
            <span className="gc-nav-label">Principal</span>
            <button
              className={`gc-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
              onClick={() => { setActiveNav("dashboard"); router.push("/dashboard"); }}
            >
              <DashIcon /> Dashboard
            </button>
            <button
              className={`gc-nav-item ${activeNav === "financeiro" ? "active" : ""}`}
              onClick={() => { setActiveNav("financeiro"); router.push("/visualizar_gastos"); }}
            >
              <FinanceIcon /> Financeiro
            </button>

            <span className="gc-nav-label">Cadastros</span>
            <button className="gc-nav-item" onClick={() => router.push("/lista_onibus")}>
              <BusIcon size={18} /> Ônibus
            </button>
            <button className="gc-nav-item" onClick={() => router.push("/lista_rotas")}>
              <RouteIcon size={18} /> Rotas
            </button>
            <button className="gc-nav-item" onClick={() => router.push("/lista_motoristas")}>
              <DriverIcon size={18} /> Motoristas
            </button>
            <button className="gc-nav-item" onClick={() => router.push("/lista_escolas")}>
              <SchoolIcon size={18} /> Escolas
            </button>
          </nav>

          <div className="gc-sidebar-footer">
            <button className="gc-user-row" onClick={() => router.push("/perfil")}>
              <div className="gc-avatar">A</div>
              <div>
                <div className="gc-user-name">Admin</div>
                <div className="gc-user-role">Gestor</div>
              </div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        {/* ── CONTENT ── */}
        <div className="gc-content-wrap">

          {/* ── TOPBAR — rotas corrigidas ✅ ── */}
          <header className="gc-topbar">
            <div>
              <div className="gc-topbar-title">Financeiro</div>
              <div className="gc-topbar-sub">
                Gastos cadastrados · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="gc-topbar-right">
              {/* ✅ era /notifications → corrigido para /notificacoes */}
              <button className="gc-icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIcon />
                <span className="gc-notif-dot" />
              </button>
              {/* ✅ era /infor_instituicao → corrigido para /perfil */}
              <button className="gc-icon-btn" onClick={() => router.push("/perfil")} title="Perfil">
                <UserCircleIcon />
              </button>
            </div>
          </header>

          {/* ── CONTEÚDO ── */}
          <div className="gc-page">
            <main className="gc-main">
              <div className="gc-content">

                <div className="gc-top-bar">

                  {/* VER META */}
                  <div className="gc-btn-wrap" ref={metaRef}>
                    <button className="gc-btn-meta" onClick={handleOpenMeta}>
                      VER META DE GASTOS
                    </button>
                    {showMeta && (
                      <div className="gc-popover">
                        <p className="gc-popover-label">Meta de gastos</p>
                        {metaLoading ? (
                          <p className="gc-meta-loading">Carregando...</p>
                        ) : metaError ? (
                          <p className="gc-popover-msg gc-popover-error">{metaError}</p>
                        ) : meta !== null ? (
                          <div className="gc-meta-display">
                            <p className="gc-meta-display-value">{formatBRL(meta)}</p>
                            <p className="gc-meta-display-sub">por mês</p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <h2 className="gc-title">GASTOS CADASTRADOS</h2>

                  {/* CADASTRAR/EDITAR META */}
                  <div className="gc-btn-wrap" ref={formRef}>
                    <button className="gc-btn-cadastrar" onClick={handleOpenForm}>
                      {meta ? "EDITAR META DE GASTOS" : "CADASTRAR META DE GASTOS"}
                    </button>
                    {showForm && (
                      <div className="gc-popover gc-popover-right">
                        <p className="gc-popover-label">
                          <ArrowIcon />
                          VALOR (POR MÊS)
                        </p>
                        {metaLoading ? (
                          <p className="gc-meta-loading">Carregando...</p>
                        ) : (
                          <>
                            <input
                              type="text"
                              className="gc-popover-input"
                              placeholder="Ex.: R$ 280.000"
                              value={metaInput}
                              onChange={(e) => { setMetaInput(e.target.value); setSaveError(null); setSaveSuccess(false); }}
                              onKeyDown={(e) => e.key === "Enter" && handleSave()}
                              autoFocus
                            />
                            <button className="gc-popover-save" onClick={handleSave} disabled={saving}>
                              {saving ? "SALVANDO..." : "SALVAR"}
                            </button>
                          </>
                        )}
                        {saveError   && <p className="gc-popover-msg gc-popover-error">{saveError}</p>}
                        {saveSuccess && <p className="gc-popover-msg gc-popover-success">Meta salva com sucesso!</p>}
                      </div>
                    )}
                  </div>

                </div>

                {meta && expenses.length > 0 && (() => {
                  const totalExpenses = expenses.reduce((sum, e) => sum + (typeof e.value === 'string' ? parseFloat(e.value) : e.value || 0), 0);
                  const percentage = (totalExpenses / meta) * 100;
                  const metaExceeded = totalExpenses >= meta;
                  
                  if (metaExceeded || percentage >= 80) {
                    return (
                      <div className={`gc-alert ${metaExceeded ? 'gc-alert-danger' : 'gc-alert-warning'}`}>
                        <div className="gc-alert-icon">
                          {metaExceeded ? '⚠️' : '⚡'}
                        </div>
                        <div className="gc-alert-content">
                          <div className="gc-alert-title">
                            {metaExceeded ? 'META DE GASTOS ATINGIDA!' : 'ATENÇÃO: Limite próximo'}
                          </div>
                          <div className="gc-alert-message">
                            {metaExceeded 
                              ? `Gastos totais (${formatBRL(totalExpenses)}) atingiram a meta de ${formatBRL(meta)}`
                              : `Você utilizou ${Math.round(percentage)}% da meta mensal. Total: ${formatBRL(totalExpenses)} de ${formatBRL(meta)}`
                            }
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}


                {/* TABELA */}
                <div className="gc-table-wrap">
                  <table className="gc-table">
                    <thead>
                      <tr>
                        <th>PLACA</th>
                        <th>MOTORISTA</th>
                        <th>VALOR</th>
                        <th>COMPROVANTE</th>
                        <th>AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} className="gc-feedback">Carregando gastos...</td></tr>
                      ) : error ? (
                        <tr><td colSpan={5} className="gc-feedback error">{error}</td></tr>
                      ) : expenses.length === 0 ? (
                        <tr><td colSpan={5} className="gc-feedback">Nenhum gasto encontrado.</td></tr>
                      ) : (
                        expenses.map((e) => (
                          <tr key={e.id}>
                            <td className="gc-td-bold">{e.vehicle_plate}</td>
                            <td>{e.driver?.name ?? `Motorista #${e.driver_id}`}</td>
                            <td className="gc-td-value">{formatBRL(e.value)}</td>
                            <td>
                              {e.proof_of_payment ? (
                                <a href={getProofUrl(e.proof_of_payment) ?? "#"} target="_blank" rel="noopener noreferrer" className="gc-btn-download">
                                  <DownloadIcon />
                                  Baixar comprovante
                                </a>
                              ) : (
                                <span className="gc-no-receipt">Sem comprovante</span>
                              )}
                            </td>
                            <td className="gc-td-ops">
                              <button className="gc-btn-excluir" onClick={() => handleDelete(e.id)}>EXCLUIR</button>
                              <button className="gc-btn-editar" onClick={() => router.push(`/gastos/editar/${e.id}`)}>EDITAR</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </main>
          </div>

        </div>
      </div>
    </>
  );
}
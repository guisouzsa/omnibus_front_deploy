"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useExpenses, useSpendingLimits } from "@/hooks";
import { maskCurrency, unmaskCurrency } from "@/utils/mask";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";
import SchoolIcon from "@/components/SchoolIcon";

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
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function DownloadPdfIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
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

  body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }

  .oc-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; }

  /* SIDEBAR */
  .oc-sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .oc-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .oc-logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .oc-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .oc-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .oc-sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .oc-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .oc-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .oc-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .oc-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 600; }
  .oc-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .oc-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .oc-user-row:hover { background: rgba(255,255,255,0.07); }
  .oc-avatar { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
  .oc-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .oc-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* CONTENT */
  .oc-content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* NAVBAR */
  .oc-navbar { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .oc-topbar-title { font-size: 16px; font-weight: 600; color: #01233F; }
  .oc-topbar-sub { font-size: 12px; color: #6b7a8d; margin-top: 1px; font-weight: 400; }
  .oc-nav-right { display: flex; align-items: center; gap: 10px; }
  .oc-icon-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e6ea; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #01233F; transition: all 0.15s; position: relative; }
  .oc-icon-btn:hover { background: #f0f2f5; }
  .oc-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }

  /* MAIN */
  .oc-main { padding: 32px 40px; }
  .oc-content { width: 100%; }
  .oc-top-bar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px; margin-bottom: 20px; width: 100%; }
  .oc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; text-align: center; margin: 0; grid-column: 2; }
  .oc-btn-wrap { position: relative; flex-shrink: 0; }
  .oc-btn-meta { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-btn-meta:hover { background: #dba900; }
  .oc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-btn-cadastrar:hover { background: #dba900; }

  .oc-popover { position: absolute; top: calc(100% + 8px); left: 0; background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 16px; min-width: 220px; z-index: 100; }
  .oc-popover-right { left: auto; right: 0; }
  .oc-popover-label { font-size: 11px; font-weight: 800; color: #01233F; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .oc-meta-display { background: #f9f9f9; border: 1px solid #e8e8e8; border-radius: 5px; padding: 12px 14px; }
  .oc-meta-display-value { font-size: 20px; font-weight: 900; color: #01233F; line-height: 1; }
  .oc-meta-display-sub { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .oc-popover-input { width: 100%; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 8px 10px; font-size: 13px; color: #333; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; outline: none; margin-bottom: 10px; box-sizing: border-box; }
  .oc-popover-input:focus { border-color: #f1bb13; }
  .oc-popover-save { width: 100%; background: none; border: 1.5px solid #f1bb13; border-radius: 4px; padding: 8px 0; font-size: 12px; font-weight: 900; color: #f1bb13; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .oc-popover-save:hover { background: #f1bb13; color: #fff; }
  .oc-popover-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .oc-popover-msg { font-size: 11px; margin-top: 8px; }
  .oc-popover-error { color: #c0392b; }
  .oc-popover-success { color: #27ae60; }
  .oc-meta-loading { font-size: 12px; color: #aaa; }

  .oc-table-wrap { width: 100%; overflow-x: auto; border-radius: 4px; }
  .oc-table { width: 100%; border-collapse: collapse; }
  .oc-table thead tr { background: #01233F; }
  .oc-table thead th { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 14px 18px; text-align: left; }
  .oc-table tbody tr { border-bottom: 1px solid #e8e8e8; background: #fff; }
  .oc-table tbody tr:hover { background: #fafafa; }
  .oc-table tbody td { padding: 14px 18px; font-size: 13px; color: #333; }
  .oc-td-bold { font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 12px; }
  .oc-td-value { font-weight: 800; color: #01233F; font-size: 13px; }
  .oc-td-ops { display: flex; align-items: center; gap: 14px; }
  .oc-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-excluir:hover { opacity: 0.7; }
  .oc-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-editar:hover { opacity: 0.6; }
  .oc-btn-download { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 700; color: #01233F; text-decoration: underline; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-download:hover { opacity: 0.6; }
  .oc-no-receipt { font-size: 12px; color: #bbb; font-style: italic; }
  .oc-feedback { text-align: center; font-size: 14px; padding: 32px; color: #aaa; }
  .oc-feedback.error { color: #c0392b; }

  .oc-alert { 
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
  .oc-alert-warning { 
    background: #fff8e1; 
    border-color: #f1bb13;
    color: #856404;
  }
  .oc-alert-danger { 
    background: #ffe5e5; 
    border-color: #c0392b;
    color: #721c24;
  }
  .oc-alert-icon {
    font-size: 20px;
    flex-shrink: 0;
  }
  .oc-alert-content {
    flex: 1;
  }
  .oc-alert-title {
    font-weight: 800;
    margin-bottom: 2px;
  }
  .oc-alert-message {
    font-weight: 500;
    font-size: 13px;
  }

  /* MODAL */
  .oc-modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .oc-modal { background: #fff; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-width: 900px; width: 90%; max-height: 85vh; display: flex; flex-direction: column; }
  .oc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e8e8e8; }
  .oc-modal-title { font-size: 16px; font-weight: 800; color: #01233F; }
  .oc-modal-header-actions { display: flex; align-items: center; gap: 12px; }
  .oc-modal-download { background: #f1bb13; border: none; border-radius: 4px; padding: 8px 16px; font-size: 12px; font-weight: 800; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s; text-transform: uppercase; }
  .oc-modal-download:hover { background: #dba900; }
  .oc-modal-close { background: none; border: none; cursor: pointer; padding: 0; color: #6b7a8d; transition: color 0.15s; }
  .oc-modal-close:hover { color: #01233F; }
  .oc-modal-body { flex: 1; overflow-y: auto; padding: 24px; display: flex; align-items: center; justify-content: center; }
  .oc-modal-iframe { width: 100%; height: 600px; border: none; border-radius: 4px; }
  .oc-modal-image { max-width: 100%; max-height: 100%; border-radius: 4px; object-fit: contain; }
  .oc-modal-empty { text-align: center; color: #999; font-size: 14px; }

  @media (max-width: 900px) {
    .oc-sidebar { display: none; }
    .oc-content-wrap { margin-left: 0; }
    .oc-main { padding: 20px 16px; }
    .oc-top-bar { flex-direction: column; align-items: flex-start; }
    .oc-modal { max-width: 95%; }
    .oc-modal-iframe { height: 400px; }
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

function downloadFile(url: string, filename?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || url.split("/").pop() || "comprovante";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VisualizarGastosPage() {
  const router = useRouter();
  const {
    expenses,
    loading,
    error,
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

  const [proofModal, setProofModal]     = useState<{ url: string; filename?: string } | null>(null);

  const metaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const hasLoadedMetaRef = useRef(false);

  // Carregar meta automaticamente ao abrir a página
  useEffect(() => {
    if (hasLoadedMetaRef.current) return;
    
    hasLoadedMetaRef.current = true;
    setMetaLoading(true);
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setMetaLoading(false);
      return;
    }

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
  }, []);

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
      setMetaLoading(true);
      setMetaError(null);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setMeta(null);
        setLimitId(null);
        setMetaError("Usuário não autenticado.");
        setMetaLoading(false);
        return;
      }

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
      setMetaLoading(true);
      setSaveError(null);
      setSaveSuccess(false);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        setSaveError("Usuário não autenticado.");
        setMetaLoading(false);
        return;
      }

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
    const parsed = unmaskCurrency(metaInput);
    if (isNaN(parsed) || parsed <= 0) { setSaveError("Informe um valor válido."); return; }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) { setSaveError("Usuário não autenticado."); return; }

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="oc-page">

        {/* ── SIDEBAR ── */}
        <aside className="oc-sidebar">
          <div className="oc-sidebar-logo">
            <div className="oc-logo-icon">
              <BusIcon size={18} color="#01233F" />
            </div>
            <div>
              <div className="oc-logo-text">Omnibus</div>
              <div className="oc-logo-sub">Gestão Escolar</div>
            </div>
          </div>

          <nav className="oc-sidebar-nav">
            <span className="oc-nav-label">Principal</span>
            <button
              className={`oc-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
              onClick={() => { setActiveNav("dashboard"); router.push("/dashboard"); }}
            >
              <DashIcon /> Dashboard
            </button>
            <button
              className={`oc-nav-item ${activeNav === "financeiro" ? "active" : ""}`}
              onClick={() => { setActiveNav("financeiro"); router.push("/visualizar_gastos"); }}
            >
              <FinanceIcon /> Financeiro
            </button>

            <span className="oc-nav-label">Cadastros</span>
            <button className="oc-nav-item" onClick={() => router.push("/lista_onibus")}>
              <BusIcon size={18} /> Ônibus
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_rotas")}>
              <RouteIcon size={18} /> Rotas
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_motoristas")}>
              <DriverIcon size={18} /> Motoristas
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_escolas")}>
              <SchoolIcon size={18} /> Escolas
            </button>
          </nav>

          <div className="oc-sidebar-footer">
            <button className="oc-user-row" onClick={() => router.push("/perfil")}>
              <div className="oc-avatar">A</div>
              <div>
                <div className="oc-user-name">Admin</div>
                <div className="oc-user-role">Gestor</div>
              </div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        {/* ── CONTENT ── */}
        <div className="oc-content-wrap">

          {/* ── NAVBAR ── */}
          <header className="oc-navbar">
            <div>
              <div className="oc-topbar-title">Financeiro</div>
              <div className="oc-topbar-sub">
                Gastos cadastrados · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="oc-nav-right">
              <button className="oc-icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIcon />
                <span className="oc-notif-dot" />
              </button>
              <button className="oc-icon-btn" onClick={() => router.push("/perfil")} title="Perfil">
                <UserCircleIcon />
              </button>
            </div>
          </header>

          {/* ── CONTEÚDO ── */}
          <main className="oc-main" style={{ background: '#f9f9f9' }}>
            <div className="oc-content">

              <div className="oc-top-bar">

                {/* CADASTRAR/EDITAR META - À ESQUERDA */}
                <div className="oc-btn-wrap" ref={formRef}>
                  <button className="oc-btn-cadastrar" onClick={handleOpenForm}>
                    {meta ? "EDITAR META" : "CADASTRAR META"}
                  </button>
                  {showForm && (
                    <div className="oc-popover">
                      <p className="oc-popover-label">
                        <ArrowIcon />
                        VALOR (POR MÊS)
                      </p>
                      {metaLoading ? (
                        <p className="oc-meta-loading">Carregando...</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="oc-popover-input"
                            placeholder="Ex.: R$ 280.000"
                            value={metaInput}
                            onChange={(e) => { 
                              const masked = maskCurrency(e.target.value);
                              setMetaInput(masked); 
                              setSaveError(null); 
                              setSaveSuccess(false); 
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                            autoFocus
                          />
                          <button className="oc-popover-save" onClick={handleSave} disabled={saving}>
                            {saving ? "SALVANDO..." : "SALVAR"}
                          </button>
                        </>
                      )}
                      {saveError   && <p className="oc-popover-msg oc-popover-error">{saveError}</p>}
                      {saveSuccess && <p className="oc-popover-msg oc-popover-success">Meta salva com sucesso!</p>}
                    </div>
                  )}
                </div>

                {/* TÍTULO NO CENTRO */}
                <h2 className="oc-title">GASTOS CADASTRADOS</h2>

                {/* VER META - À DIREITA */}
                <div className="oc-btn-wrap" ref={metaRef}>
                  <button className="oc-btn-meta" onClick={handleOpenMeta}>
                    VER META
                  </button>
                  {showMeta && (
                    <div className="oc-popover oc-popover-right">
                      <p className="oc-popover-label">Meta de gastos</p>
                      {metaLoading ? (
                        <p className="oc-meta-loading">Carregando...</p>
                      ) : metaError ? (
                        <p className="oc-popover-msg oc-popover-error">{metaError}</p>
                      ) : meta !== null ? (
                        <div className="oc-meta-display">
                          <p className="oc-meta-display-value">{formatBRL(meta)}</p>
                          <p className="oc-meta-display-sub">por mês</p>
                        </div>
                      ) : null}
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
                    <div className={`oc-alert ${metaExceeded ? 'oc-alert-danger' : 'oc-alert-warning'}`}>
                      <div className="oc-alert-icon">
                        {metaExceeded ? '⚠️' : '⚡'}
                      </div>
                      <div className="oc-alert-content">
                        <div className="oc-alert-title">
                          {metaExceeded ? 'META DE GASTOS ATINGIDA!' : 'ATENÇÃO: Limite próximo'}
                        </div>
                        <div className="oc-alert-message">
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
              <div className="oc-table-wrap">
                <table className="oc-table">
                  <thead>
                    <tr>
                      <th>PLACA</th>
                      <th>MOTORISTA</th>
                      <th>VALOR</th>
                      <th>COMPROVANTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={4} className="oc-feedback">Carregando gastos...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={4} className="oc-feedback error">{error}</td></tr>
                    ) : expenses.length === 0 ? (
                      <tr><td colSpan={4} className="oc-feedback">Nenhum gasto encontrado.</td></tr>
                    ) : (
                      expenses.map((e) => (
                        <tr key={e.id}>
                          <td className="oc-td-bold">{e.vehicle_plate}</td>
                          <td>{e.driver?.name ?? `Motorista #${e.driver_id}`}</td>
                          <td className="oc-td-value">{formatBRL(e.value)}</td>
                          <td>
                            {e.proof_of_payment ? (
                              <button className="oc-btn-download" onClick={() => {
                                const url = getProofUrl(e.proof_of_payment);
                                if (url) setProofModal({ url, filename: `comprovante-${e.vehicle_plate}` });
                              }}>
                                <DownloadIcon />
                                Visualizar comprovante
                              </button>
                            ) : (
                              <span className="oc-no-receipt">Sem comprovante</span>
                            )}
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

      {/* ── MODAL COMPROVANTE ── */}
      {proofModal && (
        <div className="oc-modal-backdrop" onClick={() => setProofModal(null)}>
          <div className="oc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oc-modal-header">
              <h3 className="oc-modal-title">Comprovante de Pagamento</h3>
              <div className="oc-modal-header-actions">
                <button 
                  className="oc-modal-download" 
                  onClick={() => {
                    if (proofModal.url) {
                      downloadFile(proofModal.url, proofModal.filename);
                    }
                  }}
                  title="Baixar comprovante"
                >
                  <DownloadPdfIcon />
                  BAIXAR
                </button>
                <button className="oc-modal-close" onClick={() => setProofModal(null)}>
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className="oc-modal-body">
              {proofModal.url ? (
                proofModal.url.endsWith(".pdf") ? (
                  <iframe src={proofModal.url} className="oc-modal-iframe" title="Comprovante PDF" />
                ) : proofModal.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={proofModal.url} className="oc-modal-image" alt="Comprovante" />
                ) : proofModal.url.startsWith("data:") ? (
                  proofModal.url.startsWith("data:image") ? (
                    <img src={proofModal.url} className="oc-modal-image" alt="Comprovante" />
                  ) : (
                    <iframe src={proofModal.url} className="oc-modal-iframe" title="Comprovante" />
                  )
                ) : (
                  <iframe src={proofModal.url} className="oc-modal-iframe" title="Comprovante" />
                )
              ) : (
                <div className="oc-modal-empty">Erro ao carregar comprovante</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

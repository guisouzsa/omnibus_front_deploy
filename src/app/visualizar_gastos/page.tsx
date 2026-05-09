"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useExpenses, useSpendingLimits } from "@/hooks";
import { maskCurrency, unmaskCurrency } from "@/utils/mask";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";
import SchoolIcon from "@/components/SchoolIcon";

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
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function DownloadPdfIcon() {
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #01233F; --yellow: #f1bb13; --yellow-dark: #d9a700;
    --bg: #f0f2f5; --card: #ffffff; --border: #e2e6ea;
    --text: #1a2535; --muted: #6b7a8d; --red: #ef4444; --sidebar-w: 220px;
  }
  body { font-family: 'DM Sans', sans-serif; }
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
  .sidebar-logo { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
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
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--text); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; flex-shrink: 0; }
  .topbar-avatar:hover { border-color: var(--yellow-dark); }

  /* ── Main ── */
  .main { padding: 32px; flex: 1; }

  /* ── Top bar (grid) ── */
  .top-bar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px; margin-bottom: 24px; width: 100%; }
  .page-title { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: 0.3px; white-space: nowrap; margin: 0; grid-column: 2; text-align: center; }

  /* ── Buttons ── */
  .btn-primary { background: var(--yellow); border: none; border-radius: 8px; padding: 0 20px; height: 40px; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; flex-shrink: 0; }
  .btn-primary:hover { background: var(--yellow-dark); }
  .btn-wrap { position: relative; flex-shrink: 0; }

  /* ── Popover ── */
  .popover { position: absolute; top: calc(100% + 8px); left: 0; background: #fff; border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); padding: 16px; min-width: 230px; z-index: 100; }
  .popover-right { left: auto; right: 0; }
  .popover-label { font-size: 11px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; }
  .meta-display { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; }
  .meta-display-value { font-size: 20px; font-weight: 800; color: var(--navy); line-height: 1; }
  .meta-display-sub { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .popover-input { width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 8px 12px; font-size: 13px; color: var(--text); font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 10px; transition: border-color 0.15s, box-shadow 0.15s; }
  .popover-input:focus { border-color: var(--yellow); box-shadow: 0 0 0 3px rgba(241,187,19,0.1); }
  .popover-save { width: 100%; background: none; border: 1.5px solid var(--yellow); border-radius: 8px; padding: 8px 0; font-size: 12px; font-weight: 700; color: var(--yellow-dark); letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .popover-save:hover { background: var(--yellow); color: var(--navy); }
  .popover-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .popover-msg { font-size: 11px; margin-top: 8px; }
  .popover-error { color: #dc2626; }
  .popover-success { color: #16a34a; }
  .meta-loading { font-size: 12px; color: var(--muted); }

  /* ── Table ── */
  .table-card { background: var(--card); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
  .table { width: 100%; border-collapse: collapse; }
  .table thead tr { background: var(--navy); }
  .table thead th { color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 14px 20px; text-align: left; }
  .table tbody tr { border-bottom: 1px solid var(--border); background: #fff; transition: background 0.12s; }
  .table tbody tr:last-child { border-bottom: none; }
  .table tbody tr:hover { background: #fafbfc; }
  .table tbody td { padding: 14px 20px; font-size: 13px; color: var(--text); }
  .td-name { font-weight: 700; color: var(--navy); font-size: 13px; }
  .td-muted { color: var(--muted); font-size: 13px; }
  .td-value { font-weight: 700; color: var(--navy); font-size: 13px; }

  /* ── Download btn ── */
  .btn-download { display: inline-flex; align-items: center; gap: 6px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: #1d4ed8; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .btn-download:hover { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
  .no-receipt { font-size: 12px; color: #b0bac6; font-style: italic; }

  /* ── Feedback ── */
  .feedback { text-align: center; font-size: 14px; padding: 48px 20px; color: var(--muted); }
  .feedback.error { color: #dc2626; }

  /* ── Alert ── */
  .alert { margin-bottom: 24px; padding: 16px 20px; border-radius: 10px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; border-left: 5px solid; font-family: 'DM Sans', sans-serif; }
  .alert-warning { background: #fff8e1; border-color: var(--yellow); color: #856404; }
  .alert-danger { background: #ffe5e5; border-color: #dc2626; color: #7f1d1d; }
  .alert-icon { font-size: 20px; flex-shrink: 0; }
  .alert-content { flex: 1; }
  .alert-title { font-weight: 800; margin-bottom: 2px; }
  .alert-message { font-weight: 500; font-size: 13px; }

  /* ── Modal ── */
  .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .modal { background: #fff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); max-width: 900px; width: 90%; max-height: 85vh; display: flex; flex-direction: column; }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
  .modal-title { font-size: 16px; font-weight: 700; color: var(--navy); font-family: 'DM Sans', sans-serif; }
  .modal-header-actions { display: flex; align-items: center; gap: 10px; }
  .modal-download { background: var(--yellow); border: none; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-weight: 700; color: var(--navy); cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s; font-family: 'DM Sans', sans-serif; }
  .modal-download:hover { background: var(--yellow-dark); }
  .modal-close { background: none; border: none; cursor: pointer; padding: 4px; color: var(--muted); transition: color 0.15s; border-radius: 6px; }
  .modal-close:hover { color: var(--navy); background: var(--bg); }
  .modal-body { flex: 1; overflow-y: auto; padding: 24px; display: flex; align-items: center; justify-content: center; }
  .modal-iframe { width: 100%; height: 600px; border: none; border-radius: 8px; }
  .modal-image { max-width: 100%; max-height: 100%; border-radius: 8px; object-fit: contain; }
  .modal-empty { text-align: center; color: var(--muted); font-size: 14px; }

  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .main { padding: 20px 16px; }
    .top-bar { grid-template-columns: 1fr; }
    .page-title { grid-column: 1; text-align: left; }
    .modal { max-width: 95%; }
    .modal-iframe { height: 400px; }
  }
`;

// ─── Helpers (idênticos ao original) ─────────────────────────────────────────
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
  if (path.startsWith("data:")) return path;

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
function getUser() {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem("user") || "{}");
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VisualizarGastosPage() {
  const router = useRouter();
  const { expenses, loading, error } = useExpenses();
  const { getLimitByPeriod, createLimit, updateLimit } = useSpendingLimits(false);

  const [limitId, setLimitId] = useState<number | null>(null);
  const [showMeta, setShowMeta] = useState(false);
  const [meta, setMeta] = useState<number | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [metaInput, setMetaInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [proofModal, setProofModal] = useState<{ url: string; filename?: string } | null>(null);

  const metaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const hasLoadedMetaRef = useRef(false);

  useEffect(() => {
    if (hasLoadedMetaRef.current) return;
    hasLoadedMetaRef.current = true;
    setMetaLoading(true);
    const user = getUser();
    if (!user.id) { setMetaLoading(false); return; }
    const { month, year } = getCurrentPeriod();
    getLimitByPeriod(user.id, year, month)
      .then((limit) => {
        if (limit) { setMeta(getLimitAmount(limit)); setLimitId(limit.id); }
        else { setMeta(null); setLimitId(null); }
      })
      .catch(() => { setMeta(null); setLimitId(null); })
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
      setMetaLoading(true); setMetaError(null);
      const user = getUser();
      if (!user.id) { setMeta(null); setLimitId(null); setMetaError("Usuário não autenticado."); setMetaLoading(false); return; }
      const { month, year } = getCurrentPeriod();
      getLimitByPeriod(user.id, year, month)
        .then((limit) => {
          if (limit) { setMeta(getLimitAmount(limit)); setLimitId(limit.id); return; }
          setMeta(null); setLimitId(null);
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
      setMetaLoading(true); setSaveError(null); setSaveSuccess(false);
      const user = getUser();
      if (!user.id) { setSaveError("Usuário não autenticado."); setMetaLoading(false); return; }
      const { month, year } = getCurrentPeriod();
      getLimitByPeriod(user.id, year, month)
        .then((limit) => {
          if (limit) { const amount = getLimitAmount(limit); setMeta(amount); setLimitId(limit.id); setMetaInput(amount.toString()); return; }
          setMeta(null); setLimitId(null); setMetaInput("");
        })
        .catch(() => setSaveError("Erro ao carregar meta de gastos."))
        .finally(() => setMetaLoading(false));
    } else {
      setMetaInput(""); setSaveError(null); setSaveSuccess(false);
    }
  };

  const handleSave = async () => {
    const parsed = unmaskCurrency(metaInput);
    if (isNaN(parsed) || parsed <= 0) { setSaveError("Informe um valor válido."); return; }
    const user = getUser();
    if (!user.id) { setSaveError("Usuário não autenticado."); return; }
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    try {
      if (limitId) {
        await updateLimit(limitId, { limit_amount: parsed });
      } else {
        const created = await createLimit({ user_id: user.id, limit_amount: parsed });
        if (created?.data?.id) setLimitId(created.data.id);
      }
      setSaveSuccess(true); setMeta(parsed); setMetaInput("");
    } catch (err: any) {
      const apiMessage = err?.response?.message;
      const validationErrors = err?.response?.errors as Record<string, string[]> | undefined;
      const firstValidationMessage = validationErrors ? Object.values(validationErrors)[0]?.[0] : null;
      setSaveError(firstValidationMessage || apiMessage || "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

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
            <BusSideIcon size={28} />
            <div className="logo-texts">
              <div className="logo-text">Omnibus</div>
              <div className="logo-sub">Gestão Escolar</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <span className="nav-label">Principal</span>
            <button className="nav-item" onClick={() => router.push("/dashboard")}><DashIconFilled /> Dashboard</button>
            <button className="nav-item active"><FinanceIconFilled /> Financeiro</button>
            <span className="nav-label">Cadastros</span>
            <button className="nav-item" onClick={() => router.push("/lista_onibus")}><BusFrontIcon /> Ônibus</button>
            <button className="nav-item" onClick={() => router.push("/lista_rotas")}><RouteIconFilled /> Rotas</button>
            <button className="nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIconFilled /> Motoristas</button>
            <button className="nav-item" onClick={() => router.push("/lista_escolas")}><SchoolIcon size={17} /> Escolas</button>
          </nav>
          <div className="sidebar-footer">
            <button className="user-row" onClick={() => router.push("/perfil")}>
              <div className="avatar">A</div>
              <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="content">
          {/* ── Topbar ── */}
          <header className="topbar">
            <div>
              <div className="topbar-title">Financeiro</div>
              <div className="topbar-sub">
                Gastos cadastrados · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled /><span className="notif-dot" />
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">A</div>
            </div>
          </header>

          {/* ── Main ── */}
          <main className="main">
            <div className="top-bar">
              {/* Botão Editar/Cadastrar Meta */}
              <div className="btn-wrap" ref={formRef}>
                <button className="btn-primary" onClick={handleOpenForm}>
                  {meta ? "Editar meta" : "Cadastrar meta"}
                </button>
                {showForm && (
                  <div className="popover">
                    <p className="popover-label"><ArrowIcon /> Valor (por mês)</p>
                    {metaLoading ? (
                      <p className="meta-loading">Carregando...</p>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="popover-input"
                          placeholder="Ex.: R$ 280.000"
                          value={metaInput}
                          onChange={(e) => { const masked = maskCurrency(e.target.value); setMetaInput(masked); setSaveError(null); setSaveSuccess(false); }}
                          onKeyDown={(e) => e.key === "Enter" && handleSave()}
                          autoFocus
                        />
                        <button className="popover-save" onClick={handleSave} disabled={saving}>
                          {saving ? "Salvando..." : "Salvar"}
                        </button>
                      </>
                    )}
                    {saveError && <p className="popover-msg popover-error">{saveError}</p>}
                    {saveSuccess && <p className="popover-msg popover-success">Meta salva com sucesso!</p>}
                  </div>
                )}
              </div>

              <h2 className="page-title">Gastos cadastrados</h2>

              {/* Botão Ver Meta */}
              <div className="btn-wrap" ref={metaRef}>
                <button className="btn-primary" onClick={handleOpenMeta}>Ver meta</button>
                {showMeta && (
                  <div className="popover popover-right">
                    <p className="popover-label">Meta de gastos</p>
                    {metaLoading ? (
                      <p className="meta-loading">Carregando...</p>
                    ) : metaError ? (
                      <p className="popover-msg popover-error">{metaError}</p>
                    ) : meta !== null ? (
                      <div className="meta-display">
                        <p className="meta-display-value">{formatBRL(meta)}</p>
                        <p className="meta-display-sub">por mês</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* ── Alerta de meta ── */}
            {meta && expenses.length > 0 && (() => {
              const totalExpenses = expenses.reduce((sum, e) => sum + (typeof e.value === "string" ? parseFloat(e.value) : e.value || 0), 0);
              const percentage = (totalExpenses / meta) * 100;
              const metaExceeded = totalExpenses >= meta;
              if (metaExceeded || percentage >= 80) {
                return (
                  <div className={`alert ${metaExceeded ? "alert-danger" : "alert-warning"}`}>
                    <div className="alert-icon">{metaExceeded ? "⚠️" : "⚡"}</div>
                    <div className="alert-content">
                      <div className="alert-title">{metaExceeded ? "Meta de gastos atingida!" : "Atenção: limite próximo"}</div>
                      <div className="alert-message">
                        {metaExceeded
                          ? `Gastos totais (${formatBRL(totalExpenses)}) atingiram a meta de ${formatBRL(meta)}`
                          : `Você utilizou ${Math.round(percentage)}% da meta mensal. Total: ${formatBRL(totalExpenses)} de ${formatBRL(meta)}`}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* ── Tabela ── */}
            <div className="table-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Motorista</th>
                    <th>Valor</th>
                    <th>Comprovante</th>
                  </tr>
                </thead>
                <tbody>
                  {error ? (
                    <tr><td colSpan={4} className="feedback error">{error}</td></tr>
                  ) : expenses.length === 0 ? (
                    <tr><td colSpan={4} className="feedback">Nenhum gasto encontrado.</td></tr>
                  ) : (
                    expenses.map((e) => (
                      <tr key={e.id}>
                        <td className="td-name">{e.vehicle_plate}</td>
                        <td className="td-muted">{e.driver?.name ?? `Motorista #${e.driver_id}`}</td>
                        <td className="td-value">{formatBRL(e.value)}</td>
                        <td>
                          {e.proof_of_payment ? (
                            <button className="btn-download" onClick={() => {
                              const url = getProofUrl(e.proof_of_payment);
                              if (url) setProofModal({ url, filename: `comprovante-${e.vehicle_plate}` });
                            }}>
                              <DownloadIcon /> Visualizar comprovante
                            </button>
                          ) : (
                            <span className="no-receipt">Sem comprovante</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* ── Modal comprovante ── */}
      {proofModal && (
        <div className="modal-backdrop" onClick={() => setProofModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Comprovante de pagamento</h3>
              <div className="modal-header-actions">
                <button className="modal-download" onClick={() => { if (proofModal.url) downloadFile(proofModal.url, proofModal.filename); }}>
                  <DownloadPdfIcon /> Baixar
                </button>
                <button className="modal-close" onClick={() => setProofModal(null)}><CloseIcon /></button>
              </div>
            </div>
            <div className="modal-body">
              {proofModal.url ? (
                proofModal.url.endsWith(".pdf") ? (
                  <iframe src={proofModal.url} className="modal-iframe" title="Comprovante PDF" />
                ) : proofModal.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={proofModal.url} className="modal-image" alt="Comprovante" />
                ) : proofModal.url.startsWith("data:") ? (
                  proofModal.url.startsWith("data:image") ? (
                    <img src={proofModal.url} className="modal-image" alt="Comprovante" />
                  ) : (
                    <iframe src={proofModal.url} className="modal-iframe" title="Comprovante" />
                  )
                ) : (
                  <iframe src={proofModal.url} className="modal-iframe" title="Comprovante" />
                )
              ) : (
                <div className="modal-empty">Erro ao carregar comprovante</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

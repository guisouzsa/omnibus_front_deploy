"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useExpenses, useSpendingLimits } from "@/hooks";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  .gc-page { min-height: 100vh; background: #f9f9f9; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }

  /* NAVBAR */
  .gc-navbar { width: 100%; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 56px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .gc-nav-links { display: flex; align-items: center; gap: 28px; }
  .gc-nav-link { font-size: 13px; font-weight: 700; color: #01233F; letter-spacing: 0.5px; text-transform: uppercase; background: none; border: none; cursor: pointer; padding: 16px 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; border-bottom: 2px solid transparent; transition: color 0.15s; }
  .gc-nav-link:hover { color: #888; }
  .gc-nav-link.active { color: #01233F; }
  .gc-nav-link.active:hover { color: #888; }
  .gc-nav-right { display: flex; align-items: center; gap: 16px; }
  .gc-notif-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; color: #01233F; transition: opacity 0.15s; }
  .gc-notif-btn:hover { opacity: 0.7; }
  .gc-user-btn { background: #01233F; width: 36px; height: 36px; border: 2px solid #01233F; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: opacity 0.15s; padding: 0; color: #fff; }
  .gc-user-btn:hover { opacity: 0.8; }

  /* MAIN */
  .gc-main { padding: 32px 40px; }
  .gc-content { width: 100%; }

  /* TOP BAR */
  .gc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; width: 100%; }
  .gc-btn-wrap { position: relative; flex-shrink: 0; }
  .gc-btn-meta { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .gc-btn-meta:hover { background: #dba900; }
  .gc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; flex: 1; text-align: center; }
  .gc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .gc-btn-cadastrar:hover { background: #dba900; }

  /* POPOVER */
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

  /* TABELA */
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

  @media (max-width: 700px) {
    .gc-main { padding: 20px 16px; }
    .gc-top-bar { flex-wrap: wrap; }
    .gc-title { text-align: left; flex: none; width: 100%; order: -1; }
  }
`;

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

function getLimitAmount(limit: { limit_amount?: number; limit_value?: number } | null) {
  if (!limit) return 0;
  if (typeof limit.limit_amount === "number") return limit.limit_amount;
  if (typeof limit.limit_value === "number") return limit.limit_value;
  return 0;
}

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

  // popover VER META
  const [showMeta, setShowMeta]       = useState(false);
  const [meta, setMeta]               = useState<number | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError]     = useState<string | null>(null);

  // popover CADASTRAR META
  const [showForm, setShowForm]         = useState(false);
  const [metaInput, setMetaInput]       = useState("");
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess]   = useState(false);

  const metaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // fechar ao clicar fora
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
    setShowForm((v) => !v);
    setMetaInput("");
    setSaveError(null);
    setSaveSuccess(false);
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
      <div className="gc-page">

        {/* NAVBAR */}
        <nav className="gc-navbar">
          <div className="gc-nav-links">
            <button onClick={() => router.push("/dashboard")} className="gc-nav-link">DASHBOARD</button>
            <button onClick={() => router.push("/financeiro")} className="gc-nav-link active">FINANCEIRO</button>
          </div>
          <div className="gc-nav-right">
            <button className="gc-notif-btn" title="Notificações" onClick={() => router.push("/notificacoes")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="gc-user-btn" title="Usuário" onClick={() => router.push("/perfil")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="gc-main">
          <div className="gc-content">

            {/* TOP BAR */}
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
                      <p className={`gc-popover-msg gc-popover-error`}>{metaError}</p>
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

              {/* CADASTRAR META */}
              <div className="gc-btn-wrap" ref={formRef}>
                <button className="gc-btn-cadastrar" onClick={handleOpenForm}>
                  CADASTRAR META DE GASTOS
                </button>
                {showForm && (
                  <div className="gc-popover gc-popover-right">
                    <p className="gc-popover-label">
                      <ArrowIcon />
                      VALOR (POR MÊS)
                    </p>
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
                    {saveError   && <p className={`gc-popover-msg gc-popover-error`}>{saveError}</p>}
                    {saveSuccess && <p className={`gc-popover-msg gc-popover-success`}>Meta salva com sucesso!</p>}
                  </div>
                )}
              </div>

            </div>

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
    </>
  );
}
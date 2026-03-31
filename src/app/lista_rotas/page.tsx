"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";

type Route = {
  id: number;
  name: string;
  start_point: string;
  end_point: string;
  departure_time: string;
};

const css = `
  .rc-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; }

  .rc-sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .rc-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .rc-logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rc-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .rc-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .rc-sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .rc-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .rc-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .rc-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .rc-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 600; }
  .rc-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .rc-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .rc-user-row:hover { background: rgba(255,255,255,0.07); }
  .rc-avatar { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
  .rc-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .rc-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  .rc-content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .rc-navbar { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .rc-topbar-title { font-size: 16px; font-weight: 600; color: #01233F; }
  .rc-topbar-sub { font-size: 12px; color: #6b7a8d; margin-top: 1px; font-weight: 400; }
  .rc-nav-right { display: flex; align-items: center; gap: 10px; }
  .rc-icon-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e6ea; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #01233F; transition: all 0.15s; position: relative; }
  .rc-icon-btn:hover { background: #f0f2f5; }
  .rc-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }

  .rc-main { padding: 32px 40px; }
  .rc-content { width: 100%; }

  .rc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .rc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; }
  .rc-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 12px; height: 38px; flex: 1; min-width: 180px; gap: 8px; }
  .rc-search-input { border: none; outline: none; font-size: 13px; color: #333; width: 100%; background: transparent; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .rc-search-input::placeholder { color: #aaa; }
  .rc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .rc-btn-cadastrar:hover { background: #dba900; }

  .rc-table-wrap { width: 100%; overflow-x: auto; border-radius: 4px; }
  .rc-table { width: 100%; border-collapse: collapse; }
  .rc-table thead tr { background: #01233F; }
  .rc-table thead th { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 14px 18px; text-align: left; }
  .rc-table tbody tr { border-bottom: 1px solid #e8e8e8; background: #fff; }
  .rc-table tbody tr:hover { background: #fafafa; }
  .rc-table tbody td { padding: 14px 18px; font-size: 13px; color: #333; }
  .rc-td-bold { font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 12px; }
  .rc-td-time { font-weight: 600; color: #444; font-size: 13px; }
  .rc-td-ops { display: flex; align-items: center; gap: 14px; }
  .rc-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .rc-btn-excluir:hover { opacity: 0.7; }
  .rc-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .rc-btn-editar:hover { opacity: 0.6; }
  .rc-feedback { text-align: center; font-size: 14px; padding: 32px; color: #aaa; }
  .rc-feedback.error { color: #c0392b; }

  @media (max-width: 900px) {
    .rc-sidebar { display: none; }
    .rc-content-wrap { margin-left: 0; }
    .rc-main { padding: 20px 16px; }
    .rc-top-bar { flex-direction: column; align-items: flex-start; }
    .rc-search-wrap { width: 100%; }
  }
`;

export default function RotasCadastradasPage() {
  const router = useRouter();
  const { routes, loading, error, deleteRoute } = useRoutes();
  const [search, setSearch] = useState("");

  const filtered = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.start_point.toLowerCase().includes(search.toLowerCase()) ||
      r.end_point.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteRoute(id);
    } catch {
      alert("Erro ao excluir rota. Tente novamente.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editRota?id=${id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="rc-page">

        <aside className="rc-sidebar">
          <div className="rc-sidebar-logo">
            <div className="rc-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
                <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
              </svg>
            </div>
            <div><div className="rc-logo-text">Omnibus</div><div className="rc-logo-sub">Gestão Escolar</div></div>
          </div>
          <nav className="rc-sidebar-nav">
            <span className="rc-nav-label">Principal</span>
            <button className="rc-nav-item" onClick={() => router.push("/dashboard")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>
            <button className="rc-nav-item" onClick={() => router.push("/visualizar_gastos")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Financeiro
            </button>
            <span className="rc-nav-label">Cadastros</span>
            <button className="rc-nav-item" onClick={() => router.push("/lista_onibus")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/></svg>
              Ônibus
            </button>
            <button className="rc-nav-item active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              Rotas
            </button>
            <button className="rc-nav-item" onClick={() => router.push("/lista_motoristas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
              Motoristas
            </button>
            <button className="rc-nav-item" onClick={() => router.push("/lista_escolas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Escolas
            </button>
          </nav>
          <div className="rc-sidebar-footer">
            <button className="rc-user-row" onClick={() => router.push("/perfil")}>
              <div className="rc-avatar">A</div>
              <div><div className="rc-user-name">Admin</div><div className="rc-user-role">Gestor</div></div>
            </button>
          </div>
        </aside>

        <div className="rc-content-wrap">
          <header className="rc-navbar">
            <div>
              <div className="rc-topbar-title">Rotas</div>
              <div className="rc-topbar-sub">Rotas cadastradas no sistema</div>
            </div>
            <div className="rc-nav-right">
              <button className="rc-icon-btn" onClick={() => router.push("/notificacoes")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="rc-notif-dot" />
              </button>
              <button className="rc-icon-btn" onClick={() => router.push("/perfil")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
          </header>

          <main className="rc-main">
            <div className="rc-content">
              <div className="rc-top-bar">
                <h2 className="rc-title">ROTAS CADASTRADAS</h2>
                <div className="rc-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="rc-search-input"
                    placeholder="Procurar rota..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="rc-btn-cadastrar" onClick={() => router.push("/cadastro_rota")}>
                  CADASTRAR ROTAS
                </button>
              </div>

              <div className="rc-table-wrap">
                <table className="rc-table">
                  <thead>
                    <tr>
                      <th>NOME DA ROTA</th>
                      <th>PARADA INICIAL</th>
                      <th>ÚLTIMA PARADA</th>
                      <th>HORÁRIO DE SAÍDA</th>
                      <th>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="rc-feedback">Carregando rotas...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={5} className="rc-feedback error">{error}</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={5} className="rc-feedback">Nenhuma rota encontrada.</td></tr>
                    ) : (
                      filtered.map((r) => (
                        <tr key={r.id}>
                          <td className="rc-td-bold">{r.name}</td>
                          <td className="rc-td-bold">{r.start_point}</td>
                          <td className="rc-td-bold">{r.end_point}</td>
                          <td className="rc-td-time">{r.departure_time}</td>
                          <td className="rc-td-ops">
                            <button className="rc-btn-excluir" onClick={() => handleDelete(r.id)}>EXCLUIR</button>
                            <button className="rc-btn-editar" onClick={() => handleEdit(r.id)}>EDITAR</button>
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
    </>
  );
}
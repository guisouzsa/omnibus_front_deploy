"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const css = `
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
  .oc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .oc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; }
  .oc-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 12px; height: 38px; flex: 1; min-width: 180px; gap: 8px; }
  .oc-search-input { border: none; outline: none; font-size: 13px; color: #333; width: 100%; background: transparent; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-search-input::placeholder { color: #aaa; }
  .oc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-btn-cadastrar:hover { background: #dba900; }
  .oc-table-wrap { width: 100%; overflow-x: auto; border-radius: 4px; }
  .oc-table { width: 100%; border-collapse: collapse; }
  .oc-table thead tr { background: #01233F; }
  .oc-table thead th { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 14px 18px; text-align: left; }
  .oc-table tbody tr { border-bottom: 1px solid #e8e8e8; background: #fff; }
  .oc-table tbody tr:hover { background: #fafafa; }
  .oc-table tbody td { padding: 14px 18px; font-size: 13px; color: #333; }
  .oc-td-bold { font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 12px; }
  .oc-td-driver { font-weight: 500; color: #444; }
  .oc-driver-pending { display: inline-block; background: #fff3cd; color: #856404; border: 1px solid #ffeeba; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
  .oc-td-ops { display: flex; align-items: center; gap: 14px; }
  .oc-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-excluir:hover { opacity: 0.7; }
  .oc-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-editar:hover { opacity: 0.6; }
  .oc-feedback { text-align: center; font-size: 14px; padding: 32px; color: #aaa; }
  .oc-feedback.error { color: #c0392b; }

  @media (max-width: 900px) {
    .oc-sidebar { display: none; }
    .oc-content-wrap { margin-left: 0; }
    .oc-main { padding: 20px 16px; }
    .oc-top-bar { flex-direction: column; align-items: flex-start; }
    .oc-search-wrap { max-width: 100%; width: 100%; }
  }
`;

export default function OnibusCadastradosPage() {
  const router = useRouter();
  const { vehicles, loading, error, deleteVehicle } = useVehicles();
  const [search, setSearch] = useState("");

  const filtered = (vehicles || []).filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.mainRoute.toLowerCase().includes(search.toLowerCase()) ||
      (v.driver?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este ônibus?')) return;
    const success = await deleteVehicle(id);
    if (success) {
      alert('✓ Ônibus excluído com sucesso!');
    } else {
      alert('✗ Erro ao excluir ônibus. Tente novamente.');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editOnibus?id=${id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="oc-page">

        {/* SIDEBAR */}
        <aside className="oc-sidebar">
          <div className="oc-sidebar-logo">
            <div className="oc-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
                <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
              </svg>
            </div>
            <div><div className="oc-logo-text">Omnibus</div><div className="oc-logo-sub">Gestão Escolar</div></div>
          </div>
          <nav className="oc-sidebar-nav">
            <span className="oc-nav-label">Principal</span>
            <button className="oc-nav-item" onClick={() => router.push("/dashboard")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/visualizar_gastos")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Financeiro
            </button>
            <span className="oc-nav-label">Cadastros</span>
            <button className="oc-nav-item active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/></svg>
              Ônibus
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_rotas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              Rotas
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_motoristas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
              Motoristas
            </button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_escolas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Escolas
            </button>
          </nav>
          <div className="oc-sidebar-footer">
            <button className="oc-user-row" onClick={() => router.push("/perfil")}>
              <div className="oc-avatar">A</div>
              <div><div className="oc-user-name">Admin</div><div className="oc-user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="oc-content-wrap">
          {/* NAVBAR */}
          <header className="oc-navbar">
            <div>
              <div className="oc-topbar-title">Ônibus</div>
              <div className="oc-topbar-sub">Veículos cadastrados na frota</div>
            </div>
            <div className="oc-nav-right">
              <button className="oc-icon-btn" onClick={() => router.push("/notificacoes")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="oc-notif-dot" />
              </button>
              <button className="oc-icon-btn" onClick={() => router.push("/perfil")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
          </header>

          {/* MAIN */}
          <main className="oc-main">
            <div className="oc-content">
              <div className="oc-top-bar">
                <h2 className="oc-title">ÔNIBUS CADASTRADOS</h2>
                <div className="oc-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="oc-search-input"
                    placeholder="Procurar ônibus..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="oc-btn-cadastrar" onClick={() => router.push("/cadastro_onibus")}>
                  CADASTRAR ÔNIBUS
                </button>
              </div>

              <div className="oc-table-wrap">
                <table className="oc-table">
                  <thead>
                    <tr>
                      <th>PLACA</th>
                      <th>ROTA PRINCIPAL</th>
                      <th>CAPACIDADE</th>
                      <th>MOTORISTA PRINCIPAL</th>
                      <th>OPERAÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="oc-feedback">Carregando ônibus...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={5} className="oc-feedback error">{error}</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={5} className="oc-feedback">Nenhum ônibus encontrado.</td></tr>
                    ) : (
                      filtered.reverse().map((v) => (
                        <tr key={v.id}>
                          <td className="oc-td-bold">{v.plate}</td>
                          <td className="oc-td-bold">{v.mainRoute}</td>
                          <td className="oc-td-bold">{v.capacity} ALUNOS</td>
                          <td className="oc-td-driver">{v.driver?.name || 'N/A'}</td>
                          <td className="oc-td-ops">
                            <button className="oc-btn-excluir" onClick={() => handleDelete(v.id)}>EXCLUIR</button>
                            <button className="oc-btn-editar" onClick={() => handleEdit(v.id)}>EDITAR</button>
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
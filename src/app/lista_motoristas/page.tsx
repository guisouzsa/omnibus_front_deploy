"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDrivers } from "@/hooks";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const css = `
  .md-page { min-height: 100vh; background: #f9f9f9; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; }

  /* SIDEBAR */
  .md-sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .md-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .md-logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .md-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .md-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .md-sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .md-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .md-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .md-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .md-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 600; }
  .md-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .md-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .md-user-row:hover { background: rgba(255,255,255,0.07); }
  .md-avatar { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
  .md-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .md-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* CONTENT */
  .md-content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* TOPBAR */
  .md-navbar { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .md-topbar-title { font-size: 16px; font-weight: 600; color: #01233F; }
  .md-topbar-sub { font-size: 12px; color: #6b7a8d; margin-top: 1px; font-weight: 400; }
  .md-nav-right { display: flex; align-items: center; gap: 10px; }
  .md-icon-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e6ea; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #01233F; transition: all 0.15s; position: relative; }
  .md-icon-btn:hover { background: #f0f2f5; }
  .md-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }

  /* MAIN */
  .md-main { padding: 32px 40px; }
  .md-content { width: 100%; }

  /* TOP BAR */
  .md-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .md-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; }
  .md-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 12px; height: 38px; flex: 1; min-width: 180px; gap: 8px; }
  .md-search-input { border: none; outline: none; font-size: 13px; color: #333; width: 100%; background: transparent; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .md-search-input::placeholder { color: #aaa; }
  .md-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .md-btn-cadastrar:hover { background: #dba900; }

  /* LISTA DE CARDS */
  .md-list { display: flex; flex-direction: column; gap: 12px; width: 100%; }

  /* CARD */
  .md-card { display: flex; align-items: center; background: #fff; border: 1px solid #e8e8e8; border-radius: 5px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .md-card-bar { width: 8px; align-self: stretch; flex-shrink: 0; background: #f1bb13; }
  .md-card-info { flex: 1; padding: 16px 20px; min-width: 0; }
  .md-card-name { font-size: 14px; font-weight: 800; color: #01233F; margin: 0 0 4px 0; }
  .md-card-cnh { font-size: 12px; margin: 0; }
  .md-card-label { font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #f1bb13; }
  .md-card-value { color: #666; }
  .md-divider { width: 1px; height: 48px; background: #e8e8e8; flex-shrink: 0; }
  .md-card-contact { flex: 1; padding: 16px 24px; min-width: 0; }
  .md-card-email { font-size: 12px; margin: 0 0 4px 0; }
  .md-card-phone { font-size: 12px; margin: 0; }
  .md-card-email-value { color: #01233F; text-decoration: underline; }
  .md-card-actions { display: flex; align-items: center; gap: 20px; padding: 0 24px; flex-shrink: 0; }
  .md-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .md-btn-excluir:hover { opacity: 0.7; }
  .md-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .md-btn-editar:hover { opacity: 0.6; }

  /* FEEDBACK */
  .md-feedback { text-align: center; font-size: 14px; padding: 48px 0; color: #aaa; }
  .md-feedback.error { color: #c0392b; }

  @media (max-width: 900px) {
    .md-sidebar { display: none; }
    .md-content-wrap { margin-left: 0; }
    .md-main { padding: 20px 16px; }
    .md-top-bar { flex-direction: column; align-items: flex-start; }
    .md-search-wrap { width: 100%; }
    .md-card { flex-wrap: wrap; }
    .md-divider { display: none; }
    .md-card-contact { padding: 0 20px 16px; }
    .md-card-actions { padding: 0 20px 16px; }
  }
`;

export default function MotoristasPage() {
  const router = useRouter();
  const { drivers, loading, error, deleteDriver } = useDrivers();
  const [search, setSearch] = useState("");

  const filtered = (drivers || []).filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.license_number.includes(search)
  );

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o motorista ${name}?`)) return;
    try {
      await deleteDriver(id);
      alert("✓ Motorista excluído com sucesso!");
    } catch (err: any) {
      alert("✗ " + (err.message || "Erro ao excluir motorista. Tente novamente."));
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editMotorista?id=${id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="md-page">

        {/* SIDEBAR */}
        <aside className="md-sidebar">
          <div className="md-sidebar-logo">
            <div className="md-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
                <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
              </svg>
            </div>
            <div><div className="md-logo-text">Omnibus</div><div className="md-logo-sub">Gestão Escolar</div></div>
          </div>
          <nav className="md-sidebar-nav">
            <span className="md-nav-label">Principal</span>
            <button className="md-nav-item" onClick={() => router.push("/dashboard")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>
            <button className="md-nav-item" onClick={() => router.push("/visualizar_gastos")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Financeiro
            </button>
            <span className="md-nav-label">Cadastros</span>
            <button className="md-nav-item" onClick={() => router.push("/lista_onibus")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/></svg>
              Ônibus
            </button>
            <button className="md-nav-item" onClick={() => router.push("/lista_rotas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              Rotas
            </button>
            <button className="md-nav-item active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
              Motoristas
            </button>
            <button className="md-nav-item" onClick={() => router.push("/lista_escolas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Escolas
            </button>
          </nav>
          <div className="md-sidebar-footer">
            <button className="md-user-row" onClick={() => router.push("/infor_instituicao")}>
              <div className="md-avatar">A</div>
              <div><div className="md-user-name">Admin</div><div className="md-user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="md-content-wrap">
          {/* NAVBAR */}
          <header className="md-navbar">
            <div>
              <div className="md-topbar-title">Motoristas</div>
              <div className="md-topbar-sub">Motoristas cadastrados no sistema</div>
            </div>
            <div className="md-nav-right">
              <button className="md-icon-btn" onClick={() => router.push("/notificacoes")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="md-notif-dot" />
              </button>
              <button className="md-icon-btn" onClick={() => router.push("/perfil")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
          </header>

          {/* MAIN */}
          <main className="md-main">
            <div className="md-content">
              <div className="md-top-bar">
                <h2 className="md-title">MOTORISTAS CADASTRADOS</h2>
                <div className="md-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="md-search-input"
                    placeholder="Procurar motorista..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="md-btn-cadastrar" onClick={() => router.push("/cadastro_motorista")}>
                  CADASTRAR MOTORISTA
                </button>
              </div>

              {loading ? (
                <p className="md-feedback">Carregando motoristas...</p>
              ) : error ? (
                <p className="md-feedback error">{error}</p>
              ) : filtered.length === 0 ? (
                <p className="md-feedback">Nenhum motorista encontrado.</p>
              ) : (
                <div className="md-list">
                  {filtered.reverse().map((d) => (
                    <div key={d.id} className="md-card">
                      <div className="md-card-bar" />
                      <div className="md-card-info">
                        <p className="md-card-name">{d.name}</p>
                        <p className="md-card-cnh">
                          <span className="md-card-label">CNH: </span>
                          <span className="md-card-value">{d.license_number}</span>
                        </p>
                      </div>
                      <div className="md-divider" />
                      <div className="md-card-contact">
                        <p className="md-card-email">
                          <span className="md-card-label">Email: </span>
                          <span className="md-card-email-value">{d.email}</span>
                        </p>
                        <p className="md-card-phone">
                          <span className="md-card-label">Telefone: </span>
                          <span className="md-card-value">{d.phone_number}</span>
                        </p>
                      </div>
                      <div className="md-divider" />
                      <div className="md-card-actions">
                        <button className="md-btn-editar" onClick={() => handleEdit(d.id)}>EDITAR</button>
                        <button className="md-btn-excluir" onClick={() => handleDelete(d.id, d.name)}>EXCLUIR</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
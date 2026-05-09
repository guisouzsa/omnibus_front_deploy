"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSchools } from "@/hooks/useSchools";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

  function BusSideIcon({ size = 28 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Corpo */}
        <rect x="0" y="0" width="38" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
        {/* Janelas */}
        <rect x="3"  y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
        <rect x="13" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
        <rect x="23" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
        {/* Bump frontal */}
        <rect x="38" y="5" width="3" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
        {/* Rodas */}
        <circle cx="8"  cy="24" r="4" stroke="white" strokeWidth="1.8"/>
        <circle cx="30" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
        {/* Linha de base */}
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
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function EditIconFilled({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );
}
function TrashIconFilled({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
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

  /* LOADING FULLSCREEN */
  .loading-screen {
    position: fixed; inset: 0;
    background: #01233F;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; z-index: 9999;
  }
  .loading-spinner {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 2.5px solid rgba(241,187,19,0.15);
    border-top-color: #f1bb13;
    animation: spin 0.8s cubic-bezier(0.4,0,0.2,1) infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label {
    font-size: 14px; font-weight: 600;
    color: rgba(255,255,255,0.75);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
  }

  /* SIDEBAR */
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

  /* CONTENT */
  .content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* TOPBAR */
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--text); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; overflow: hidden; transition: border-color 0.15s; flex-shrink: 0; }
  .topbar-avatar:hover { border-color: var(--yellow-dark); }

  /* MAIN */
  .main { padding: 32px; flex: 1; }

  .top-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .page-title { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: 0.3px; white-space: nowrap; margin: 0; flex-shrink: 0; }

  .search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid var(--border); border-radius: 8px; padding: 0 14px; height: 40px; flex: 1; min-width: 180px; gap: 8px; transition: border-color 0.15s, box-shadow 0.15s; }
  .search-wrap:focus-within { border-color: var(--yellow); box-shadow: 0 0 0 3px rgba(241,187,19,0.1); }
  .search-wrap svg { color: var(--muted); flex-shrink: 0; }
  .search-input { border: none; outline: none; font-size: 13px; color: var(--text); width: 100%; background: transparent; font-family: 'DM Sans', sans-serif; }
  .search-input::placeholder { color: #b0bac6; }

  .btn-primary { background: var(--yellow); border: none; border-radius: 8px; padding: 0 20px; height: 40px; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .btn-primary:hover { background: var(--yellow-dark); }

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
  .td-ops { display: flex; align-items: center; gap: 6px; }

  .btn-edit { display: inline-flex; align-items: center; gap: 5px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: var(--text); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .btn-edit:hover { background: var(--navy); color: #fff; border-color: var(--navy); }
  .btn-delete { display: inline-flex; align-items: center; gap: 5px; background: #fff5f5; border: 1px solid #fecaca; border-radius: 6px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: #dc2626; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .btn-delete:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

  .feedback { text-align: center; font-size: 14px; padding: 48px 20px; color: var(--muted); }
  .feedback.error { color: #dc2626; }

  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .main { padding: 20px 16px; }
    .top-bar { flex-wrap: wrap; }
  }
`;

export default function ListaEscolasPage() {
  const router = useRouter();
  const { schools, loading, error, deleteSchool } = useSchools();
  const [search, setSearch] = useState("");

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()) ||
      s.cep.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta escola?")) return;
    try {
      await deleteSchool(id);
      alert("✓ Escola excluída com sucesso!");
    } catch {
      alert("✗ Erro ao excluir escola. Tente novamente.");
    }
  };

  // ── Loading fullscreen — igual ao que era no perfil ──
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
            <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}><FinanceIconFilled /> Financeiro</button>
            <span className="nav-label">Cadastros</span>
            <button className="nav-item" onClick={() => router.push("/lista_onibus")}><BusFrontIcon /> Ônibus</button>
            <button className="nav-item" onClick={() => router.push("/lista_rotas")}><RouteIconFilled /> Rotas</button>
            <button className="nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIconFilled /> Motoristas</button>
            <button className="nav-item active"><SchoolIconFilled /> Escolas</button>
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
          <header className="topbar">
            <div>
              <div className="topbar-title">Escolas</div>
              <div className="topbar-sub">Escolas cadastradas no sistema</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled /><span className="notif-dot" />
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">A</div>
            </div>
          </header>

          <main className="main">
            <div className="top-bar">
              <h2 className="page-title">Escolas cadastradas</h2>
              <div className="search-wrap">
                <SearchIcon />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar escola..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => router.push("/cadastro_escola")}>
                Cadastrar escola
              </button>
            </div>

            <div className="table-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th><th>CEP</th><th>Endereço</th><th>Operações</th>
                  </tr>
                </thead>
                <tbody>
                  {error ? (
                    <tr><td colSpan={4} className="feedback error">{error}</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={4} className="feedback">Nenhuma escola cadastrada.</td></tr>
                  ) : (
                    filtered.reverse().map((school) => (
                      <tr key={school.id}>
                        <td className="td-name">{school.name}</td>
                        <td className="td-muted">{school.cep}</td>
                        <td className="td-muted">{school.address}</td>
                        <td>
                          <div className="td-ops">
                            <button className="btn-edit" onClick={() => router.push(`/editEscola?id=${school.id}`)}>
                              <EditIconFilled size={13} /> Editar
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(school.id)}>
                              <TrashIconFilled size={13} /> Excluir
                            </button>
                          </div>
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
    </>
  );
}

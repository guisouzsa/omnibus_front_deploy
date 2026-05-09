"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import { useSchools } from "@/hooks/useSchools";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

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

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #01233F; --yellow: #f1bb13; --yellow-dark: #d9a700;
    --bg: #f0f2f5; --border: #e2e6ea; --muted: #6b7a8d;
    --red: #ef4444; --sidebar-w: 220px;
  }
  body { font-family: 'DM Sans', sans-serif; font-weight: 400; }
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
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--navy); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; flex-shrink: 0; }
  .topbar-avatar:hover { border-color: var(--yellow-dark); }

  /* ── Body / Card ── */
  .body { padding: 44px 52px; display: flex; flex-direction: column; align-items: center; flex: 1; }
  .page-title { font-size: 20px; font-weight: 600; color: var(--navy); letter-spacing: 0.3px; margin-bottom: 28px; text-align: center; }
  .card { background: #fff; border-radius: 12px; padding: 52px 56px 48px; width: 100%; max-width: 800px; box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04); border: 1px solid var(--border); }
  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .field.full { width: 100%; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .row .field { margin-bottom: 20px; }
  .label { font-size: 11px; font-weight: 600; color: var(--navy); letter-spacing: 0.8px; text-transform: uppercase; }
  .input { width: 100%; height: 52px; border: 1.5px solid var(--border); border-radius: 8px; padding: 0 16px; font-size: 14px; font-weight: 400; color: var(--navy); background: #f7f8fa; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
  .input::placeholder { color: #b0bac6; font-size: 13px; font-weight: 400; }
  .input:focus { border-color: var(--yellow); background: #fff; box-shadow: 0 0 0 3px rgba(241,187,19,0.12); }
  .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; font-weight: 500; }
  .alert-error { background: #fde8e8; color: #7f1d1d; border: 1px solid #fca5a5; }
  .btn { width: 100%; height: 52px; background: var(--yellow); border: none; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 1px; color: #ffffff; text-transform: uppercase; cursor: pointer; margin-top: 8px; font-family: 'DM Sans', sans-serif; transition: background 0.15s, transform 0.1s; }
  .btn:hover { background: var(--yellow-dark); transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }
  .btn:disabled { background: #d1d5db; color: #9ca3af; cursor: not-allowed; transform: none; }
  .btn-secondary { background: #f0f2f5; color: var(--navy); }
  .btn-secondary:hover { background: #e2e6ea; transform: translateY(-1px); }

  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .body { padding: 32px 20px; }
    .card { padding: 32px 24px; }
    .row { grid-template-columns: 1fr; }
  }
`;

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function CadastroRotaPage() {
  const router = useRouter();
  const { createRoute, getAddressesByCep, loading } = useRoutes(false);
  const { schools, fetchSchools } = useSchools(false);

  const [form, setForm] = useState({
    name: "",
    start_point_cep: "",
    start_point: "",
    start_point_reference: "",
    departure_time: "",
    school_id: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    fetchSchools({ per_page: 100 });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleCep = async () => {
    if (!form.start_point_cep) return;
    setLoadingCep(true);
    await getAddressesByCep(form.start_point_cep);
    setLoadingCep(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.name || !form.start_point_cep || !form.departure_time || !form.school_id) {
      setErrorMessage("Preencha todos os campos obrigatórios");
      return;
    }

    await createRoute(form);
    router.push("/lista_rotas");
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
            <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}><FinanceIconFilled /> Financeiro</button>
            <span className="nav-label">Cadastros</span>
            <button className="nav-item" onClick={() => router.push("/lista_onibus")}><BusFrontIcon /> Ônibus</button>
            <button className="nav-item active"><RouteIconFilled /> Rotas</button>
            <button className="nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIconFilled /> Motoristas</button>
            <button className="nav-item" onClick={() => router.push("/lista_escolas")}><SchoolIconFilled /> Escolas</button>
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
              <div className="topbar-title">Cadastrar Rota</div>
              <div className="topbar-sub">Adicione uma nova rota ao sistema</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled /><span className="notif-dot" />
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">A</div>
            </div>
          </header>

          {/* ── Card ── */}
          <div className="body">
            <h2 className="page-title">Cadastre uma nova rota</h2>
            <div className="card">
              {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

              <form onSubmit={handleSubmit}>

                <div className="field full">
                  <label className="label">Nome da Rota</label>
                  <input
                    type="text"
                    className="input"
                    name="name"
                    placeholder="Ex: Rota Centro – Escola Municipal"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="field">
                    <label className="label">CEP</label>
                    <input
                      type="text"
                      className="input"
                      name="start_point_cep"
                      placeholder="Ex: 62900-000"
                      value={form.start_point_cep}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className={`btn btn-secondary`}
                      style={{ marginTop: 0 }}
                      onClick={handleCep}
                      disabled={loadingCep}
                    >
                      {loadingCep ? "Buscando..." : "Buscar CEP"}
                    </button>
                  </div>
                </div>

                <div className="field full">
                  <label className="label">Referência</label>
                  <input
                    type="text"
                    className="input"
                    name="start_point_reference"
                    placeholder="Ex: Próximo à praça central"
                    value={form.start_point_reference}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="field">
                    <label className="label">Horário de Partida</label>
                    <input
                      type="time"
                      className="input"
                      name="departure_time"
                      value={form.departure_time}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label className="label">Escola</label>
                    <select
                      className="input"
                      name="school_id"
                      value={form.school_id}
                      onChange={handleChange}
                    >
                      <option value="">Selecione uma escola</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar Rota"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

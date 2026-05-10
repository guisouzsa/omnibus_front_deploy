"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDrivers } from "@/hooks";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";
import { useAuth } from "@/hooks";

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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #01233F; --yellow: #f1bb13; --yellow-dark: #d9a700;
    --bg: #f0f2f5; --card: #ffffff; --border: #e2e6ea;
    --text: #01233F; --muted: #6b7a8d; --red: #ef4444; --sidebar-w: 220px;
  }
  body { font-family: 'DM Sans', sans-serif; font-weight: 400; }
  .layout { display: flex; min-height: 100vh; background: var(--bg); }
  .loading-screen { position: fixed; inset: 0; background: #01233F; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; z-index: 9999; }
  .loading-spinner { width: 40px; height: 40px; border-radius: 50%; border: 2.5px solid rgba(241,187,19,0.15); border-top-color: #f1bb13; animation: spin 0.8s cubic-bezier(0.4,0,0.2,1) infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.75); letter-spacing: 1.5px; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
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
  .content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--navy); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; flex-shrink: 0; }
  .topbar-avatar:hover { border-color: var(--yellow-dark); }
  .body { padding: 44px 52px; display: flex; flex-direction: column; align-items: center; flex: 1; }
  .page-title { font-size: 20px; font-weight: 600; color: var(--navy); letter-spacing: 0.3px; margin-bottom: 28px; text-align: center; }
  .card { background: #fff; border-radius: 12px; padding: 52px 56px 48px; width: 100%; max-width: 800px; box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04); border: 1px solid var(--border); }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .row .field { margin-bottom: 20px; }
  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .field.full { width: 100%; }
  .label { font-size: 11px; font-weight: 600; color: var(--navy); letter-spacing: 0.8px; text-transform: uppercase; }
  .input { width: 100%; height: 52px; border: 1.5px solid var(--border); border-radius: 8px; padding: 0 16px; font-size: 14px; font-weight: 400; color: var(--navy); background: #f7f8fa; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
  .input::placeholder { color: #b0bac6; font-size: 13px; font-weight: 400; }
  .input:focus { border-color: var(--yellow); background: #fff; box-shadow: 0 0 0 3px rgba(241,187,19,0.12); }
  .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; font-weight: 500; }
  .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .alert-error   { background: #fde8e8; color: #7f1d1d; border: 1px solid #fca5a5; }
  .btn { width: 100%; height: 52px; background: var(--yellow); border: none; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 1px; color: #ffffff; text-transform: uppercase; cursor: pointer; margin-top: 8px; font-family: 'DM Sans', sans-serif; transition: background 0.15s, transform 0.1s; }
  .btn:hover { background: var(--yellow-dark); transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }
  .btn:disabled { background: #d1d5db; color: #9ca3af; cursor: not-allowed; transform: none; }
  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .body { padding: 32px 20px; }
    .card { padding: 32px 24px; }
    .row { grid-template-columns: 1fr; }
  }
`;

const LoadingUI = () => (
  <>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span className="loading-label">Carregando</span>
    </div>
  </>
);

// ─── Page ────────────────────────────────────────────────────────────────────
function EditarMotoristaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const initial = (user?.name || user?.email || 'A')?.[0]?.toUpperCase();
  const searchParams = useSearchParams();
  const driverId = searchParams.get("id");

  const { getDriver, updateDriver, loading } = useDrivers(false);

  const [form, setForm] = useState({ nome: "", email: "", telefone: "", numeroCnh: "" });
  const [loadingData,    setLoadingData]    = useState(true);
  const [errorMessage,   setErrorMessage]   = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!driverId) { router.push("/lista_motoristas"); return; }
    const loadDriver = async () => {
      const driver = await getDriver(parseInt(driverId));
      if (driver) {
        setForm({ nome: driver.name, email: driver.email, telefone: driver.phone_number, numeroCnh: driver.license_number });
      } else {
        setErrorMessage("Motorista não encontrado");
      }
      setLoadingData(false);
    };
    loadDriver();
  }, [driverId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); setSuccessMessage("");
    if (!driverId) return;
    if (!form.nome || !form.email || !form.telefone || !form.numeroCnh) { setErrorMessage("Preencha todos os campos"); return; }
    try {
      await updateDriver(parseInt(driverId), { name: form.nome, email: form.email, phone_number: form.telefone, license_number: form.numeroCnh });
      setSuccessMessage("✓ Motorista atualizado com sucesso!");
      setTimeout(() => router.push("/lista_motoristas"), 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao atualizar motorista");
    }
  };

  if (loadingData) return <LoadingUI />;

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
            <button className="nav-item active"><DriverIconFilled /> Motoristas</button>
            <button className="nav-item" onClick={() => router.push("/lista_escolas")}><SchoolIconFilled /> Escolas</button>
          </nav>
          <div className="sidebar-footer">
            <button className="user-row" onClick={() => router.push("/perfil")}>
              <div className="avatar">{initial}</div>
              <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="content">
          <header className="topbar">
            <div>
              <div className="topbar-title">Editar Motorista</div>
              <div className="topbar-sub">Atualize os dados do motorista</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled /><span className="notif-dot" />
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">{initial}</div>
            </div>
          </header>

          <div className="body">
            <h2 className="page-title">Editar motorista</h2>
            <div className="card">
              {errorMessage   && <div className="alert alert-error">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="field full">
                  <label className="label">Nome</label>
                  <input type="text" name="nome" className="input" placeholder="Ex: José Bonifácio Sombra" value={form.nome} onChange={handleChange} />
                </div>
                <div className="row">
                  <div className="field">
                    <label className="label">Email</label>
                    <input type="email" name="email" className="input" placeholder="Ex: jose@gmail.com" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label className="label">Telefone</label>
                    <input type="tel" name="telefone" className="input" placeholder="Ex: (88) 94002-8922" value={form.telefone} onChange={handleChange} />
                  </div>
                </div>
                <div className="field full">
                  <label className="label">Número da CNH</label>
                  <input type="text" name="numeroCnh" className="input" placeholder="Ex: 07234567889" value={form.numeroCnh} onChange={handleChange} />
                </div>
                <button type="submit" className="btn" disabled={loading}>{loading ? "Salvando..." : "Salvar Alterações"}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Wrapper com Suspense (obrigatório pelo Next.js para useSearchParams) ─────
export default function Page() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <EditarMotoristaPage />
    </Suspense>
  );
}
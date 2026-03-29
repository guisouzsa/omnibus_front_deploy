"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";
import { useDrivers } from "@/hooks/useDrivers";
import { useMask } from "@/hooks/useMask";
import { MASKS } from "@/utils/masks";

// ─── Icons ────────────────────────────────────────────────────────────────────
function BusIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
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
function RouteIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function DriverIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
    </svg>
  );
}
function StudentIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
function DashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function FinanceIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #01233F;
    --yellow: #f1bb13;
    --yellow-dark: #d9a700;
    --bg: #f0f2f5;
    --card: #ffffff;
    --border: #e2e6ea;
    --text: #01233F;
    --muted: #6b7a8d;
    --red: #ef4444;
    --sidebar-w: 220px;
  }

  body { font-family: 'DM Sans', sans-serif; font-weight: 400; }
  .layout { display: flex; min-height: 100vh; background: var(--bg); }

  .sidebar { width: var(--sidebar-w); background: var(--navy); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .logo-icon { width: 34px; height: 34px; background: var(--yellow); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nav-item.active { background: var(--yellow); color: var(--navy); font-weight: 600; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .user-row:hover { background: rgba(255,255,255,0.07); }
  .avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  .content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-size: 16px; font-weight: 600; color: var(--navy); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; font-weight: 400; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--border); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: all 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 1.5px solid #fff; }

  .body { padding: 44px 52px; display: flex; flex-direction: column; align-items: center; flex: 1; }
  .page-title { font-size: 20px; font-weight: 600; color: var(--navy); letter-spacing: 0.3px; margin-bottom: 28px; text-align: center; }

  .card { background: #fff; border-radius: 12px; padding: 52px 56px 48px; width: 100%; max-width: 800px; box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04); border: 1px solid var(--border); }

  .row { display: grid; grid-template-columns: 1fr 160px; gap: 20px; }
  .row .field { margin-bottom: 20px; }
  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }

  .label { font-size: 11px; font-weight: 600; color: var(--navy); letter-spacing: 0.8px; text-transform: uppercase; }

  .input { width: 100%; height: 52px; border: 1.5px solid var(--border); border-radius: 8px; padding: 0 16px; font-size: 14px; font-weight: 400; color: var(--navy); background: #f7f8fa; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
  .input::placeholder { color: #b0bac6; font-size: 13px; font-weight: 400; }
  .input:focus { border-color: var(--yellow); background: #fff; box-shadow: 0 0 0 3px rgba(241,187,19,0.12); }
  select.input { padding-right: 30px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2301233F' d='M6 9L1 4h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; appearance: none; cursor: pointer; }

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

export default function CadastroOnibusPage() {
  const router = useRouter();
  const { createVehicle, loading: vehicleLoading, error: vehicleError } = useVehicles();
  const { drivers, loading: driversLoading } = useDrivers();

  const [form, setForm] = useState({ plate: "", capacity: "", mainRoute: "", driver_id: "" });
  const [submitError,   setSubmitError]   = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitError(null); setSubmitSuccess(false);
  };

  // ── Máscaras ──────────────────────────────────────────────────────────────
  const { ref: placaRef } = useMask(MASKS.placa, handleChange);
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null); setSubmitSuccess(false);
    if (!form.plate || !form.capacity || !form.mainRoute || !form.driver_id) {
      setSubmitError("Todos os campos são obrigatórios"); return;
    }
    const success = await createVehicle({
      plate:     form.plate.toUpperCase(),
      capacity:  parseInt(form.capacity),
      mainRoute: form.mainRoute,
      driver_id: parseInt(form.driver_id),
    });
    if (success) {
      setSubmitSuccess(true);
      setForm({ plate: "", capacity: "", mainRoute: "", driver_id: "" });
      setTimeout(() => router.push("/lista_onibus"), 2000);
    } else {
      setSubmitError(vehicleError || "Erro ao cadastrar ônibus");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon"><BusIcon size={18} color="#01233F" /></div>
            <div><div className="logo-text">Omnibus</div><div className="logo-sub">Gestão Escolar</div></div>
          </div>
          <nav className="sidebar-nav">
            <span className="nav-label">Principal</span>
            <button className="nav-item" onClick={() => router.push("/dashboard")}><DashIcon /> Dashboard</button>
            <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}><FinanceIcon /> Financeiro</button>
            <span className="nav-label">Cadastros</span>
            <button className="nav-item active"><BusIcon size={17} /> Ônibus</button>
            <button className="nav-item" onClick={() => router.push("/lista_rotas")}><RouteIcon size={17} /> Rotas</button>
            <button className="nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIcon size={17} /> Motoristas</button>
            <button className="nav-item" onClick={() => router.push("/lista_alunos")}><StudentIcon size={17} /> Alunos</button>
          </nav>
          <div className="sidebar-footer">
            <button className="user-row" onClick={() => router.push("/infor_instituicao")}>
              <div className="avatar">A</div>
              <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
            </button>
          </div>
        </aside>

        <div className="content">
          <header className="topbar">
            <div>
              <div className="topbar-title">Cadastrar Ônibus</div>
              <div className="topbar-sub">Adicione um novo veículo à frota</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notifications")}><BellIcon /><span className="notif-dot" /></button>
              <button className="icon-btn" onClick={() => router.push("/infor_instituicao")}><UserIcon /></button>
            </div>
          </header>

          <div className="body">
            <h2 className="page-title">Cadastre um novo ônibus</h2>
            <div className="card">
              {submitSuccess && <div className="alert alert-success">✓ Ônibus cadastrado com sucesso! Redirecionando...</div>}
              {submitError   && <div className="alert alert-error">{submitError}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="field">
                    <label className="label">Placa do Veículo</label>
                    {/* máscara de placa — iMask controla o input */}
                    <input
                      ref={placaRef}
                      type="text"
                      name="plate"
                      className="input"
                      placeholder="Ex: ABC1D23"
                      maxLength={7}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="label">Capacidade</label>
                    {/* capacidade é number simples — sem máscara, React controla */}
                    <input
                      type="number"
                      name="capacity"
                      className="input"
                      placeholder="Ex: 45"
                      value={form.capacity}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Rota Principal</label>
                  <input
                    type="text"
                    name="mainRoute"
                    className="input"
                    placeholder="Ex: Ingá - Centro"
                    value={form.mainRoute}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label className="label">Motorista Principal</label>
                  {driversLoading ? (
                    <div className="input" style={{ display: "flex", alignItems: "center", color: "#888" }}>Carregando motoristas...</div>
                  ) : (
                    <select name="driver_id" className="input" value={form.driver_id} onChange={handleChange} required>
                      <option value="">Selecione um motorista</option>
                      {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  )}
                </div>

                <button type="submit" className="btn" disabled={vehicleLoading || driversLoading}>
                  {vehicleLoading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const AVATARS = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
];

interface Institution {
  id: number;
  name: string;
  email: string;
  city_state: string;
  cnpj: string;
  created_at?: string;
  updated_at?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [avatarSelecionado, setAvatarSelecionado] = useState(AVATARS[0]);
  const [avatarTemp, setAvatarTemp] = useState(AVATARS[0]);
  const [mostrarAvatars, setMostrarAvatars] = useState(false);

  const [form, setForm] = useState<Institution>({
    id: 1,
    name: "EEEP JEOVÁ COSTA LIMA",
    email: "epjoeova@gmail.com",
    city_state: "RUSSAS-CE",
    cnpj: "00.000.000/0001-91",
  });

  const [formEdit, setFormEdit] = useState<Institution>({ ...form });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ ...formEdit, updated_at: new Date().toISOString() });
    setAvatarSelecionado(avatarTemp);
    setEditando(false);
    setMostrarAvatars(false);
  };

  const handleCancel = () => {
    setFormEdit({ ...form });
    setAvatarTemp(avatarSelecionado);
    setEditando(false);
    setMostrarAvatars(false);
  };

  return (
    <div className="page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
              <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
            </svg>
          </div>
          <div><div className="logo-text">Omnibus</div><div className="logo-sub">Gestão Escolar</div></div>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-label">Principal</span>
          <button className="nav-item" onClick={() => router.push("/dashboard")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Financeiro
          </button>
          <span className="nav-label">Cadastros</span>
          <button className="nav-item" onClick={() => router.push("/lista_onibus")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/></svg>
            Ônibus
          </button>
          <button className="nav-item" onClick={() => router.push("/lista_rotas")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            Rotas
          </button>
          <button className="nav-item" onClick={() => router.push("/lista_motoristas")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>
            Motoristas
          </button>
          <button className="nav-item" onClick={() => router.push("/lista_alunos")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Alunos
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="user-row" onClick={() => router.push("/perfil")}>
            <div className="avatar-sb">A</div>
            <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
          </button>
          <SidebarLogoutButton />
        </div>
      </aside>

      {/* CONTENT */}
      <div className="content-wrap">
        <header className="topbar">
          <div>
            <div className="topbar-title">Perfil</div>
            <div className="topbar-sub">Informações da instituição</div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn-top" onClick={() => router.push("/notificacoes")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="notif-dot-top" />
            </button>
          </div>
        </header>

        <main className="main">
          <div className="card">
            <div className="card-inner">

              <div className="avatar-col">
                <div className="avatar-wrapper">
                  <div className="avatar-circle">
                    <img
                      src={editando ? avatarTemp : avatarSelecionado}
                      alt="Avatar da instituição"
                      className="avatar-img"
                      onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                    />
                  </div>
                  {editando && (
                    <button type="button" className="btn-trocar-avatar" onClick={() => setMostrarAvatars(!mostrarAvatars)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </button>
                  )}
                </div>

                {mostrarAvatars && editando && (
                  <div className="avatar-grid">
                    <p className="avatar-grid-title">Escolha um avatar</p>
                    <div className="avatar-options">
                      {AVATARS.map((av, i) => (
                        <button key={i} type="button" className={`avatar-option${avatarTemp === av ? " selected" : ""}`} onClick={() => { setAvatarTemp(av); setMostrarAvatars(false); }}>
                          <img src={av} alt={`Avatar ${i + 1}`} className="avatar-option-img" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!editando && (
                  <button className="btn-editar" onClick={() => { setEditando(true); setAvatarTemp(avatarSelecionado); }}>
                    EDITAR
                  </button>
                )}
              </div>

              <div className="fields-col">
                {editando ? (
                  <form onSubmit={handleSave}>
                    <div className="field">
                      <label className="label">INSTITUIÇÃO <span className="dot">•</span></label>
                      <input type="text" name="name" className="input" value={formEdit.name} onChange={handleChange} />
                    </div>
                    <div className="field">
                      <label className="label">EMAIL</label>
                      <input type="email" name="email" className="input" value={formEdit.email} onChange={handleChange} />
                    </div>
                    <div className="field">
                      <label className="label">CIDADE / UF</label>
                      <input type="text" name="city_state" className="input" value={formEdit.city_state} onChange={handleChange} />
                    </div>
                    <div className="field">
                      <label className="label">CNPJ</label>
                      <input type="text" name="cnpj" className="input" value={formEdit.cnpj} onChange={handleChange} />
                    </div>
                    <div className="btn-row">
                      <button type="button" className="btn-cancelar" onClick={handleCancel}>CANCELAR</button>
                      <button type="submit" className="btn-salvar">SALVAR</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="field">
                      <label className="label">INSTITUIÇÃO <span className="dot">•</span></label>
                      <div className="value-box">{form.name}</div>
                    </div>
                    <div className="field">
                      <label className="label">EMAIL</label>
                      <div className="value-box">{form.email}</div>
                    </div>
                    <div className="field">
                      <label className="label">CIDADE / UF</label>
                      <div className="value-box">{form.city_state}</div>
                    </div>
                    <div className="field">
                      <label className="label">CNPJ</label>
                      <div className="value-box">{form.cnpj}</div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page { min-height: 100vh; background: #f0f2f5; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; }

        .sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
        .sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
        .logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
        .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
        .nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
        .nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
        .user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
        .user-row:hover { background: rgba(255,255,255,0.07); }
        .avatar-sb { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
        .user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

        .content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

        .topbar { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .topbar-title { font-size: 16px; font-weight: 600; color: #01233F; }
        .topbar-sub { font-size: 12px; color: #6b7a8d; margin-top: 1px; font-weight: 400; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .icon-btn-top { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e6ea; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #01233F; transition: all 0.15s; position: relative; }
        .icon-btn-top:hover { background: #f0f2f5; }
        .notif-dot-top { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }

        .main { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; flex: 1; }

        .card { background: #ffffff; border-radius: 5px; padding: 48px 56px; width: 85%; max-width: 1000px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
        .card-inner { display: flex; gap: 64px; align-items: flex-start; }

        .avatar-col { display: flex; flex-direction: column; align-items: center; gap: 20px; flex-shrink: 0; min-width: 210px; }
        .avatar-wrapper { position: relative; width: 200px; height: 200px; }
        .avatar-circle { width: 200px; height: 200px; border-radius: 50%; background: #e8edf2; border: 3px solid #d0d8e4; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .btn-trocar-avatar { position: absolute; bottom: 8px; right: 8px; width: 36px; height: 36px; border-radius: 50%; background: #01233F; border: 2px solid #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; padding: 0; }
        .btn-trocar-avatar:hover { background: #013560; }
        .avatar-grid { width: 200px; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 5px; padding: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .avatar-grid-title { font-size: 10px; font-weight: 800; color: #888; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; text-align: center; }
        .avatar-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .avatar-option { width: 100%; aspect-ratio: 1; border-radius: 50%; border: 2.5px solid transparent; background: #F3F3F3; cursor: pointer; overflow: hidden; padding: 0; transition: border-color 0.15s; display: flex; align-items: center; justify-content: center; }
        .avatar-option.selected { border-color: #f1bb13; }
        .avatar-option:hover { border-color: #dba900; }
        .avatar-option-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .btn-editar { background: #f1bb13; border: none; border-radius: 4px; height: 40px; width: 120px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase; cursor: pointer; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .btn-editar:hover { background: #dba900; }

        .fields-col { flex: 1; }
        .field { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
        .label { font-size: 11px; font-weight: 800; color: #222; letter-spacing: 1px; text-transform: uppercase; }
        .dot { color: #e53935; font-size: 14px; }
        .value-box { width: 100%; height: 42px; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 14px; font-size: 14px; font-weight: 600; color: #333; background: #F3F3F3; display: flex; align-items: center; }
        .input { width: 100%; height: 42px; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 14px; font-size: 14px; font-weight: 600; color: #333; background: #F3F3F3; outline: none; transition: border-color 0.2s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .input::placeholder { color: #ACACAC; font-weight: 600; }
        .input:focus { border-color: #f1bb13; }
        .btn-row { display: flex; gap: 12px; margin-top: 8px; }
        .btn-cancelar { flex: 1; height: 42px; background: #e0e0e0; border: none; border-radius: 4px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #555; text-transform: uppercase; cursor: pointer; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .btn-cancelar:hover { background: #cfcfcf; }
        .btn-salvar { flex: 1; height: 42px; background: #f1bb13; border: none; border-radius: 4px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase; cursor: pointer; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .btn-salvar:hover { background: #dba900; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .content-wrap { margin-left: 0; }
          .main { padding: 20px 16px; }
          .card { width: 95%; padding: 28px 20px; }
          .card-inner { flex-direction: column; align-items: center; gap: 28px; }
          .avatar-col { width: 100%; }
          .btn-editar { width: 100%; }
          .avatar-grid { width: 100%; }
        }
      `}</style>
    </div>
  );
}
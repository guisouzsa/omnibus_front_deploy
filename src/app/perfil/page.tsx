"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #01233F;
    --yellow: #f1bb13;
    --yellow-dark: #d9a700;
    --bg: #f0f2f5;
    --card: #ffffff;
    --border: #e2e6ea;
    --text: #1a2535;
    --muted: #6b7a8d;
    --green: #22c55e;
    --red: #ef4444;
    --sidebar-w: 220px;
  }

  body { font-family: 'DM Sans', sans-serif; }

  /* ── LOADING ── */
  .p-loading-screen {
    position: fixed; inset: 0;
    background: #01233F;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 32px; z-index: 9999;
  }

  .p-loading-card {
    display: flex; flex-direction: column;
    align-items: center; gap: 24px;
  }

  .p-loading-icon {
    width: 72px; height: 72px;
    background: #f1bb13;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    animation: icon-pulse 2s ease-in-out infinite;
  }

  @keyframes icon-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(241,187,19,0.4); }
    50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(241,187,19,0); }
  }

  .p-loading-texts {
    display: flex; flex-direction: column;
    align-items: center; gap: 8px;
  }

  .p-loading-title {
    font-size: 28px; font-weight: 800;
    color: #ffffff; letter-spacing: -0.5px;
  }

  .p-loading-subtitle {
    font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,0.5); letter-spacing: 3px;
    text-transform: uppercase;
  }

  .p-loading-dots {
    display: flex; gap: 6px; align-items: center;
    margin-top: 8px;
  }

  .p-loading-dot {
    width: 6px; height: 6px;
    border-radius: 50%; background: #f1bb13;
    animation: dot-bounce 1.4s ease-in-out infinite;
  }
  .p-loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .p-loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* ── LAYOUT ── */
  .p-page { min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; display: flex; }

  /* ── SIDEBAR ── */
  .p-sidebar { width: var(--sidebar-w); background: var(--navy); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .p-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; }
  .p-logo-texts { display: flex; flex-direction: column; }
  .p-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .p-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .p-logo-icon { width: 34px; height: 34px; background: var(--yellow); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .p-sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .p-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .p-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .p-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .p-nav-item.active { background: var(--yellow); color: var(--navy); font-weight: 600; }
  .p-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 4px; }
  .p-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .p-user-row:hover { background: rgba(255,255,255,0.07); }
  .p-avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); flex-shrink: 0; }
  .p-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .p-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* ── CONTENT ── */
  .p-content-wrap { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── TOPBAR ── */
  .p-navbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .p-topbar-title { font-size: 18px; font-weight: 700; color: var(--text); }
  .p-topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .p-nav-right { display: flex; align-items: center; gap: 8px; }
  .p-icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .p-icon-btn:hover { background: var(--bg); }
  .p-notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .p-topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; overflow: hidden; transition: border-color 0.15s; flex-shrink: 0; }
  .p-topbar-avatar:hover { border-color: var(--yellow); }
  .p-topbar-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ── MAIN ── */
  .p-main { flex: 1; padding: 40px; display: flex; align-items: center; justify-content: center; }

  /* ── CARD ── */
  .p-card { background: var(--card); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 24px rgba(1,35,63,0.07); max-width: 900px; width: 100%; overflow: hidden; }
  .p-card-banner { background: var(--navy); height: 120px; position: relative; }
  .p-banner-pattern { position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 50%, rgba(241,187,19,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(241,187,19,0.05) 0%, transparent 40%); }
  .p-banner-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--yellow); }
  .p-avatar-wrap { position: absolute; bottom: -52px; left: 40px; z-index: 2; }
  .p-avatar-ring { width: 104px; height: 104px; border-radius: 50%; padding: 3px; background: var(--yellow); box-shadow: 0 8px 24px rgba(1,35,63,0.2); }
  .p-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid #fff; }
  .p-avatar-inner img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .p-avatar-placeholder-lg { font-size: 34px; font-weight: 800; color: var(--navy); user-select: none; }
  .p-online-badge { position: absolute; bottom: 6px; right: 6px; width: 16px; height: 16px; background: var(--green); border-radius: 50%; border: 3px solid #fff; }
  .p-card-body { padding: 68px 40px 40px; }
  .p-profile-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 16px; }
  .p-profile-name { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.4px; }
  .p-profile-role { font-size: 13px; color: var(--muted); margin-top: 4px; font-weight: 500; }
  .p-status-tag { display: inline-flex; align-items: center; gap: 5px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); border-radius: 20px; font-size: 11px; font-weight: 600; color: #16a34a; padding: 3px 10px; margin-top: 8px; }
  .p-status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); }
  .p-btn-group { display: flex; gap: 8px; flex-shrink: 0; padding-top: 4px; }
  .p-btn-edit { background: var(--yellow); color: var(--navy); border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif; }
  .p-btn-edit:hover { background: var(--yellow-dark); }
  .p-btn-cancel { background: #fff; color: var(--muted); border: 1.5px solid var(--border); border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .p-btn-cancel:hover { border-color: #adb5bd; color: var(--text); }
  .p-btn-photo { background: var(--bg); color: var(--text); border: 1.5px solid var(--border); border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .p-btn-photo:hover { border-color: var(--yellow); color: var(--navy); }
  .p-divider { height: 1px; background: var(--border); margin: 0 0 28px; }
  .p-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .p-form-group { display: flex; flex-direction: column; gap: 7px; }
  .p-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; }
  .p-input { border: 1.5px solid var(--border); background: var(--bg); padding: 11px 14px; border-radius: 8px; font-size: 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.15s; outline: none; }
  .p-input:focus { background: #fff; border-color: var(--yellow); box-shadow: 0 0 0 3px rgba(241,187,19,0.1); }
  .p-input:disabled { background: var(--bg); color: var(--muted); cursor: not-allowed; border-color: var(--border); }
  .p-btn-save { background: var(--navy); color: #fff; border: none; border-radius: 8px; padding: 12px 28px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif; margin-top: 24px; }
  .p-btn-save:hover { background: #001829; }
  .p-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 1024px) {
    .p-main { padding: 20px 16px; }
    .p-navbar { padding: 0 16px; }
    .p-form-grid { grid-template-columns: 1fr; }
    .p-card-body { padding: 68px 20px 28px; }
    .p-avatar-wrap { left: 20px; }
  }
  @media (max-width: 900px) {
    :root { --sidebar-w: 0px; }
    .p-sidebar { display: none; }
  }
`;

const normalizeUser = (resp: any) => resp?.data ?? resp?.user ?? resp;

const getPhotoUrl = (photoPath: string | null): string | null => {
  if (!photoPath) return null;
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) return photoPath;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const pathWithSlash = photoPath.startsWith("/") ? photoPath : "/" + photoPath;
  return `${apiBaseUrl}${pathWithSlash}?t=${Date.now()}`;
};

function LoadingScreen() {
  return (
    <div className="p-loading-screen">
      <div className="p-loading-card">
        <div className="p-loading-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="14" rx="2"/>
            <path d="M2 9h20"/>
            <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/>
            <circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/>
            <path d="M5 18h14"/>
          </svg>
        </div>
        <div className="p-loading-texts">
          <div className="p-loading-title">Carregando</div>
          <div className="p-loading-subtitle">Omnibus</div>
          <div className="p-loading-dots">
            <div className="p-loading-dot" />
            <div className="p-loading-dot" />
            <div className="p-loading-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [form, setForm] = useState({ institution: "", email: "" });

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiClient.get("/api/user");
        const userData = normalizeUser(resp);
        setUser(userData);
        setImageError(false);
        setForm({ institution: userData.institution || "", email: userData.email || "" });
      } catch (err) {
        console.error("Erro ao carregar user:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
    setImageError(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("_method", "PATCH");
      if (form.institution) fd.append("institution", form.institution);
      if (form.email) fd.append("email", form.email);
      if (file) fd.append("profile_photo", file);
      const resp = await apiClient.post("/api/user/profile", fd, { isFormData: true });
      const updatedUser = normalizeUser(resp);
      setUser(updatedUser);
      setForm({ institution: updatedUser.institution || "", email: updatedUser.email || "" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFile(null);
      setEditing(false);
      setImageError(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err: any) {
      alert(err?.message || "Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    setImageError(false);
    setForm({ institution: user?.institution || "", email: user?.email || "" });
  };

  const photoUrl = previewUrl ?? (user?.profile_photo ? getPhotoUrl(user.profile_photo) : null);
  const avatarLetter = user?.institution?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "A";

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="p-page">

        <aside className="p-sidebar">
          <div className="p-sidebar-logo">
            <div className="p-logo-texts">
              <div className="p-logo-text">Omnibus</div>
              <div className="p-logo-sub">Gestão Escolar</div>
            </div>
            <div className="p-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/>
                <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/>
                <circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/>
                <path d="M5 18h14"/>
              </svg>
            </div>
          </div>
          <nav className="p-sidebar-nav">
            <span className="p-nav-label">Principal</span>
            <button className="p-nav-item" onClick={() => router.push("/dashboard")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Dashboard
            </button>
            <button className="p-nav-item" onClick={() => router.push("/visualizar_gastos")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Financeiro
            </button>
            <span className="p-nav-label">Cadastros</span>
            <button className="p-nav-item" onClick={() => router.push("/lista_onibus")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/>
                <circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/>
              </svg>
              Ônibus
            </button>
            <button className="p-nav-item" onClick={() => router.push("/lista_rotas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Rotas
            </button>
            <button className="p-nav-item" onClick={() => router.push("/lista_motoristas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
              </svg>
              Motoristas
            </button>
            <button className="p-nav-item" onClick={() => router.push("/lista_escolas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Escolas
            </button>
            <button className="p-nav-item" onClick={() => router.push("/instrucoes")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 2H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h13a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-7 14H8a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2zm4-4H8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2zm0-4H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2z"/>
              </svg>
              Instruções
            </button>
          </nav>
          <div className="p-sidebar-footer">
            <button className="p-user-row">
              <div className="p-avatar">{avatarLetter}</div>
              <div>
                <div className="p-user-name">{user?.institution || user?.name || "Usuário"}</div>
                <div className="p-user-role">Gestor</div>
              </div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="p-content-wrap">
          <header className="p-navbar">
            <div>
              <div className="p-topbar-title">Perfil</div>
              <div className="p-topbar-sub">Informações da instituição</div>
            </div>
            <div className="p-nav-right">
              <button className="p-icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="p-notif-dot" />
              </button>
              <div className="p-topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">
                {photoUrl && !imageError ? (
                  <img src={photoUrl} alt="Perfil" onError={() => setImageError(true)} />
                ) : (
                  avatarLetter
                )}
              </div>
            </div>
          </header>

          <main className="p-main">
            <div className="p-card">
              <div className="p-card-banner">
                <div className="p-banner-pattern" />
                <div className="p-banner-bar" />
                <div className="p-avatar-wrap">
                  <div className="p-avatar-ring">
                    <div className="p-avatar-inner">
                      {photoUrl && !imageError ? (
                        <img src={photoUrl} alt="Foto de perfil" onError={() => setImageError(true)} onLoad={() => setImageError(false)} />
                      ) : (
                        <span className="p-avatar-placeholder-lg">{avatarLetter}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-online-badge" />
                </div>
              </div>

              <div className="p-card-body">
                <div className="p-profile-top">
                  <div>
                    <div className="p-profile-name">{user?.institution || user?.name || "Instituição"}</div>
                    <div className="p-profile-role">Gestor · Omnibus</div>
                    <div className="p-status-tag">
                      <span className="p-status-dot" />
                      Conta ativa
                    </div>
                  </div>
                  <div className="p-btn-group">
                    {!editing ? (
                      <button className="p-btn-edit" onClick={() => setEditing(true)}>Editar perfil</button>
                    ) : (
                      <>
                        <button className="p-btn-photo" onClick={() => document.getElementById("file-input")?.click()}>Trocar foto</button>
                        <button className="p-btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-divider" />

                <div className="p-form-grid">
                  <div className="p-form-group">
                    <label className="p-label">Instituição</label>
                    <input type="text" className="p-input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} disabled={!editing} />
                  </div>
                  <div className="p-form-group">
                    <label className="p-label">Email</label>
                    <input type="email" className="p-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!editing} />
                  </div>
                </div>

                {editing && (
                  <button className="p-btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                )}

                <input id="file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

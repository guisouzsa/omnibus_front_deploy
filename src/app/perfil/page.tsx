"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const css = `
  .p-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; display: flex; }
  .p-sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .p-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .p-logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .p-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .p-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .p-sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .p-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .p-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .p-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .p-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 600; }
  .p-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .p-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .p-user-row:hover { background: rgba(255,255,255,0.07); }
  .p-avatar { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
  .p-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .p-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }
  .p-content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .p-navbar { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .p-topbar-title { font-size: 16px; font-weight: 600; color: #01233F; }
  .p-topbar-sub { font-size: 12px; color: #6b7a8d; margin-top: 1px; font-weight: 400; }
  .p-nav-right { display: flex; align-items: center; gap: 10px; }
  .p-icon-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e6ea; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #01233F; transition: all 0.15s; position: relative; }
  .p-icon-btn:hover { background: #f0f2f5; }
  .p-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }
  .p-main { padding: 32px 40px; display: flex; justify-content: center; }
  .p-card { background: #fff; border-radius: 8px; border: 1px solid #e8e8e8; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 60px; max-width: 1100px; width: 100%; }
  .p-card-header { display: flex; gap: 80px; align-items: flex-start; margin-bottom: 32px; }
  .p-avatar-section { display: flex; flex-direction: column; align-items: center; gap: 20px; flex-shrink: 0; }
  .p-avatar-large { width: 240px; height: 240px; background: #f5f5f5; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid #f1bb13; }
  .p-avatar-large img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .p-avatar-placeholder { color: #999; font-size: 14px; text-align: center; }
  .p-btn-edit { background: #f1bb13; color: #fff; border: none; border-radius: 4px; padding: 12px 28px; font-size: 13px; font-weight: 900; letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .p-btn-edit:hover { background: #dba900; }
  .p-form-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
  .p-form-group { display: flex; flex-direction: column; }
  .p-form-group.full { grid-column: 1 / -1; }
  .p-label { font-size: 13px; font-weight: 900; color: #01233F; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px; }
  .p-input { border: 1px solid #e0e0e0; background: #f9f9f9; padding: 14px 14px; border-radius: 4px; font-size: 15px; color: #1a1a1a; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; font-weight: 500; }
  .p-input:focus { outline: none; background: #fff; border: 2px solid #f1bb13; color: #01233F; }
  .p-input:disabled { background: #f5f5f5; color: #555; cursor: not-allowed; }
  .p-btn-save { background: #01233F; color: #fff; border: none; border-radius: 4px; padding: 14px 32px; font-size: 13px; font-weight: 900; letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; margin-top: 24px; }
  .p-btn-save:hover { background: #000; }
  @media (max-width: 1024px) {
    .p-main { padding: 20px 16px; }
    .p-navbar { padding: 0 16px; }
    .p-card { padding: 24px; }
    .p-card-header { flex-direction: column; align-items: center; }
    .p-form-grid { grid-template-columns: 1fr; }
  }
`;

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

  // Monta a URL completa da foto a partir do caminho retornado pelo backend
  const getPhotoUrl = (photoPath: string | null): string | null => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) return photoPath;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const pathWithSlash = photoPath.startsWith("/") ? photoPath : "/" + photoPath;
    // Adiciona timestamp para evitar cache do browser após atualização
    return `${apiBaseUrl}${pathWithSlash}?t=${Date.now()}`;
  };

  // Normaliza a resposta da API independente do shape retornado
  const normalizeUser = (resp: any) => {
    return resp?.user ?? resp?.data?.user ?? resp?.data ?? resp;
  };

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiClient.get("/api/user");
        const userData = normalizeUser(resp);
        setUser(userData);
        setImageError(false);
        setForm({
          institution: userData.institution || "",
          email: userData.email || "",
        });
      } catch (err) {
        console.error("Erro ao carregar user:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Gera preview local quando o usuário seleciona um arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl); // libera URL anterior
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
    setImageError(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("_method", "PATCH");
      fd.append("institution", form.institution);
      fd.append("email", form.email);
      if (file) fd.append("profile_photo", file);

      const resp = await apiClient.post("/api/user/profile", fd, { isFormData: true });

      // Normaliza resposta independente do shape da API
      const updatedUser = normalizeUser(resp);

      // Atualiza user e form com dados vindos do backend
      setUser(updatedUser);
      setForm({
        institution: updatedUser.institution || "",
        email: updatedUser.email || "",
      });

      // Limpa preview e estado de edição
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFile(null);
      setEditing(false);
      setImageError(false);

      alert("Perfil atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
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
    // Restaura form com valores atuais do user
    setForm({
      institution: user?.institution || "",
      email: user?.email || "",
    });
  };

  const photoUrl = previewUrl ?? (user?.profile_photo ? getPhotoUrl(user.profile_photo) : null);

  if (loading) {
    return (
      <div className="p-page">
        <aside className="p-sidebar">
          <div className="p-sidebar-logo">
            <div className="p-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
                <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
              </svg>
            </div>
            <div><div className="p-logo-text">Omnibus</div><div className="p-logo-sub">Gestão Escolar</div></div>
          </div>
        </aside>
        <div className="p-content-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#999", fontSize: "14px" }}>Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="p-page">
        <aside className="p-sidebar">
          <div className="p-sidebar-logo">
            <div className="p-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
                <circle cx="7" cy="20" r="2" fill="#01233F" stroke="#01233F"/><circle cx="17" cy="20" r="2" fill="#01233F" stroke="#01233F"/><path d="M5 18h14"/>
              </svg>
            </div>
            <div><div className="p-logo-text">Omnibus</div><div className="p-logo-sub">Gestão Escolar</div></div>
          </div>
          <nav className="p-sidebar-nav">
            <span className="p-nav-label">Principal</span>
            <button className="p-nav-item" onClick={() => router.push("/dashboard")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
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
                <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M5 18h14"/>
              </svg>
              Ônibus
            </button>
            <button className="p-nav-item" onClick={() => router.push("/lista_rotas")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Escolas
            </button>
          </nav>
          <div className="p-sidebar-footer">
            <button className="p-user-row" style={{ cursor: "default" }}>
              <div className="p-avatar">A</div>
              <div><div className="p-user-name">Admin</div><div className="p-user-role">Gestor</div></div>
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="p-notif-dot" />
              </button>
            </div>
          </header>

          <main className="p-main">
            <div className="p-card">
              <div className="p-card-header">
                <div className="p-avatar-section">
                  <div className="p-avatar-large">
                    {photoUrl && !imageError ? (
                      <img
                        src={photoUrl}
                        alt="Foto de perfil"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                    ) : (
                      <div className="p-avatar-placeholder">Sem foto</div>
                    )}
                  </div>

                  {!editing ? (
                    <button className="p-btn-edit" onClick={() => setEditing(true)}>
                      Editar
                    </button>
                  ) : (
                    <>
                      <button
                        className="p-btn-edit"
                        onClick={() => document.getElementById("file-input")?.click()}
                      >
                        Selecionar Foto
                      </button>
                      <button
                        className="p-btn-edit"
                        style={{ background: "#6b7a8d" }}
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div className="p-form-grid">
                    <div className="p-form-group">
                      <label className="p-label">Instituição</label>
                      <input
                        type="text"
                        className="p-input"
                        value={form.institution}
                        onChange={(e) => setForm({ ...form, institution: e.target.value })}
                        disabled={!editing}
                      />
                    </div>
                    <div className="p-form-group">
                      <label className="p-label">Email</label>
                      <input
                        type="email"
                        className="p-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  {editing && (
                    <button className="p-btn-save" onClick={handleSave} disabled={saving}>
                      {saving ? "Salvando..." : "Salvar"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

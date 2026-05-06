"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSchools } from "@/hooks/useSchools";
import { useRoutes } from "@/hooks/useRoutes";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

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

  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .row .field { margin-bottom: 20px; }
  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }

  .label { font-size: 11px; font-weight: 600; color: var(--navy); letter-spacing: 0.8px; text-transform: uppercase; }

  .input { width: 100%; height: 52px; border: 1.5px solid var(--border); border-radius: 8px; padding: 0 16px; font-size: 14px; font-weight: 400; color: var(--navy); background: #f7f8fa; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
  .input::placeholder { color: #b0bac6; font-size: 13px; font-weight: 400; }
  .input:focus { border-color: var(--yellow); background: #fff; box-shadow: 0 0 0 3px rgba(241,187,19,0.12); }

  .cep-row { display: grid; grid-template-columns: 1fr 120px; gap: 10px; }
  .btn-cep { height: 52px; border: none; border-radius: 8px; background: var(--navy); color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; }
  .btn-cep:hover { opacity: 0.85; }
  .btn-cep:disabled { opacity: 0.4; cursor: not-allowed; }

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
    .cep-row { grid-template-columns: 1fr 100px; }
  }
`;

function EditarEscolaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('id');
  
  const { getSchool, updateSchool, loading } = useSchools(false);
  const { getAddressesByCep } = useRoutes(false);

  const [form, setForm] = useState({ name: "", cep: "", address: "", reference_point: "" });
  const [loadingData,   setLoadingData]   = useState(true);
  const [submitError,   setSubmitError]   = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchingCep,  setSearchingCep]  = useState(false);

  useEffect(() => {
    if (!schoolId) { router.push('/lista_escolas'); return; }

    const loadSchool = async () => {
      const response = await getSchool(parseInt(schoolId));
      const school = (response as any)?.data || response;
      if (school) {
        setForm({
          name: school.name,
          cep: school.cep,
          address: school.address,
          reference_point: school.reference_point || "",
        });
      } else {
        setSubmitError('Escola não encontrada');
      }
      setLoadingData(false);
    };

    loadSchool();
  }, [schoolId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSearchCep = async () => {
    setSearchingCep(true);
    setSubmitError(null);
    try {
      const options = await getAddressesByCep(form.cep);
      if (!options.length) { setSubmitError("Não encontramos endereços para esse CEP."); return; }
      setForm((prev) => ({ ...prev, address: options[0].address }));
    } catch (err: any) {
      setSubmitError(err?.message || "Erro ao consultar CEP");
    } finally {
      setSearchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    if (!schoolId) return;
    
    try {
      await updateSchool(parseInt(schoolId), form);
      setSubmitSuccess(true);
      setTimeout(() => router.push("/lista_escolas"), 2000);
    } catch (err: any) {
      setSubmitError(err?.message || "Erro ao atualizar escola");
    }
  };

  if (loadingData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
        Carregando dados da escola...
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="layout">
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
            <button className="nav-item active">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Escolas
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="user-row" onClick={() => router.push("/infor_instituicao")}>
              <div className="avatar">A</div>
              <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="content">
          <header className="topbar">
            <div>
              <div className="topbar-title">Editar Escola</div>
              <div className="topbar-sub">Atualize os dados da escola</div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span className="notif-dot" />
              </button>
              <button className="icon-btn" onClick={() => router.push("/infor_instituicao")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
            </div>
          </header>

          <div className="body">
            <h2 className="page-title">Editar Escola</h2>
            <div className="card">
              {submitSuccess && <div className="alert alert-success">✓ Escola atualizada com sucesso! Redirecionando...</div>}
              {submitError   && <div className="alert alert-error">{submitError}</div>}

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Nome da Escola</label>
                  <input type="text" name="name" className="input" placeholder="Ex: Escola Municipal João Silva" value={form.name} onChange={handleChange} required />
                </div>

                <div className="row">
                  <div className="field">
                    <label className="label">CEP</label>
                    <div className="cep-row">
                      <input type="text" name="cep" className="input" placeholder="Ex: 58000000" value={form.cep} onChange={handleChange} required />
                      <button type="button" className="btn-cep" onClick={handleSearchCep} disabled={searchingCep || !form.cep}>
                        {searchingCep ? "..." : "Buscar"}
                      </button>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Ponto de Referência</label>
                    <input type="text" name="reference_point" className="input" placeholder="Ex: Próximo à praça central" value={form.reference_point} onChange={handleChange} />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Endereço</label>
                  <input type="text" name="address" className="input" placeholder="Preenchido automaticamente pelo CEP" value={form.address} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Atualizando..." : "Atualizar Escola"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EditarEscolaPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>Carregando...</div>}>
      <EditarEscolaContent />
    </Suspense>
  );
}

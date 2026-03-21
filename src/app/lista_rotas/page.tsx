"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";

// ─── Entidade routes conforme banco de dados ───────────────────────────────────
type Route = {
  id: number;
  name: string;
  start_point: string;
  end_point: string;
  departure_time: string;
};

const css = `
  .rc-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }

  /* NAVBAR */
  .rc-navbar { width: 100%; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 56px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .rc-nav-links { display: flex; align-items: center; gap: 28px; }
  .rc-nav-link { font-size: 13px; font-weight: 700; color: #01233F; letter-spacing: 0.5px; text-transform: uppercase; background: none; border: none; cursor: pointer; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .rc-nav-link:hover { color: #888; }
  .rc-nav-right { display: flex; align-items: center; gap: 16px; }
  .rc-notif-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  .rc-notif-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; color: #01233F; transition: opacity 0.15s; }
  .rc-notif-btn:hover { opacity: 0.7; }
  .rc-user-btn { background: #01233F; width: 36px; height: 36px; border: 2px solid #01233F; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: opacity 0.15s; padding: 0; color: #fff; }
  .rc-user-btn:hover { opacity: 0.8; }

  /* MAIN — container central alinha top-bar e tabela */
  .rc-main { padding: 32px 40px; }
  .rc-content { width: 100%; }

  /* TOP BAR — mesma largura da tabela */
  .rc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .rc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; }
  .rc-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 12px; height: 38px; flex: 1; min-width: 180px; gap: 8px; }
  .rc-search-input { border: none; outline: none; font-size: 13px; color: #333; width: 100%; background: transparent; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .rc-search-input::placeholder { color: #aaa; }
  .rc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .rc-btn-cadastrar:hover { background: #dba900; }

  /* TABELA */
  .rc-table-wrap { width: 100%; overflow-x: auto; border-radius: 4px; }
  .rc-table { width: 100%; border-collapse: collapse; }
  .rc-table thead tr { background: #01233F; }
  .rc-table thead th { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 14px 18px; text-align: left; }
  .rc-table tbody tr { border-bottom: 1px solid #e8e8e8; background: #fff; }
  .rc-table tbody tr:hover { background: #fafafa; }
  .rc-table tbody td { padding: 14px 18px; font-size: 13px; color: #333; }
  .rc-td-bold { font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 12px; }
  .rc-td-time { font-weight: 600; color: #444; font-size: 13px; }
  .rc-td-ops { display: flex; align-items: center; gap: 14px; }
  .rc-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .rc-btn-excluir:hover { opacity: 0.7; }
  .rc-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .rc-btn-editar:hover { opacity: 0.6; }
  .rc-feedback { text-align: center; font-size: 14px; padding: 32px; color: #aaa; }
  .rc-feedback.error { color: #c0392b; }

  @media (max-width: 700px) {
    .rc-main { padding: 20px 16px; }
    .rc-top-bar { flex-direction: column; align-items: flex-start; }
    .rc-search-wrap { width: 100%; }
  }
`;

export default function RotasCadastradasPage() {
  const router = useRouter();
  const { routes, loading, error, deleteRoute } = useRoutes();
  const [search, setSearch] = useState("");

  const filtered = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.start_point.toLowerCase().includes(search.toLowerCase()) ||
      r.end_point.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteRoute(id);
    } catch {
      alert("Erro ao excluir rota. Tente novamente.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editRota?id=${id}`);
  };

  const handleViewMap = (id: number) => {
    router.push(`/visualizar_rota?id=${id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="rc-page">
        <nav className="rc-navbar">
          <div className="rc-nav-links">
            <button onClick={() => router.push("/dashboard")} className="rc-nav-link">DASHBOARD</button>
            <button onClick={() => router.push("/financeiro")} className="rc-nav-link">FINANCEIRO</button>
          </div>
          <div className="rc-nav-right">
            <div className="rc-notif-wrap">
              <button className="rc-notif-btn" title="Notificações" onClick={() => router.push("/notificacoes")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </div>
            <button className="rc-user-btn" title="Usuário" onClick={() => router.push("/perfil")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </nav>

        <main className="rc-main">
          <div className="rc-content">
            {/* Top bar com mesma largura da tabela */}
            <div className="rc-top-bar">
              <h2 className="rc-title">ROTAS CADASTRADAS</h2>
              <div className="rc-search-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="rc-search-input"
                  placeholder="Procurar rota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="rc-btn-cadastrar" onClick={() => router.push("/cadastro_rota")}>
                CADASTRAR ROTAS
              </button>
              <button className="rc-btn-cadastrar" onClick={() => router.push("/lista_escolas")}
              >
                GERENCIAR ESCOLAS
              </button>
            </div>

            {/* Tabela */}
            <div className="rc-table-wrap">
              <table className="rc-table">
                <thead>
                  <tr>
                    <th>NOME DA ROTA</th>
                    <th>PARADA INICIAL</th>
                    <th>ÚLTIMA PARADA</th>
                    <th>HORÁRIO DE SAÍDA</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="rc-feedback">Carregando rotas...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={5} className="rc-feedback error">{error}</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="rc-feedback">Nenhuma rota encontrada.</td></tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id}>
                        <td className="rc-td-bold">{r.name}</td>
                        <td className="rc-td-bold">{r.start_point}</td>
                        <td className="rc-td-bold">{r.end_point}</td>
                        <td className="rc-td-time">{r.departure_time}</td>
                        <td className="rc-td-ops">
                          <button className="rc-btn-editar" onClick={() => handleViewMap(r.id)}>MAPA</button>
                          <button className="rc-btn-excluir" onClick={() => handleDelete(r.id)}>EXCLUIR</button>
                          <button className="rc-btn-editar" onClick={() => handleEdit(r.id)}>EDITAR</button>
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
    </>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";

const css = `
  .oc-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-navbar { width: 100%; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 56px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .oc-nav-links { display: flex; align-items: center; gap: 28px; }
  .oc-nav-link { font-size: 13px; font-weight: 700; color: #01233F; letter-spacing: 0.5px; text-transform: uppercase; background: none; border: none; cursor: pointer; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-nav-link:hover { color: #888; }
  .oc-nav-right { display: flex; align-items: center; gap: 16px; }
  .oc-notif-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  .oc-notif-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; color: #01233F; transition: opacity 0.15s; }
  .oc-notif-btn:hover { opacity: 0.7; }
  .oc-user-btn { background: #01233F; width: 36px; height: 36px; border: 2px solid #01233F; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: opacity 0.15s; padding: 0; color: #fff; }
  .oc-user-btn:hover { opacity: 0.8; }
  .oc-main { padding: 32px 40px; }
  .oc-content { width: 100%; }
  .oc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .oc-title { font-size: 16px; font-weight: 900; color: #1a1a1a; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; }
  .oc-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e0e0; border-radius: 4px; padding: 0 12px; height: 38px; flex: 1; min-width: 180px; gap: 8px; }
  .oc-search-input { border: none; outline: none; font-size: 13px; color: #333; width: 100%; background: transparent; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-search-input::placeholder { color: #aaa; }
  .oc-btn-cadastrar { background: #f1bb13; border: none; border-radius: 4px; padding: 0 22px; height: 38px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .oc-btn-cadastrar:hover { background: #dba900; }
  .oc-table-wrap { width: 100%; overflow-x: auto; border-radius: 4px; }
  .oc-table { width: 100%; border-collapse: collapse; }
  .oc-table thead tr { background: #01233F; }
  .oc-table thead th { color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 14px 18px; text-align: left; }
  .oc-table tbody tr { border-bottom: 1px solid #e8e8e8; background: #fff; }
  .oc-table tbody tr:hover { background: #fafafa; }
  .oc-table tbody td { padding: 14px 18px; font-size: 13px; color: #333; }
  .oc-td-bold { font-weight: 800; color: #1a1a1a; text-transform: uppercase; font-size: 12px; }
  .oc-td-driver { font-weight: 500; color: #444; }
  .oc-driver-pending { display: inline-block; background: #fff3cd; color: #856404; border: 1px solid #ffeeba; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
  .oc-td-ops { display: flex; align-items: center; gap: 14px; }
  .oc-btn-excluir { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #c0392b; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-excluir:hover { opacity: 0.7; }
  .oc-btn-editar { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 800; color: #333; letter-spacing: 0.5px; text-transform: uppercase; padding: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: opacity 0.15s; }
  .oc-btn-editar:hover { opacity: 0.6; }
  .oc-feedback { text-align: center; font-size: 14px; padding: 32px; color: #aaa; }
  .oc-feedback.error { color: #c0392b; }
  @media (max-width: 700px) {
    .oc-main { padding: 20px 16px; }
    .oc-top-bar { flex-direction: column; align-items: flex-start; }
    .oc-search-wrap { max-width: 100%; width: 100%; }
  }
`;

export default function OnibusCadastradosPage() {
  const router = useRouter();
  const { vehicles, loading, error, deleteVehicle } = useVehicles();
  const [search, setSearch] = useState("");

  const filtered = (vehicles || []).filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.mainRoute.toLowerCase().includes(search.toLowerCase()) ||
      (v.driver?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este ônibus?')) {
      return;
    }
    
    const success = await deleteVehicle(id);
    if (!success) {
      alert('Erro ao excluir ônibus. Tente novamente.');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/editOnibus?id=${id}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="oc-page">
        <nav className="oc-navbar">
          <div className="oc-nav-links">
            <button onClick={() => router.push("/dashboard")} className="oc-nav-link">DASHBOARD</button>
            <button onClick={() => router.push("/financeiro")} className="oc-nav-link">FINANCEIRO</button>
          </div>
          <div className="oc-nav-right">
            <div className="oc-notif-wrap">
              <button className="oc-notif-btn" title="Notificações" onClick={() => router.push("/notificacoes")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </div>
            <button className="oc-user-btn" title="Usuário" onClick={() => router.push("/perfil")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </nav>

        <main className="oc-main">
          <div className="oc-content">
          <div className="oc-top-bar">
            <h2 className="oc-title">ÔNIBUS CADASTRADOS</h2>
            <div className="oc-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="oc-search-input"
                placeholder="Procurar ônibus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="oc-btn-cadastrar" onClick={() => router.push("/cadastro_onibus")}>
              CADASTRAR ÔNIBUS
            </button>
          </div>

          <div className="oc-table-wrap">
            <table className="oc-table">
              <thead>
                <tr>
                  <th>ROTA PRINCIPAL</th>
                  <th>CAPACIDADE</th>
                  <th>PLACA</th>
                  <th>MOTORISTA PRINCIPAL</th>
                  <th>OPERAÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="oc-feedback">Carregando ônibus...</td></tr>
                ) : error ? (
                  <tr><td colSpan={5} className="oc-feedback error">{error}</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="oc-feedback">Nenhum ônibus encontrado.</td></tr>
                ) : (
                  filtered.map((v) => (
                    <tr key={v.id}>
                      <td className="oc-td-bold">{v.mainRoute}</td>
                      <td className="oc-td-bold">{v.capacity} ALUNOS</td>
                      <td className="oc-td-bold">{v.plate}</td>
                      <td className="oc-td-driver">
                        {v.driver?.name ? (
                          v.driver.name
                        ) : (
                          <span className="oc-driver-pending">Motorista pendente</span>
                        )}
                      </td>
                      <td className="oc-td-ops">
                        <button className="oc-btn-excluir" onClick={() => handleDelete(v.id)}>EXCLUIR</button>
                        <button className="oc-btn-editar" onClick={() => handleEdit(v.id)}>EDITAR</button>
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
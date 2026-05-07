"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

const css = `
  /* FUNDO COM DETALHES DE ROTAS */
  .oc-page { 
    min-height: 100vh; 
    background-color: #ffffff; 
    /* Pattern sutil de linhas de mapa/rotas no fundo */
    background-image: radial-gradient(#01233f 0.5px, transparent 0.5px), stroke-dasharray: 4;
    background-size: 30px 30px;
    background-position: center;
    background-attachment: fixed;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
    display: flex; 
  }
  
  /* Overlay leve para o padrão não atrapalhar a leitura */
  .oc-page::before {
    content: "";
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255, 255, 255, 0.92);
    z-index: 0;
  }

  /* SIDEBAR (Mantida a estrutura original com leve ajuste de arredondamento nos itens) */
  .oc-sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .oc-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .oc-logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .oc-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .oc-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 2px; }
  .oc-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .oc-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 600; }

  /* CONTENT WRAP */
  .oc-content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; position: relative; z-index: 1; }

  /* NAVBAR */
  .oc-navbar { background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); border-bottom: 1px solid #e2e6ea; padding: 0 36px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .oc-topbar-title { font-size: 16px; font-weight: 700; color: #01233F; }

  /* MAIN */
  .oc-main { padding: 32px 40px; }
  .oc-top-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .oc-title { font-size: 14px; font-weight: 900; color: #01233F; letter-spacing: 1px; text-transform: uppercase; }

  /* SEARCH & BUTTONS (Arredondados e mais visíveis) */
  .oc-search-wrap { display: flex; align-items: center; background: #fff; border: 1.5px solid #e0e6ed; border-radius: 12px; padding: 0 14px; height: 42px; flex: 1; transition: border-color 0.2s; }
  .oc-search-wrap:focus-within { border-color: #f1bb13; }
  .oc-search-input { border: none; outline: none; font-size: 13px; width: 100%; background: transparent; }

  .oc-btn-cadastrar { background: #01233F; border: none; border-radius: 12px; padding: 0 20px; height: 42px; font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; cursor: pointer; transition: transform 0.1s, background 0.2s; }
  .oc-btn-cadastrar:hover { background: #02345e; transform: translateY(-1px); }

  /* TABELA (Clean com bordas arredondadas no container) */
  .oc-table-wrap { background: #fff; border: 1px solid #eef0f2; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); overflow: hidden; }
  .oc-table { width: 100%; border-collapse: collapse; }
  .oc-table thead tr { background: #f8fafc; border-bottom: 1px solid #eef0f2; }
  .oc-table thead th { color: #64748b; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 16px 20px; text-align: left; }
  .oc-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
  .oc-table tbody tr:hover { background: #fdfdfd; }
  .oc-table tbody td { padding: 16px 20px; font-size: 13px; color: #334155; }

  /* BOTÕES DE OPERAÇÃO (Agora mais visíveis como botões mesmo) */
  .oc-td-ops { display: flex; align-items: center; gap: 8px; }
  .oc-btn-editar { 
    background: #f1f5f9; color: #01233F; border: none; border-radius: 8px; 
    padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer; 
    transition: all 0.2s;
  }
  .oc-btn-editar:hover { background: #01233F; color: #fff; }
  
  .oc-btn-excluir { 
    background: #fff1f2; color: #e11d48; border: none; border-radius: 8px; 
    padding: 6px 12px; font-size: 11px; font-weight: 700; cursor: pointer; 
    transition: all 0.2s;
  }
  .oc-btn-excluir:hover { background: #e11d48; color: #fff; }

  /* BADGES */
  .oc-status-badge { display: inline-block; border-radius: 6px; padding: 4px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
  .oc-status-pending { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }
  .oc-status-route { background: #f0f9ff; color: #0369a1; border: 1px solid #e0f2fe; }

  @media (max-width: 900px) {
    .oc-sidebar { display: none; }
    .oc-content-wrap { margin-left: 0; }
  }
`;

export default function OnibusCadastradosPage() {
  const router = useRouter();
  const { vehicles, loading, error, deleteVehicle } = useVehicles();
  const [search, setSearch] = useState("");

  const filtered = (vehicles || []).filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      (v.route?.name || v.mainRoute || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.driver?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este ônibus?')) return;
    const success = await deleteVehicle(id);
    if (success) alert('✓ Ônibus excluído!');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="oc-page">
        {/* SIDEBAR */}
        <aside className="oc-sidebar">
          <div className="oc-sidebar-logo">
            <div className="oc-logo-icon">
              {/* Ícone inspirado no seu logo */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="2.5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h2" />
                <circle cx="7" cy="17" r="2" fill="#01233F"/>
                <circle cx="17" cy="17" r="2" fill="#01233F"/>
              </svg>
            </div>
            <div>
              <div className="oc-logo-text">Omnibus</div>
              <div style={{fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px'}}>GESTÃO</div>
            </div>
          </div>
          <nav className="oc-sidebar-nav">
            <button className="oc-nav-item" onClick={() => router.push("/dashboard")}>Dashboard</button>
            <button className="oc-nav-item active">Ônibus</button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_rotas")}>Rotas</button>
            <button className="oc-nav-item" onClick={() => router.push("/lista_motoristas")}>Motoristas</button>
          </nav>
          <div className="oc-sidebar-footer">
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="oc-content-wrap">
          <header className="oc-navbar">
            <div className="oc-topbar-title">Frota de Ônibus</div>
          </header>

          <main className="oc-main">
            <div className="oc-top-bar">
              <h2 className="oc-title">Listagem</h2>
              <div className="oc-search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  type="text"
                  className="oc-search-input"
                  placeholder="Pesquisar por placa, rota ou motorista..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="oc-btn-cadastrar" onClick={() => router.push("/cadastro_onibus")}>
                + Adicionar Ônibus
              </button>
            </div>

            <div className="oc-table-wrap">
              <table className="oc-table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Capacidade</th>
                    <th>Rota</th>
                    <th>Motorista</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px'}}>Carregando...</td></tr>
                  ) : filtered.map((v) => (
                    <tr key={v.id}>
                      <td style={{fontWeight: 700, color: '#01233F'}}>{v.plate}</td>
                      <td>{v.capacity} Alunos</td>
                      <td>
                        {!v.route_id ? 
                          <span className="oc-status-badge oc-status-pending">Pendente</span> : 
                          <span className="oc-status-badge oc-status-route">{v.route?.name || v.mainRoute}</span>
                        }
                      </td>
                      <td style={{color: '#64748b'}}>{v.driver?.name || 'N/A'}</td>
                      <td className="oc-td-ops">
                        <button className="oc-btn-editar" onClick={() => router.push(`/editOnibus?id=${v.id}`)}>EDITAR</button>
                        <button className="oc-btn-excluir" onClick={() => handleDelete(v.id)}>EXCLUIR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import { useSchools } from "@/hooks/useSchools";

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
  const [startOptions, setStartOptions] = useState<Array<{ address: string; lat: number; lng: number }>>([]);
  const [selectedStartIndex, setSelectedStartIndex] = useState<string>("");
  const [searchingCep, setSearchingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchools({ per_page: 100 });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSearchCep = async () => {
    setError(null);
    setSearchingCep(true);
    try {
      const options = await getAddressesByCep(form.start_point_cep);
      setStartOptions(options);
      setSelectedStartIndex("");
      if (!options.length) {
        setError('Nao encontramos enderecos para esse CEP.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao buscar enderecos por CEP');
      setStartOptions([]);
    } finally {
      setSearchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedStart = selectedStartIndex !== "" ? startOptions[Number(selectedStartIndex)] : null;
      const selectedSchool = schools.find((school) => school.id === Number(form.school_id));

      if (!selectedSchool) {
        setError("Selecione a escola de parada final.");
        return;
      }

      await createRoute({
        name: form.name,
        school_id: selectedSchool.id,
        start_point_cep: form.start_point_cep,
        start_point: selectedStart?.address || form.start_point,
        start_point_reference: form.start_point_reference,
        start_point_lat: selectedStart?.lat,
        start_point_lng: selectedStart?.lng,
        end_point: selectedSchool.address,
        end_point_lat: selectedSchool.lat || undefined,
        end_point_lng: selectedSchool.lng || undefined,
        departure_time: form.departure_time,
      });

      router.push('/lista_rotas');
    } catch (err: any) {
      setError(err?.message || 'Erro ao cadastrar rota');
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={() => router.push("/dashboard")} className="nav-link">DASHBOARD</button>
          <button onClick={() => router.push("/financeiro")} className="nav-link">FINANCEIRO</button>
        </div>
        <div className="nav-right">
          <button className="icon-btn notif-icon-btn" title="Notificações" onClick={() => router.push("/notificacoes")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01233F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="icon-btn user-icon-btn" title="Usuário" onClick={() => router.push("/perfil")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="main">
        <h2 className="page-title">CADASTRE UMA NOVA ROTA</h2>
        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-box">{error}</div>}
            <div className="row">
              <div className="field">
                <label className="label">NOME DA ROTA</label>
                <input type="text" name="name" className="input" placeholder="Ex: Ingá" value={form.name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label className="label">CEP DA REGIAO DE SAIDA</label>
                <div className="cep-row">
                  <input type="text" name="start_point_cep" className="input" placeholder="Ex: 58000000" value={form.start_point_cep} onChange={handleChange} required />
                  <button type="button" className="btn-cep" onClick={handleSearchCep} disabled={searchingCep || !form.start_point_cep}>
                    {searchingCep ? 'BUSCANDO...' : 'BUSCAR'}
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label className="label">ENDERECO DE SAIDA (LISTA POR CEP)</label>
                <select
                  className="input"
                  value={selectedStartIndex}
                  onChange={(e) => {
                    const idx = e.target.value;
                    setSelectedStartIndex(idx);
                    if (idx !== "") {
                      setForm((prev) => ({ ...prev, start_point: startOptions[Number(idx)].address }));
                    }
                  }}
                  required
                >
                  <option value="">Selecione um endereco</option>
                  {startOptions.map((option, index) => (
                    <option key={`${option.address}-${index}`} value={index}>
                      {option.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">PONTO DE REFERENCIA (SAIDA)</label>
                <input type="text" name="start_point_reference" className="input" placeholder="Ex: Proximo ao mercado X" value={form.start_point_reference} onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label className="label">HORÁRIO DE SAÍDA</label>
                <input type="time" name="departure_time" className="input" value={form.departure_time} onChange={handleChange} required />
              </div>
              <div className="field">
                <label className="label">PARADA FINAL (ESCOLA)</label>
                <select className="input" name="school_id" value={form.school_id} onChange={handleChange} required>
                  <option value="">Selecione uma escola</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name} - {school.address}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'CADASTRANDO...' : 'CADASTRAR'}</button>
          </form>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          width: 100%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 56px;
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          font-size: 13px;
          font-weight: 800;
          color: #01233F;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .nav-link:hover {
          color: #01233F;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: background 0.15s;
          padding: 0;
        }

        .icon-btn:hover {
          background: #f5f5f5;
        }

        .notif-icon-btn {
          background: none;
          width: 34px;
          height: 34px;
        }

        .notif-icon-btn:hover {
          background: #f5f5f5;
        }

        .user-icon-btn {
          background: #01233F;
          width: 34px;
          height: 34px;
        }

        .user-icon-btn:hover {
          background: #013560;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }

        .page-title {
          font-size: 18px;
          font-weight: 900;
          color: #01233F;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 24px;
          text-align: center;
        }

        .card {
          background: #ffffff;
          border-radius: 5px;
          padding: 40px 40px 36px;
          width: 100%;
          max-width: 860px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 0;
        }

        .row .field {
          margin-bottom: 16px;
        }

        .field {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 11px;
          font-weight: 800;
          color: #222;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          height: 52px;
          border: 1.5px solid #e0e0e0;
          border-radius: 4px;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 400;
          color: #333;
          background: #F3F3F3;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .input::placeholder {
          color: #ACACAC;
          font-size: 14px;
          font-weight: 800;
        }

        .input:focus {
          border-color: #f1bb13;
          background: #fff;
        }

        .btn {
          width: 100%;
          height: 54px;
          background: #f1bb13;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #ffffff;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s, transform 0.1s;
        }

        .btn:hover {
          background: #dba900;
          transform: translateY(-1px);
        }

        .btn:active {
          transform: translateY(0);
          background: #c79800;
        }

        .btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .error-box {
          margin-bottom: 12px;
          padding: 10px 12px;
          border-radius: 4px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          font-size: 13px;
          font-weight: 600;
        }

        .cep-row {
          display: grid;
          grid-template-columns: 1fr 140px;
          gap: 10px;
        }

        .btn-cep {
          height: 52px;
          border: none;
          border-radius: 4px;
          background: #01233F;
          color: #fff;
          font-weight: 800;
          letter-spacing: 0.6px;
          cursor: pointer;
        }

        .btn-cep:disabled {
          background: #8fa1b2;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
          }

          .nav-links {
            gap: 16px;
          }

          .main {
            padding: 32px 16px;
          }

          .card {
            padding: 24px 20px;
          }

          .page-title {
            font-size: 15px;
          }

          .row {
            grid-template-columns: 1fr;
          }

          .row .field {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}
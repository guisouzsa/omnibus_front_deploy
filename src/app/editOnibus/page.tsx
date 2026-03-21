"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVehicles } from "@/hooks/useVehicles";
import { useDrivers } from "@/hooks/useDrivers";

export default function EditarOnibus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id');
  
  const { getVehicle, updateVehicle, loading: vehicleLoading, error: vehicleError } = useVehicles();
  const { drivers, loading: driversLoading } = useDrivers();

  const [form, setForm] = useState({
    plate: "",
    capacity: "",
    mainRoute: "",
    driver_id: "",
  });

  const [loadingData, setLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Carrega os dados do veículo ao montar
  useEffect(() => {
    if (!vehicleId) {
      router.push('/lista_onibus');
      return;
    }

    const loadVehicle = async () => {
      const vehicle = await getVehicle(parseInt(vehicleId));
      if (vehicle) {
        setForm({
          plate: vehicle.plate,
          capacity: vehicle.capacity.toString(),
          mainRoute: vehicle.mainRoute,
          driver_id: vehicle.driver_id ? vehicle.driver_id.toString() : "",
        });
      } else {
        setSubmitError('Veículo não encontrado');
      }
      setLoadingData(false);
    };

    loadVehicle();
  }, [vehicleId, getVehicle, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!vehicleId) return;

    const payload: {
      plate: string;
      capacity: number;
      mainRoute: string;
      driver_id?: number;
    } = {
      plate: form.plate.toUpperCase(),
      capacity: parseInt(form.capacity),
      mainRoute: form.mainRoute,
    };

    if (form.driver_id) {
      payload.driver_id = parseInt(form.driver_id);
    }

    const success = await updateVehicle(parseInt(vehicleId), payload);

    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/lista_onibus");
      }, 2000);
    } else {
      setSubmitError(vehicleError || "Erro ao atualizar ônibus");
    }
  };

  if (loadingData) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Carregando dados do veículo...</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-link {
          font-size: 14px;
          font-weight: 700;
          color: #1a2b6d;
          letter-spacing: 0.05em;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }

        .nav-link:hover {
          opacity: 0.7;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a2b6d;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label {
          font-size: 12px;
          font-weight: 700;
          color: #1a2b6d;
          letter-spacing: 0.07em;
        }

        .input {
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          padding: 12px 14px;
          font-size: 14px;
          color: #333;
          outline: none;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
          transition: box-shadow 0.2s;
        }

        .input:focus {
          box-shadow: 0 0 0 2px #f5a623;
        }

        select.input {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 30px;
          appearance: none;
        }

        .btn {
          background: #f5a623;
          border: none;
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 14px;
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.2s;
          font-family: inherit;
          width: 100%;
        }

        .btn:hover {
          background: #e09510;
        }

        .btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>

      {/* NAVBAR */}
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

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1a2b6d",
            letterSpacing: "0.06em",
            marginBottom: "28px",
          }}
        >
          EDITAR ÔNIBUS
        </h1>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "32px 32px 36px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {submitSuccess && (
            <div className="alert alert-success">
              ✓ Ônibus atualizado com sucesso! Redirecionando...
            </div>
          )}
          
          {submitError && (
            <div className="alert alert-error">
              {submitError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* plate + capacity lado a lado */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div className="field" style={{ flex: 1 }}>
                <label className="label">PLACA DO VEÍCULO</label>
                <input
                  type="text"
                  name="plate"
                  value={form.plate}
                  onChange={handleChange}
                  className="input"
                  maxLength={7}
                  required
                />
              </div>

              <div className="field" style={{ flex: 1 }}>
                <label className="label">CAPACIDADE</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="input"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* mainRoute */}
            <div className="field">
              <label className="label">ROTA PRINCIPAL</label>
              <input
                type="text"
                name="mainRoute"
                value={form.mainRoute}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* driver_id */}
            <div className="field">
              <label className="label">MOTORISTA PRINCIPAL</label>
              {driversLoading ? (
                <div className="input" style={{ display: 'flex', alignItems: 'center', color: '#888' }}>
                  Carregando motoristas...
                </div>
              ) : (
                <select
                  name="driver_id"
                  value={form.driver_id}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Selecione um motorista</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              className="btn"
              disabled={vehicleLoading || driversLoading}
            >
              {vehicleLoading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
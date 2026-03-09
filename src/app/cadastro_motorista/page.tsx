"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroMotoristaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    numeroCnh: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <h2 className="page-title">CADASTRE UM NOVO MOTORISTA</h2>
        <div className="card">
          <form onSubmit={handleSubmit}>

            {/* Nome — linha inteira */}
            <div className="field full">
              <label className="label">NOME</label>
              <input type="text" name="nome" className="input" placeholder="Ex: José Bonifácio Sombra" value={form.nome} onChange={handleChange} />
            </div>

            {/* Email e Telefone — lado a lado */}
            <div className="row">
              <div className="field">
                <label className="label">EMAIL</label>
                <input type="email" name="email" className="input" placeholder="Ex: jose@gmail.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="field">
                <label className="label">TELEFONE</label>
                <input type="tel" name="telefone" className="input" placeholder="Ex: (88) 94002-8922" value={form.telefone} onChange={handleChange} />
              </div>
            </div>

            {/* CNH — linha inteira */}
            <div className="field full">
              <label className="label">NÚMERO DA CNH</label>
              <input type="text" name="numeroCnh" className="input" placeholder="Ex: 07234567889" value={form.numeroCnh} onChange={handleChange} />
            </div>

            <button type="submit" className="btn">CADASTRAR</button>
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
          display: flex;
          flex-direction: column;
          background: #ffffff;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
          text-decoration: none;
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
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 40px;
          flex: 1;
          justify-content: center;
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

        /* Linha com 2 colunas */
        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        /* Campo que ocupa linha inteira */
        .field.full {
          width: 100%;
        }

        /* Dentro do .row os fields não têm margin-bottom próprio */
        .row .field {
          margin-bottom: 0;
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
          font-size: 13px;
          font-weight: 400;
          color: #333;
          background: #F3F3F3;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input::placeholder {
          color: #ACACAC;
          font-size: 13px;
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

        /* Tablet / Mobile */
        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
          }

          .nav-links {
            gap: 16px;
          }

          .card {
            padding: 20px 16px;
          }

          .page-title {
            font-size: 15px;
          }

          /* Em telas pequenas, 2 colunas viram 1 */
          .row {
            grid-template-columns: 1fr;
          }

          .row .field {
            margin-bottom: 16px;
          }

          .row .field:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
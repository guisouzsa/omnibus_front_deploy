"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function OmnibusCadastro() {
  const router = useRouter();
  const { register, loading, error, isAuthenticated } = useAuthContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage(""); // Limpar erro ao digitar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validar senhas
    if (form.password !== form.password_confirmation) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      // O redirecionamento é feito automaticamente pelo AuthContext
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao cadastrar");
    }
  };

  return (
    <>
      <style>{`
        .omnibus-root {
          height: 100vh;
          width: 100vw;
          display: flex;
          overflow: hidden;
        }

        .left-panel {
          width: 35%;
          position: relative;
          flex-shrink: 0;
        }

        .right-panel {
          flex: 1;
          background: #f2f2f2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 100px;
          overflow-y: auto;
        }

        .title-wrapper {
          width: 100%;
          max-width: 500px;
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-text {
          font-size: 42px;
          font-weight: 800;
          color: #1a2b6d;
          margin: 0 0 10px 0;
          letter-spacing: 0.08em;
          text-align: center;
        }

        .title-underline {
          height: 4px;
          background: #f5a623;
          border-radius: 2px;
          width: fit-content;
          align-self: center;
          min-width: 25ch;
        }

        .form-card {
          background: #fff;
          border-radius: 10px;
          padding: 48px 48px 52px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .field-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 13px;
          font-weight: 700;
          color: #1a2b6d;
          letter-spacing: 0.08em;
        }

        .field-input {
          border: 1.5px solid #ccc;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
          color: #333;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }

        .field-input:focus {
          border-color: #f5a623;
        }

        .submit-btn {
          background: #f5a623;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 18px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
          font-family: inherit;
          width: 100%;
        }

        .submit-btn:hover {
          background: #e09510;
        }
        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 6px;
          color: #c33;
          padding: 12px 16px;
          font-size: 14px;
          text-align: center;
        }
        .login-link-text {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .login-link {
          color: #1a2b6d;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 2px solid #f5a623;
          padding-bottom: 1px;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .left-panel {
            display: none;
          }

          .right-panel {
            padding: 48px 40px;
            width: 100%;
          }

          .title-text {
            font-size: 34px;
          }

          .form-card {
            padding: 36px 32px 40px;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .right-panel {
            padding: 60px 20px 32px;
            justify-content: flex-start;
          }

          .title-text {
            font-size: 28px;
          }

          .form-card {
            padding: 28px 20px 32px;
            gap: 20px;
          }

          .field-input {
            padding: 12px 14px;
            font-size: 14px;
          }

          .submit-btn {
            padding: 16px;
            font-size: 14px;
          }
        }
      `}</style>

      <main className={`${montserrat.className} omnibus-root`}>
        {/* LEFT PANEL */}
        <div className="left-panel">
          <Image
            src="/banneromnibus1.png"
            alt="Omnibus"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Title */}
          <div className="title-wrapper">
            <h1 className="title-text">CADASTRO</h1>
            <div className="title-underline" aria-hidden="true" />
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit} className="form-card">
            {[
              { label: "INSTITUIÇÃO", name: "name",     type: "text" },
              { label: "E-MAIL",      name: "email",    type: "email" },
              { label: "SENHA",       name: "password", type: "password" },
              { label: "CONFIRMAR SENHA", name: "password_confirmation", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name} className="field-wrapper">
                <label className="field-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  className="field-input"
                  required
                />
              </div>
            ))}

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "CADASTRANDO..." : "CADASTRE-SE"}
            </button>
          </form>

          {/* Link login */}
          <p className="login-link-text">
            Já tem uma conta?{" "}
            <Link href="/login" className="login-link">
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
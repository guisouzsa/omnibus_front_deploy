"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function OmnibusLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    router.push("/dashboard");
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

        .forgot {
          font-size: 13px;
          color: #777;
          text-decoration: none;
          margin-top: -16px;
          align-self: flex-end;
        }

        .forgot:hover {
          color: #333;
          text-decoration: underline;
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

        .register-link-text {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .register-link {
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
            src="/banneromnibus.png"
            alt="Omnibus"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Title */}
          <div className="title-wrapper">
            <h1 className="title-text">LOGIN</h1>
            <div className="title-underline" aria-hidden="true" />
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit} className="form-card">
            {[
              { label: "E-MAIL",  name: "email",    type: "email" },
              { label: "SENHA",   name: "password", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name} className="field-wrapper">
                <label className="field-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            ))}

            <button type="submit" className="submit-btn">
              ENTRAR
            </button>
          </form>

          {/* Link cadastro */}
          <p className="register-link-text">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="register-link">
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
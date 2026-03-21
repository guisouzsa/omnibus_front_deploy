"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSchools } from "@/hooks/useSchools";
import { useRoutes } from "@/hooks/useRoutes";

export default function CadastroEscolaPage() {
  const router = useRouter();
  const { createSchool, loading } = useSchools(false);
  const { getAddressesByCep } = useRoutes(false);

  const [form, setForm] = useState({
    name: "",
    cep: "",
    address: "",
    reference_point: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [searchingCep, setSearchingCep] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSearchCep = async () => {
    setSearchingCep(true);
    setError(null);
    try {
      const options = await getAddressesByCep(form.cep);
      if (!options.length) {
        setError("Nao encontramos enderecos para esse CEP.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        address: options[0].address,
      }));
    } catch (err: any) {
      setError(err?.message || "Erro ao consultar CEP");
    } finally {
      setSearchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSchool(form);
      router.push("/lista_escolas");
    } catch (err: any) {
      setError(err?.message || "Erro ao cadastrar escola");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fff", padding: 24 }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 16, color: "#01233F" }}>CADASTRAR ESCOLA</h1>

        {error && (
          <div style={{ marginBottom: 12, padding: 10, border: "1px solid #f5c6cb", background: "#f8d7da", color: "#721c24", borderRadius: 4 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nome da escola" required style={{ height: 42, padding: "0 12px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 8 }}>
            <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" required style={{ height: 42, padding: "0 12px" }} />
            <button type="button" onClick={handleSearchCep} disabled={searchingCep || !form.cep} style={{ border: "none", borderRadius: 4, background: "#01233F", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              {searchingCep ? "BUSCANDO..." : "BUSCAR CEP"}
            </button>
          </div>

          <input name="address" value={form.address} onChange={handleChange} placeholder="Endereco da escola" required style={{ height: 42, padding: "0 12px" }} />
          <input name="reference_point" value={form.reference_point} onChange={handleChange} placeholder="Ponto de referencia" style={{ height: 42, padding: "0 12px" }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => router.push("/lista_escolas")} style={{ height: 42, padding: "0 18px", border: "1px solid #d0d5dd", borderRadius: 4, background: "#fff", cursor: "pointer" }}>
              VOLTAR
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, height: 42, border: "none", borderRadius: 4, background: "#f1bb13", color: "#fff", fontWeight: 800, letterSpacing: 1, cursor: "pointer" }}>
              {loading ? "SALVANDO..." : "SALVAR ESCOLA"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

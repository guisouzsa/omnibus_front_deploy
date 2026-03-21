"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSchools } from "@/hooks/useSchools";

export default function ListaEscolasPage() {
  const router = useRouter();
  const { schools, loading, error, deleteSchool } = useSchools();
  const [search, setSearch] = useState("");

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase()) ||
    s.cep.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta escola?")) return;

    try {
      await deleteSchool(id);
    } catch {
      alert("Erro ao excluir escola");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fff", padding: 24 }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <h1 style={{ margin: 0, color: "#01233F" }}>ESCOLAS</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push("/lista_rotas")} style={{ height: 40, border: "1px solid #d0d5dd", background: "#fff", borderRadius: 4, padding: "0 12px", cursor: "pointer" }}>
              VOLTAR ROTAS
            </button>
            <button onClick={() => router.push("/cadastro_escola")} style={{ height: 40, border: "none", background: "#f1bb13", color: "#fff", borderRadius: 4, padding: "0 14px", fontWeight: 800, cursor: "pointer" }}>
              NOVA ESCOLA
            </button>
          </div>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, endereco ou CEP"
          style={{ width: "100%", height: 40, border: "1px solid #d0d5dd", borderRadius: 4, padding: "0 12px", marginBottom: 14 }}
        />

        <div style={{ border: "1px solid #e4e7ec", borderRadius: 6, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#01233F", color: "#fff" }}>
                <th style={{ textAlign: "left", padding: 12 }}>NOME</th>
                <th style={{ textAlign: "left", padding: 12 }}>CEP</th>
                <th style={{ textAlign: "left", padding: 12 }}>ENDERECO</th>
                <th style={{ textAlign: "left", padding: 12 }}>ACOES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: 12 }}>Carregando escolas...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} style={{ padding: 12, color: "#b42318" }}>{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 12 }}>Nenhuma escola cadastrada.</td></tr>
              ) : (
                filtered.map((school) => (
                  <tr key={school.id} style={{ borderTop: "1px solid #eaecf0" }}>
                    <td style={{ padding: 12, fontWeight: 700 }}>{school.name}</td>
                    <td style={{ padding: 12 }}>{school.cep}</td>
                    <td style={{ padding: 12 }}>{school.address}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => handleDelete(school.id)} style={{ border: "none", background: "none", color: "#b42318", fontWeight: 700, cursor: "pointer" }}>
                        EXCLUIR
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

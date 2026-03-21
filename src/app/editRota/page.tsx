"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import { useSchools } from "@/hooks/useSchools";

export default function EditRotaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");

  const { getRoute, updateRoute, loading } = useRoutes(false);
  const { schools, fetchSchools } = useSchools(false);
  const [form, setForm] = useState({
    name: "",
    start_point_cep: "",
    start_point_reference: "",
    start_point: "",
    departure_time: "",
    end_point: "",
    school_id: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!routeId) {
      router.push("/lista_rotas");
      return;
    }

    const load = async () => {
      try {
        await fetchSchools({ per_page: 100 });
        const routeResponse = await getRoute(Number(routeId));
        const route = routeResponse.data;
        setForm({
          name: route.name,
          start_point_cep: route.start_point_cep || "",
          start_point_reference: route.start_point_reference || "",
          start_point: route.start_point,
          departure_time: route.departure_time,
          end_point: route.end_point,
          school_id: route.school_id ? String(route.school_id) : "",
        });
      } catch {
        setError("Não foi possível carregar a rota.");
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [routeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeId) return;

    try {
      const selectedSchool = schools.find((school) => school.id === Number(form.school_id));

      await updateRoute(Number(routeId), {
        ...form,
        school_id: form.school_id ? Number(form.school_id) : null,
        end_point: selectedSchool?.address || form.end_point,
        end_point_lat: selectedSchool?.lat || undefined,
        end_point_lng: selectedSchool?.lng || undefined,
      });
      router.push("/lista_rotas");
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar rota");
    }
  };

  if (loadingData) {
    return <div style={{ padding: 24 }}>Carregando rota...</div>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fff", padding: 24 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 16, color: "#01233F" }}>EDITAR ROTA</h1>
        {error && (
          <div style={{ marginBottom: 12, padding: 10, border: "1px solid #f5c6cb", background: "#f8d7da", color: "#721c24", borderRadius: 4 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nome da rota" required style={{ height: 42, padding: "0 12px" }} />
          <input name="start_point_cep" value={form.start_point_cep} onChange={handleChange} placeholder="CEP da saida" style={{ height: 42, padding: "0 12px" }} />
          <input name="start_point_reference" value={form.start_point_reference} onChange={handleChange} placeholder="Referencia do ponto de saida" style={{ height: 42, padding: "0 12px" }} />
          <input name="start_point" value={form.start_point} onChange={handleChange} placeholder="Ponto de partida" required style={{ height: 42, padding: "0 12px" }} />
          <input type="time" name="departure_time" value={form.departure_time} onChange={handleChange} placeholder="Horario de saida" required style={{ height: 42, padding: "0 12px" }} />
          <select name="school_id" value={form.school_id} onChange={handleChange} style={{ height: 42, padding: "0 12px" }}>
            <option value="">Sem escola vinculada</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} - {school.address}
              </option>
            ))}
          </select>
          <input name="end_point" value={form.end_point} onChange={handleChange} placeholder="Parada final (snapshot)" required style={{ height: 42, padding: "0 12px" }} />
          <button type="submit" disabled={loading} style={{ height: 44, border: "none", background: "#f1bb13", color: "white", fontWeight: 700, borderRadius: 4 }}>
            {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </button>
        </form>
      </div>
    </main>
  );
}

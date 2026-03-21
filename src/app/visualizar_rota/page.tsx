"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";

declare global {
  interface Window {
    L: any;
  }
}

export default function VisualizarRotaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");
  const { getRoute } = useRoutes(false);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

  const [routeName, setRouteName] = useState("");
  const [startLabel, setStartLabel] = useState("");
  const [endLabel, setEndLabel] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      if ((window as any).L) return;

      const leafletCss = document.createElement("link");
      leafletCss.rel = "stylesheet";
      leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCss);

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Falha ao carregar Leaflet"));
        document.body.appendChild(script);
      });
    };

    const renderRoute = async () => {
      if (!routeId) {
        setError("Rota nao informada.");
        setLoading(false);
        return;
      }

      try {
        await loadLeaflet();

        const response = await getRoute(Number(routeId));
        const route = response.data;

        const start = response.map_points.start;
        const end = response.map_points.end;

        setRouteName(route.name);
        setStartLabel(start.label);
        setEndLabel(end.label);
        setDuration(response.suggested_duration_minutes);

        if (!start.lat || !start.lng || !end.lat || !end.lng) {
          setError("Esta rota ainda nao possui coordenadas suficientes para o mapa.");
          setLoading(false);
          return;
        }

        const L = window.L;

        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        const map = L.map(mapRef.current).setView([start.lat, start.lng], 12);
        leafletMapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const startMarker = L.marker([start.lat, start.lng]).addTo(map);
        startMarker.bindPopup(`<b>Saida</b><br/>${start.label}`);

        const endMarker = L.marker([end.lat, end.lng]).addTo(map);
        endMarker.bindPopup(`<b>Chegada</b><br/>${end.label}`);

        let pathCoordinates: [number, number][] = [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ];

        try {
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
          const routeResponse = await fetch(osrmUrl);
          if (routeResponse.ok) {
            const data = await routeResponse.json();
            const coords = data?.routes?.[0]?.geometry?.coordinates;
            const durationSeconds = data?.routes?.[0]?.duration;

            if (Array.isArray(coords) && coords.length > 1) {
              pathCoordinates = coords.map((c: [number, number]) => [c[1], c[0]]);
            }

            if (typeof durationSeconds === "number" && durationSeconds > 0) {
              setDuration(Math.round(durationSeconds / 60));
            }
          }
        } catch {
          // Mantem fallback com linha reta + duracao sugerida do backend.
        }

        const polyline = L.polyline(pathCoordinates, {
          color: "#01233F",
          weight: 4,
          opacity: 0.85,
          dashArray: "10, 10",
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar mapa da rota.");
      } finally {
        setLoading(false);
      }
    };

    renderRoute();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, [routeId]);

  return (
    <main style={{ minHeight: "100vh", background: "#f7f7f7", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h1 style={{ color: "#01233F", margin: 0 }}>MAPA DA ROTA {routeName ? `- ${routeName}` : ""}</h1>
          <button onClick={() => router.push("/lista_rotas")} style={{ border: "none", background: "#01233F", color: "#fff", padding: "10px 14px", borderRadius: 4, cursor: "pointer" }}>
            VOLTAR
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 6, overflow: "hidden" }}>
            <div ref={mapRef} style={{ width: "100%", height: 560 }} />
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 6, padding: 16 }}>
            <h3 style={{ marginTop: 0, color: "#01233F" }}>Detalhes</h3>
            {loading && <p>Carregando mapa...</p>}
            {error && <p style={{ color: "#b42318" }}>{error}</p>}
            {!loading && !error && (
              <>
                <p><strong>Saida:</strong> {startLabel}</p>
                <p><strong>Chegada:</strong> {endLabel}</p>
                <p><strong>Duracao sugerida:</strong> {duration ? `${duration} min` : "N/A"}</p>
                <p style={{ color: "#667085", fontSize: 13 }}>
                  A linha tracejada representa o percurso sugerido entre os pontos geolocalizados.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

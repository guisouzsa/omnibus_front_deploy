"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

declare global {
  interface Window {
    L: any;
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function SchoolIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function BusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 9h20"/><path d="M8 4V2"/><path d="M16 4V2"/>
      <circle cx="7" cy="20" r="2" fill="currentColor" stroke="currentColor"/><circle cx="17" cy="20" r="2" fill="currentColor" stroke="currentColor"/>
      <path d="M5 18h14"/>
    </svg>
  );
}
function RouteIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function DriverIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>
    </svg>
  );
}
function DashboardIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function FinanceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  
  .vr-page { min-height: 100vh; background: #f9f9f9; display: flex; }
  
  /* SIDEBAR */
  .vr-sidebar { width: 220px; background: #01233F; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .vr-sidebar-logo { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .vr-logo-icon { width: 34px; height: 34px; background: #f1bb13; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #01233F; }
  .vr-logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .vr-logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .vr-sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .vr-nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .vr-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; transition: all 0.15s; }
  .vr-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .vr-nav-item.active { background: #f1bb13; color: #01233F; font-weight: 600; }
  .vr-sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
  .vr-user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .vr-user-row:hover { background: rgba(255,255,255,0.07); }
  .vr-user-avatar { width: 32px; height: 32px; background: #f1bb13; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #01233F; flex-shrink: 0; }
  .vr-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .vr-user-role { font-size: 11px; color: rgba(255,255,255,0.4); }
  
  /* CONTENT WRAPPER */
  .vr-content-wrap { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  
  .vr-header { background: #fff; border-bottom: 1px solid #e2e6ea; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
  .vr-header-left { display: flex; align-items: center; gap: 16px; }
  .vr-back-btn { background: none; border: none; cursor: pointer; color: #01233F; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; transition: opacity 0.15s; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
  .vr-back-btn:hover { opacity: 0.6; }
  .vr-title { font-size: 16px; font-weight: 900; color: #01233F; letter-spacing: 1px; text-transform: uppercase; margin: 0; }
  
  .vr-main { padding: 32px 40px; flex: 1; }
  .vr-grid { display: grid; grid-template-columns: 1fr 360px; gap: 48; margin-bottom: 24px; }
  
  .vr-map-card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e8e8; position: relative; }
  .vr-map-container { width: 100%; height: 600px; }
  .vr-map-label { position: absolute; top: 12px; right: 12px; background: #f1bb13; color: #01233F; padding: 8px 12px; border-radius: 4px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; z-index: 10; }
  
  .vr-details-card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e8e8e8; height: fit-content; }
  .vr-details-title { font-size: 14px; font-weight: 900; color: #01233F; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  
  .vr-detail-item { margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px; }
  .vr-detail-item:last-child { margin-bottom: 0; }
  .vr-detail-icon { width: 32px; height: 32px; background: #f1bb13; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; flex-shrink: 0; }
  .vr-detail-content { flex: 1; }
  .vr-detail-label { font-size: 11px; font-weight: 800; color: #6b7a8d; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .vr-detail-value { font-size: 14px; font-weight: 600; color: #1a2535; line-height: 1.4; }
  
  .vr-loading { text-align: center; padding: 40px 20px; color: #6b7a8d; font-size: 14px; }
  .vr-error { background: #ffe5e5; border: 1px solid #ffcccc; border-radius: 6px; padding: 16px; color: #c0392b; font-size: 13px; font-weight: 600; }
  
  .vr-info-box { background: #f0f8ff; border-left: 4px solid #f1bb13; padding: 14px; border-radius: 4px; font-size: 12px; color: #333; line-height: 1.5; margin-top: 16px; }
  
  @media (max-width: 1024px) {
    .vr-sidebar { width: 180px; }
    .vr-content-wrap { margin-left: 180px; }
    .vr-grid { grid-template-columns: 1fr; }
    .vr-details-card { height: auto; }
    .vr-main { padding: 20px 16px; }
    .vr-header { padding: 16px 16px; flex-wrap: wrap; gap: 12px; }
  }
`;

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
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      if ((window as any).L) return Promise.resolve();

      const leafletCss = document.createElement("link");
      leafletCss.rel = "stylesheet";
      leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCss);

      return new Promise<void>((resolve, reject) => {
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
        setError("Rota não informada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

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
          setError("Esta rota ainda não possui coordenadas suficientes para o mapa.");
          setLoading(false);
          return;
        }

        const L = (window as any).L;
        if (!L) {
          setError("Leaflet não carregou corretamente.");
          setLoading(false);
          return;
        }

        if (!mapRef.current) {
          setError("Container do mapa não encontrado.");
          setLoading(false);
          return;
        }

        if (leafletMapRef.current) {
          try {
            leafletMapRef.current.remove();
          } catch (e) {
            console.warn("Erro ao remover mapa anterior:", e);
          }
        }

        let map: any;
        try {
          map = L.map(mapRef.current).setView([start.lat, start.lng], 12);
        } catch (e) {
          console.error("Erro ao criar mapa:", e);
          setError("Erro ao inicializar mapa");
          setLoading(false);
          return;
        }

        if (!map) {
          setError("Falha ao criar instância do mapa");
          setLoading(false);
          return;
        }

        leafletMapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        // Marcador de início (azul)
        const startIcon = L.divIcon({
          html: '<div style="background: #01233F; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 800; box-shadow: 0 2px 8px rgba(1, 35, 63, 0.3); border: 3px solid #fff;">A</div>',
          iconSize: [32, 32],
          className: ''
        });

        L.marker([start.lat, start.lng], { icon: startIcon }).addTo(map)
          .bindPopup(`<div style="font-family: Segoe UI; font-size: 13px;"><strong style="color: #01233F;">SAÍDA</strong><br/><span style="color: #666;">${start.label}</span></div>`);

        // Marcador de fim (amarelo)
        const endIcon = L.divIcon({
          html: '<div style="background: #f1bb13; color: #01233F; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 800; box-shadow: 0 2px 8px rgba(241, 187, 19, 0.3); border: 3px solid #fff;">B</div>',
          iconSize: [32, 32],
          className: ''
        });

        L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map)
          .bindPopup(`<div style="font-family: Segoe UI; font-size: 13px;"><strong style="color: #01233F;">CHEGADA</strong><br/><span style="color: #666;">${end.label}</span></div>`);

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
            const distanceMeters = data?.routes?.[0]?.distance;

            if (Array.isArray(coords) && coords.length > 1) {
              pathCoordinates = coords.map((c: [number, number]) => [c[1], c[0]]);
            }

            if (typeof durationSeconds === "number" && durationSeconds > 0) {
              setDuration(Math.round(durationSeconds / 60));
            }

            if (typeof distanceMeters === "number" && distanceMeters > 0) {
              setDistance(Math.round(distanceMeters / 1000 * 10) / 10);
            }
          }
        } catch (err) {
          console.warn("Erro ao carregar rota OSRM:", err);
        }

        const polyline = L.polyline(pathCoordinates, {
          color: "#01233F",
          weight: 4,
          opacity: 0.85,
          dashArray: "8, 5",
        }).addTo(map);

        const bounds = polyline.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Erro ao renderizar rota:", err);
        setError(err?.message || "Erro ao carregar mapa da rota.");
        setLoading(false);
      }
    };

    if (routeId) {
      renderRoute();
    }

    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {
          console.warn("Erro ao limpar mapa:", e);
        }
      }
    };
  }, [routeId]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="vr-page">
        
        {/* SIDEBAR */}
        <aside className="vr-sidebar">
          <div className="vr-sidebar-logo">
            <div className="vr-logo-icon"><BusIcon size={18} /></div>
            <div>
              <div className="vr-logo-text">Omnibus</div>
              <div className="vr-logo-sub">Gestão Escolar</div>
            </div>
          </div>
          
          <nav className="vr-sidebar-nav">
            <div className="vr-nav-label">Principal</div>
            <button className="vr-nav-item" onClick={() => router.push("/dashboard")} title="Dashboard">
              <DashboardIcon size={17} /> Dashboard
            </button>
            <button className="vr-nav-item" onClick={() => router.push("/visualizar_gastos")} title="Financeiro">
              <FinanceIcon size={17} /> Financeiro
            </button>

            <div className="vr-nav-label">Cadastros</div>
            <button className="vr-nav-item" onClick={() => router.push("/lista_onibus")} title="Ônibus">
              <BusIcon size={17} /> Ônibus
            </button>
            <button className="vr-nav-item active" onClick={() => router.push("/lista_rotas")} title="Rotas">
              <RouteIcon size={17} /> Rotas
            </button>
            <button className="vr-nav-item" onClick={() => router.push("/lista_motoristas")} title="Motoristas">
              <DriverIcon size={17} /> Motoristas
            </button>
            <button className="vr-nav-item" onClick={() => router.push("/lista_escolas")} title="Escolas">
              <SchoolIcon size={17} /> Escolas
            </button>
          </nav>

          <div className="vr-sidebar-footer">
            <SidebarLogoutButton />
          </div>
        </aside>
        
        {/* CONTENT WRAPPER */}
        <div className="vr-content-wrap">
          {/* Header */}
          <header className="vr-header">
            <div className="vr-header-left">
              <button className="vr-back-btn" onClick={() => router.push("/lista_rotas")}>
                <BackIcon />
                VOLTAR
              </button>
            </div>
          </header>

          {/* Conteúdo */}
          <main className="vr-main">
            <div className="vr-grid">
              {/* Mapa */}
              <div className="vr-map-card">
                <div ref={mapRef} className="vr-map-container" style={{ display: loading || error ? 'none' : 'block' }} />
                {!loading && !error && distance !== null && (
                  <div className="vr-map-label">📏 {distance} km</div>
                )}
                {loading && (
                  <div className="vr-loading">
                    <p>⏳ Carregando mapa...</p>
                  </div>
                )}
                {error && !loading && (
                  <div style={{ padding: '32px 20px' }}>
                    <div className="vr-error">{error}</div>
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="vr-details-card">
                <div className="vr-details-title">
                  <CheckCircleIcon />
                  DETALHES DA ROTA
                </div>

                {loading ? (
                  <p style={{ color: '#6b7a8d', fontSize: '13px' }}>Carregando detalhes...</p>
                ) : error ? (
                  null
                ) : (
                  <>
                    <div className="vr-detail-item">
                      <div className="vr-detail-icon">A</div>
                      <div className="vr-detail-content">
                        <div className="vr-detail-label">Ponto de Saída</div>
                        <div className="vr-detail-value">{startLabel}</div>
                      </div>
                    </div>

                    <div className="vr-detail-item">
                      <div className="vr-detail-icon">B</div>
                      <div className="vr-detail-content">
                        <div className="vr-detail-label">Ponto de Chegada</div>
                        <div className="vr-detail-value">{endLabel}</div>
                      </div>
                    </div>

                    {distance !== null && (
                      <div className="vr-detail-item">
                        <div className="vr-detail-icon">
                          <MapPinIcon />
                        </div>
                        <div className="vr-detail-content">
                          <div className="vr-detail-label">Distância</div>
                          <div className="vr-detail-value">{distance} km</div>
                        </div>
                      </div>
                    )}

                    {duration !== null && (
                      <div className="vr-detail-item">
                        <div className="vr-detail-icon">
                          <ClockIcon />
                        </div>
                        <div className="vr-detail-content">
                          <div className="vr-detail-label">Tempo Sugerido</div>
                          <div className="vr-detail-value">{duration} min</div>
                        </div>
                      </div>
                    )}

                    <div className="vr-info-box">
                      📍 A linha tracejada representa o percurso sugerido entre os pontos. As coordenadas são calculadas automaticamente.
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>

      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoutes } from "@/hooks/useRoutes";
import SidebarLogoutButton from "@/components/SidebarLogoutButton";

declare global {
  interface Window { L: any; }
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function BusSideIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="38" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
      <rect x="3"  y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
      <rect x="13" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
      <rect x="23" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
      <rect x="38" y="5" width="3" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <circle cx="8"  cy="24" r="4" stroke="white" strokeWidth="1.8"/>
      <circle cx="30" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
      <line x1="0" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
    </svg>
  );
}
function BusFrontIcon({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5V15a2 2 0 0 1-1 1.732V18a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-.5H8V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1.268A2 2 0 0 1 4 15V6.5zM7.5 5A1.5 1.5 0 0 0 6 6.5V9h12V6.5A1.5 1.5 0 0 0 16.5 5h-9zM6 11v2h12v-2H6zm1.5 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  );
}
function RouteIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
    </svg>
  );
}
function DriverIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="4"/>
      <path d="M5 21a7 7 0 0 1 14 0H5z"/>
    </svg>
  );
}
function SchoolIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
      <path d="M5 13.18V17c0 2.21 3.13 4 7 4s7-1.79 7-4v-3.82l-7 3.82-7-3.82z"/>
    </svg>
  );
}
function DashIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
function FinanceIconFilled({ size = 17, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a1 1 0 0 1 1 1v1.07C16.39 4.56 19 6.58 19 9c0 .55-.45 1-1 1s-1-.45-1-1c0-1.3-2.06-2.5-5-2.5S7 7.7 7 9s2.06 2.5 5 2.5c3.87 0 6 1.93 6 4.5 0 2.42-2.61 4.44-6 4.93V22a1 1 0 1 1-2 0v-1.07C6.61 20.44 4 18.42 4 16c0-.55.45-1 1-1s1 .45 1 1c0 1.3 2.06 2.5 5 2.5s5-1.2 5-2.5-2.06-2.5-5-2.5c-3.87 0-6-1.93-6-4.5C5 6.58 7.61 4.56 11 4.07V3a1 1 0 0 1 1-1z"/>
    </svg>
  );
}
function BellIconFilled({ size = 19, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a6 6 0 0 0-6 6c0 3.53-.88 5.7-1.76 7.04C3.46 16.43 3 17 3 17h18s-.46-.57-1.24-1.96C18.88 13.7 18 11.53 18 8a6 6 0 0 0-6-6z"/>
      <path d="M10.27 21a2 2 0 0 0 3.46 0H10.27z"/>
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function RulerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l18-9-9 18-2-8-7-1z"/>
    </svg>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #01233F; --yellow: #f1bb13; --yellow-dark: #d9a700;
    --bg: #f0f2f5; --border: #e2e6ea; --muted: #6b7a8d;
    --red: #ef4444; --sidebar-w: 220px;
  }
  body { font-family: 'DM Sans', sans-serif; font-weight: 400; }
  .layout { display: flex; min-height: 100vh; background: var(--bg); }

  /* ── Loading screen ── */
  .loading-screen {
    position: fixed; inset: 0; background: #01233F;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; z-index: 9999;
  }
  .loading-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2.5px solid rgba(241,187,19,0.15); border-top-color: #f1bb13;
    animation: spin 0.8s cubic-bezier(0.4,0,0.2,1) infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label {
    font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.75);
    letter-spacing: 1.5px; text-transform: uppercase; font-family: 'DM Sans', sans-serif;
  }

  /* ── Sidebar ── */
  .sidebar { width: var(--sidebar-w); background: var(--navy); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
  .logo-texts { display: flex; flex-direction: column; }
  .logo-text { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; font-weight: 400; margin-top: 1px; }
  .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 12px; margin: 14px 0 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nav-item.active { background: var(--yellow); color: var(--navy); font-weight: 600; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 4px; }
  .user-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; }
  .user-row:hover { background: rgba(255,255,255,0.07); }
  .avatar { width: 32px; height: 32px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* ── Content ── */
  .content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── Topbar ── */
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-left { display: flex; align-items: center; gap: 16px; }
  .back-btn { display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px; border: 1.5px solid var(--border); background: none; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--navy); font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px; transition: all 0.15s; }
  .back-btn:hover { background: var(--bg); border-color: #c5cbd3; }
  .topbar-divider { width: 1px; height: 20px; background: var(--border); }
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--navy); }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--navy); transition: background 0.15s; position: relative; }
  .icon-btn:hover { background: var(--bg); }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: var(--red); border-radius: 50%; border: 2px solid #fff; }
  .topbar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--navy); cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; flex-shrink: 0; }
  .topbar-avatar:hover { border-color: var(--yellow-dark); }

  /* ── Body ── */
  .body { padding: 32px; flex: 1; display: flex; flex-direction: column; gap: 24px; }

  /* ── Map + panel grid ── */
  .map-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

  /* ── Map card ── */
  .map-card {
    background: #fff; border-radius: 12px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
    border: 1px solid var(--border); position: relative;
  }
  /* CRITICAL FIX: the map container must always be in the DOM and have explicit size */
  .map-container { width: 100%; height: 560px; z-index: 1; }
  /* Loading / error overlays sit ON TOP of the map, not replacing it */
  .map-overlay {
    position: absolute; inset: 0; z-index: 10;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: #fff; gap: 12px;
  }
  .map-overlay-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2.5px solid rgba(1,35,63,0.1); border-top-color: var(--navy);
    animation: spin 0.8s cubic-bezier(0.4,0,0.2,1) infinite;
  }
  .map-overlay-text { font-size: 13px; color: var(--muted); font-weight: 500; }
  .map-distance-badge {
    position: absolute; top: 14px; right: 14px; z-index: 20;
    background: var(--navy); color: #fff;
    padding: 6px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    display: flex; align-items: center; gap: 6px;
    box-shadow: 0 2px 8px rgba(1,35,63,0.25);
  }
  .map-error {
    padding: 20px 24px;
    background: #fde8e8; border-left: 4px solid var(--red);
    border-radius: 8px; margin: 20px;
    font-size: 13px; font-weight: 500; color: #7f1d1d;
  }

  /* ── Info panel ── */
  .panel { display: flex; flex-direction: column; gap: 12px; }

  .panel-card {
    background: #fff; border-radius: 12px; padding: 20px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
    border: 1px solid var(--border);
  }
  .panel-card-title {
    font-size: 10px; font-weight: 700; color: var(--muted);
    letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 16px;
  }

  .detail-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
  .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .detail-row:first-of-type { padding-top: 0; }

  .detail-badge {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .badge-a { background: var(--navy); color: #fff; }
  .badge-b { background: var(--yellow); color: var(--navy); }
  .badge-icon { background: #f0f2f5; color: var(--navy); }

  .detail-content { flex: 1; min-width: 0; }
  .detail-label { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 3px; }
  .detail-value { font-size: 13px; font-weight: 600; color: var(--navy); line-height: 1.45; word-break: break-word; }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-box { background: var(--bg); border-radius: 8px; padding: 14px 12px; }
  .stat-label { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
  .stat-value { font-size: 22px; font-weight: 700; color: var(--navy); letter-spacing: -0.5px; }
  .stat-unit { font-size: 12px; font-weight: 500; color: var(--muted); margin-left: 2px; }

  .info-note {
    background: #fffbea; border: 1px solid #fde68a; border-radius: 8px;
    padding: 12px 14px; font-size: 12px; color: #78350f;
    line-height: 1.5; display: flex; gap: 8px; align-items: flex-start;
  }
  .info-note-icon { flex-shrink: 0; margin-top: 1px; }

  @media (max-width: 1024px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none; }
    .body { padding: 20px 16px; }
    .map-grid { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

export default function VisualizarRotaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");
  const { getRoute } = useRoutes(false);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

  const [routeName, setRouteName]   = useState("");
  const [startLabel, setStartLabel] = useState("");
  const [endLabel, setEndLabel]     = useState("");
  const [duration, setDuration]     = useState<number | null>(null);
  const [distance, setDistance]     = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

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
        script.onload  = () => resolve();
        script.onerror = () => reject(new Error("Falha ao carregar Leaflet"));
        document.body.appendChild(script);
      });
    };

    const getPointLabel = (point: any, defaultLabel: string): string => {
      if (!point) return defaultLabel;
      if (typeof point === 'string') return point;
      if (typeof point === 'object') {
        return (point.name || point.label || defaultLabel) as string;
      }
      return defaultLabel;
    };

    const renderRoute = async () => {
      if (!routeId) { setError("Rota não informada."); setLoading(false); return; }

      try {
        setLoading(true);
        setError(null);

        await loadLeaflet();

        const response  = await getRoute(Number(routeId));
        const route     = response.data;
        const startPoint = response.map?.start_point || response.map_points?.start;
        const endPoint   = response.map?.end_point || response.map_points?.end;

        setRouteName(route.name);
        setStartLabel(getPointLabel(startPoint, "—"));
        setEndLabel(getPointLabel(endPoint, "—"));
        setDuration(response.suggested_duration_minutes);
        setDistance(response.map?.distance_km || response.data?.distance ?? null);

        if (!startPoint?.lat || !startPoint?.lng || !endPoint?.lat || !endPoint?.lng) {
          setError("Esta rota ainda não possui coordenadas suficientes para o mapa.");
          setLoading(false);
          return;
        }

        const L = (window as any).L;
        if (!L || !mapRef.current) { setError("Erro ao inicializar mapa."); setLoading(false); return; }

        if (leafletMapRef.current) {
          try { leafletMapRef.current.remove(); } catch (e) { /* ignore */ }
        }

        const map = L.map(mapRef.current).setView([startPoint.lat, startPoint.lng], 13);
        leafletMapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        // ── CRITICAL: force tile re-render after the overlay is removed ──
        setTimeout(() => { map.invalidateSize(); }, 50);

        // Marcador A (navy)
        const startIcon = L.divIcon({
          html: `<div style="background:#01233F;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;box-shadow:0 3px 10px rgba(1,35,63,0.35);border:3px solid #fff;font-family:'DM Sans',sans-serif;">A</div>`,
          iconSize: [36, 36], className: "",
        });
        L.marker([startPoint.lat, startPoint.lng], { icon: startIcon }).addTo(map)
          .bindPopup(`<div style="font-family:'DM Sans',sans-serif;font-size:13px;"><strong style="color:#01233F;">SAÍDA</strong><br/><span style="color:#666;">${getPointLabel(startPoint, 'Ponto de Saída')}</span></div>`);

        // Marcador B (yellow)
        const endIcon = L.divIcon({
          html: `<div style="background:#f1bb13;color:#01233F;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;box-shadow:0 3px 10px rgba(241,187,19,0.35);border:3px solid #fff;font-family:'DM Sans',sans-serif;">B</div>`,
          iconSize: [36, 36], className: "",
        });
        L.marker([endPoint.lat, endPoint.lng], { icon: endIcon }).addTo(map)
          .bindPopup(`<div style="font-family:'DM Sans',sans-serif;font-size:13px;"><strong style="color:#01233F;">CHEGADA</strong><br/><span style="color:#666;">${getPointLabel(endPoint, 'Ponto de Chegada')}</span></div>`);

        let pathCoordinates: [number, number][] = [[startPoint.lat, startPoint.lng], [endPoint.lat, endPoint.lng]];

        try {
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`;
          const routeResp = await fetch(osrmUrl);
          if (routeResp.ok) {
            const data = await routeResp.json();
            const coords          = data?.routes?.[0]?.geometry?.coordinates;
            const durationSeconds = data?.routes?.[0]?.duration;
            const distanceMeters  = data?.routes?.[0]?.distance;

            if (Array.isArray(coords) && coords.length > 1) {
              pathCoordinates = coords.map((c: [number, number]) => [c[1], c[0]]);
            }
            if (typeof durationSeconds === "number" && durationSeconds > 0) {
              setDuration(Math.round(durationSeconds / 60));
            }
            if (typeof distanceMeters === "number" && distanceMeters > 0) {
              setDistance(Math.round(distanceMeters / 100) / 10);
            }
          }
        } catch { /* OSRM opcional — não bloqueia */ }

        const polyline = L.polyline(pathCoordinates, {
          color: "#01233F", weight: 5, opacity: 0.85, dashArray: "10, 6",
        }).addTo(map);

        const bounds = polyline.getBounds();
        if (bounds.isValid()) { map.fitBounds(bounds, { padding: [60, 60] }); }

        // Força re-render dos tiles após fitBounds
        setTimeout(() => { map.invalidateSize(); }, 200);

        setLoading(false);
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar mapa da rota.");
        setLoading(false);
      }
    };

    if (routeId) renderRoute();

    return () => {
      if (leafletMapRef.current) {
        try { leafletMapRef.current.remove(); } catch { /* ignore */ }
      }
    };
  }, [routeId]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="layout">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <BusSideIcon size={28} />
            <div className="logo-texts">
              <div className="logo-text">Omnibus</div>
              <div className="logo-sub">Gestão Escolar</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <span className="nav-label">Principal</span>
            <button className="nav-item" onClick={() => router.push("/dashboard")}><DashIconFilled /> Dashboard</button>
            <button className="nav-item" onClick={() => router.push("/visualizar_gastos")}><FinanceIconFilled /> Financeiro</button>
            <span className="nav-label">Cadastros</span>
            <button className="nav-item" onClick={() => router.push("/lista_onibus")}><BusFrontIcon /> Ônibus</button>
            <button className="nav-item active"><RouteIconFilled /> Rotas</button>
            <button className="nav-item" onClick={() => router.push("/lista_motoristas")}><DriverIconFilled /> Motoristas</button>
            <button className="nav-item" onClick={() => router.push("/lista_escolas")}><SchoolIconFilled /> Escolas</button>
          </nav>
          <div className="sidebar-footer">
            <button className="user-row" onClick={() => router.push("/perfil")}>
              <div className="avatar">A</div>
              <div><div className="user-name">Admin</div><div className="user-role">Gestor</div></div>
            </button>
            <SidebarLogoutButton />
          </div>
        </aside>

        <div className="content">
          {/* ── Topbar ── */}
          <header className="topbar">
            <div className="topbar-left">

              <div className="topbar-divider" />
              <div>
                <div className="topbar-title">{routeName || "Visualizar Rota"}</div>
                <div className="topbar-sub">Mapa e detalhes do percurso</div>
              </div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={() => router.push("/notificacoes")} title="Notificações">
                <BellIconFilled /><span className="notif-dot" />
              </button>
              <div className="topbar-avatar" onClick={() => router.push("/perfil")} title="Perfil">A</div>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="body">
            <div className="map-grid">

              {/* Mapa — container sempre no DOM, overlay por cima */}
              <div className="map-card">
                {/* O div do mapa NUNCA some do DOM — isso é o que corrige o bug dos tiles */}
                <div ref={mapRef} className="map-container" />

                {/* Overlay de loading — absoluto, cobre o mapa */}
                {loading && (
                  <div className="map-overlay">
                    <div className="map-overlay-spinner" />
                    <span className="map-overlay-text">Carregando mapa...</span>
                  </div>
                )}

                {/* Overlay de erro */}
                {!loading && error && (
                  <div className="map-overlay" style={{ background: "#fff" }}>
                    <div className="map-error">{error}</div>
                  </div>
                )}

                {/* Badge de distância */}
                {!loading && !error && distance !== null && (
                  <div className="map-distance-badge">
                    <RulerIcon /> {distance} km
                  </div>
                )}
              </div>

              {/* Painel de informações */}
              <div className="panel">

                {/* Pontos A → B */}
                <div className="panel-card">
                  <div className="panel-card-title">Percurso</div>

                  <div className="detail-row">
                    <div className="detail-badge badge-a">A</div>
                    <div className="detail-content">
                      <div className="detail-label">Ponto de Saída</div>
                      <div className="detail-value">{loading ? "Carregando..." : startLabel || "—"}</div>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-badge badge-b">B</div>
                    <div className="detail-content">
                      <div className="detail-label">Ponto de Chegada</div>
                      <div className="detail-value">{loading ? "Carregando..." : endLabel || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {!loading && !error && (distance !== null || duration !== null) && (
                  <div className="panel-card">
                    <div className="panel-card-title">Estatísticas</div>
                    <div className="stat-grid">
                      {distance !== null && (
                        <div className="stat-box">
                          <div className="stat-label">Distância</div>
                          <div className="stat-value">{distance}<span className="stat-unit">km</span></div>
                        </div>
                      )}
                      {duration !== null && (
                        <div className="stat-box">
                          <div className="stat-label">Tempo est.</div>
                          <div className="stat-value">{duration}<span className="stat-unit">min</span></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nota */}
                {!loading && !error && (
                  <div className="info-note">
                    <span className="info-note-icon">📍</span>
                    <span>A linha tracejada representa o percurso sugerido entre os pontos. As coordenadas são calculadas automaticamente via OpenStreetMap.</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
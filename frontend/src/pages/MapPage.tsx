import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapFilters } from "@/components/map/MapFilters";
import { MapReportForm } from "@/components/map/MapReportForm";
import { FloatingReportCard } from "@/components/map/FloatingReportCard";
import { FloatingVetCard } from "@/components/map/FloatingVetCard";
import { Navigation } from "lucide-react";

// ── Icons ──────────────────────────────────────────────────────────────
const createDivIcon = (emoji: string, bg: string, size = 42) =>
  L.divIcon({
    className: "custom-map-marker",
    html: `<div class="map-marker-bounce" style="background:${bg};width:${size}px;height:${size}px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 14px rgba(0,0,0,0.18);border:2.5px solid white;cursor:pointer;transition:transform 0.2s ease;" onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

const ICONS = {
  lost_dog: createDivIcon("🐶", "hsl(24, 95%, 65%)"),
  lost_cat: createDivIcon("🐱", "hsl(16, 85%, 75%)"),
  sighting: createDivIcon("👁️", "hsl(210, 65%, 58%)"),
  vet: createDivIcon("🏥", "hsl(145, 55%, 48%)"),
  event: createDivIcon("📅", "hsl(270, 55%, 55%)"),
  colony: createDivIcon("🐱", "hsl(40, 90%, 60%)"),
  user: createDivIcon("📍", "hsl(210, 90%, 56%)", 36),
  temp: createDivIcon("📌", "hsl(0, 72%, 55%)"),
};

// ── Component ──────────────────────────────────────────────────────────
export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const vetGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const eventsGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const coloniesGroupRef = useRef<L.LayerGroup>(L.layerGroup());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tempMarkerRef = useRef<L.Marker | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({ dogs: true, cats: true, sightings: true, vets: true, events: true, colonies: true });
  const [formOpen, setFormOpen] = useState(false);
  const [clickLatLng, setClickLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [selectedVet, setSelectedVet] = useState<any | null>(null);

  // ── Data ────────────────────────────────────────────────────────────
  const { data: reports = [] } = useQuery({
    queryKey: ["map-reports"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reports").select("*").eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: clinics = [] } = useQuery({
    queryKey: ["map-clinics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vet_clinics").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["map-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("is_approved", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: colonies = [] } = useQuery({
    queryKey: ["map-colonies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cat_colonies").select("*");
      if (error) throw error;
      return data;
    },
  });

  // ── Init map ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([-33.45, -70.66], 13);
    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Cluster groups
    const reportCluster = (L as any).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 40 : count < 50 ? 48 : 56;
        return L.divIcon({
          html: `<div style="background:hsl(16,90%,54%);width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${size < 48 ? 14 : 16}px;font-family:Outfit,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.2);border:3px solid white;">${count}</div>`,
          className: "custom-map-marker",
          iconSize: [size, size],
        });
      },
    });
    reportCluster.addTo(map);
    clusterGroupRef.current = reportCluster;

    const vetCluster = (L as any).markerClusterGroup({
      maxClusterRadius: 40,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="background:hsl(145,55%,48%);width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;font-family:Outfit,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.2);border:3px solid white;">🏥${count}</div>`,
          className: "custom-map-marker",
          iconSize: [40, 40],
        });
      },
    });
    vetCluster.addTo(map);
    vetGroupRef.current = vetCluster;

    eventsGroupRef.current.addTo(map);
    coloniesGroupRef.current.addTo(map);

    map.locate({ setView: true, maxZoom: 15 });
    map.on("locationfound", (e: L.LocationEvent) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(e.latlng);
      } else {
        userMarkerRef.current = L.marker(e.latlng, { icon: ICONS.user }).addTo(map);
      }
    });

    // Click to add report
    map.on("click", (e: L.LeafletMouseEvent) => {
      setSelectedReport(null);
      setSelectedVet(null);
      setClickLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      if (tempMarkerRef.current) tempMarkerRef.current.remove();
      tempMarkerRef.current = L.marker(e.latlng, { icon: ICONS.temp }).addTo(map);
      setFormOpen(true);
    });

    mapInstance.current = map;
    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapInstance.current = null;
      clusterGroupRef.current = null;
      vetGroupRef.current = null;
    };
  }, []);

  // ── Update report markers ──────────────────────────────────────────
  useEffect(() => {
    const cluster = clusterGroupRef.current;
    if (!cluster) return;
    cluster.clearLayers();

    reports.forEach((r) => {
      const isLost = r.type === "lost";
      const isSighting = r.type === "sighting";
      const titleLower = (r.title || "").toLowerCase();
      const isDog = titleLower.includes("perro") || titleLower.includes("dog");
      const isCat = titleLower.includes("gato") || titleLower.includes("cat");

      if (isLost && isDog && !filters.dogs) return;
      if (isLost && isCat && !filters.cats) return;
      if (isLost && !isDog && !isCat && !filters.dogs && !filters.cats) return;
      if (isSighting && !filters.sightings) return;
      if (r.type === "found" && !filters.sightings) return;

      let icon = ICONS.sighting;
      if (isLost && isCat) icon = ICONS.lost_cat;
      else if (isLost) icon = ICONS.lost_dog;

      const marker = L.marker([r.latitude, r.longitude], { icon });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedVet(null);
        setSelectedReport(r);
        setFormOpen(false);
      });
      cluster.addLayer(marker);
    });
  }, [reports, filters]);

  // ── Update vet markers ─────────────────────────────────────────────
  useEffect(() => {
    const cluster = vetGroupRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    if (!filters.vets) return;

    clinics.forEach((c) => {
      const marker = L.marker([c.latitude, c.longitude], { icon: ICONS.vet });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedReport(null);
        setSelectedVet(c);
        setFormOpen(false);
      });
      cluster.addLayer(marker);
    });
  }, [clinics, filters]);

  // ── Update event markers ───────────────────────────────────────────
  useEffect(() => {
    const group = eventsGroupRef.current;
    group.clearLayers();
    if (!filters.events) return;

    events.forEach((ev) => {
      if (!ev.latitude || !ev.longitude) return;
      const marker = L.marker([ev.latitude, ev.longitude], { icon: ICONS.event });
      marker.bindPopup(
        `<div style="width:220px;font-family:'DM Sans',system-ui,sans-serif;padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:18px;">📅</span>
            <span style="background:hsl(270,55%,55%);color:white;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">Evento</span>
          </div>
          <h3 style="margin:0 0 4px;font-size:14px;font-weight:700;font-family:'Outfit',sans-serif;">${ev.title}</h3>
          <p style="margin:0 0 4px;font-size:12px;color:#666;">${(ev.description || "").slice(0, 80)}${(ev.description?.length || 0) > 80 ? "…" : ""}</p>
          <p style="margin:0;font-size:11px;color:#999;">📍 ${ev.address || ev.city}</p>
        </div>`,
        { maxWidth: 240, className: "custom-popup" }
      );
      group.addLayer(marker);
    });
  }, [events, filters]);

  // ── Update colony markers ──────────────────────────────────────────
  useEffect(() => {
    const group = coloniesGroupRef.current;
    group.clearLayers();
    if (!filters.colonies) return;

    colonies.forEach((col) => {
      const marker = L.marker([col.latitude, col.longitude], { icon: ICONS.colony });
      marker.bindPopup(
        `<div style="width:220px;font-family:'DM Sans',system-ui,sans-serif;padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:18px;">🐱</span>
            <span style="background:hsl(40,90%,50%);color:white;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">Colonia</span>
          </div>
          <h3 style="margin:0 0 4px;font-size:14px;font-weight:700;font-family:'Outfit',sans-serif;">${col.name}</h3>
          <p style="margin:0 0 4px;font-size:12px;color:#666;">🐈 ${col.approximate_count} gatos · ✂️ ${col.sterilized_count || 0} esterilizados</p>
          <p style="margin:0;font-size:11px;color:#999;">📍 ${col.address || col.city}</p>
          ${col.needs_help ? '<p style="margin:4px 0 0;font-size:11px;color:hsl(0,72%,51%);font-weight:600;">⚠️ Necesita ayuda</p>' : ""}
        </div>`,
        { maxWidth: 240, className: "custom-popup" }
      );
      group.addLayer(marker);
    });
  }, [colonies, filters]);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setClickLatLng(null);
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
  }, []);

  const handleReportSubmitted = useCallback(() => {
    handleCloseForm();
    queryClient.invalidateQueries({ queryKey: ["map-reports"] });
    queryClient.invalidateQueries({ queryKey: ["recent-reports"] });
    toast.success("¡Reporte creado desde el mapa! 🐾");
  }, [handleCloseForm, queryClient]);

  const handleLocateMe = useCallback(() => {
    mapInstance.current?.locate({ setView: true, maxZoom: 15 });
  }, []);

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - var(--nav-height) - 2rem)" }}>
      {/* Filter bar */}
      <MapFilters filters={filters} onToggle={(key) => setFilters((f) => ({ ...f, [key]: !f[key] }))} />

      {/* Locate me */}
      <button
        onClick={handleLocateMe}
        className="absolute top-4 right-4 z-[1000] bg-card rounded-2xl p-3 border border-border hover:shadow-md transition-all duration-200 group"
        title="Mi ubicación"
        aria-label="Centrar en mi ubicación"
      >
        <Navigation className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Map */}
      <div ref={mapRef} style={{ height: "100%", width: "100%", borderRadius: "1rem" }} />

      {/* Floating report card */}
      {selectedReport && !formOpen && (
        <FloatingReportCard report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      {/* Floating vet card */}
      {selectedVet && !formOpen && (
        <FloatingVetCard clinic={selectedVet} onClose={() => setSelectedVet(null)} />
      )}

      {/* Report form */}
      {formOpen && clickLatLng && (
        <MapReportForm lat={clickLatLng.lat} lng={clickLatLng.lng} onClose={handleCloseForm} onSubmitted={handleReportSubmitted} />
      )}

      {/* Click hint */}
      {!formOpen && !selectedReport && !selectedVet && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] glass rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground pointer-events-none">
          Haz clic en el mapa para crear un reporte 📌
        </div>
      )}
    </div>
  );
}

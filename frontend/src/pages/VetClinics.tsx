import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope, MapPin, Navigation, ExternalLink, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOverpassVets } from "@/hooks/useOverpassVets";

const DEFAULT_CENTER: [number, number] = [-33.45, -70.66];

const vetIcon = L.divIcon({
  className: "custom-map-marker",
  html: `<div class="map-marker-bounce" style="background:hsl(145,55%,48%);width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 14px rgba(0,0,0,0.18);border:2.5px solid white;cursor:pointer;transition:transform 0.2s ease;" onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">🏥</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});

const userIcon = L.divIcon({
  className: "custom-map-marker",
  html: `<div style="background:hsl(210,90%,56%);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 14px rgba(0,0,0,0.18);border:2.5px solid white;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

export default function VetClinics() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const { data: vets = [], isLoading: vetsLoading } = useOverpassVets(userPos);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const center = userPos ? [userPos.lat, userPos.lng] as [number, number] : DEFAULT_CENTER;
    const map = L.map(mapRef.current, { zoomControl: false }).setView(center, 14);
    L.control.zoom({ position: "topright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: 40,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: (cl: any) => {
        const count = cl.getChildCount();
        return L.divIcon({
          html: `<div style="background:hsl(145,55%,48%);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;font-family:Outfit,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.2);border:3px solid white;">🏥${count}</div>`,
          className: "custom-map-marker",
          iconSize: [44, 44],
        });
      },
    });
    cluster.addTo(map);
    clusterRef.current = cluster;

    mapInstance.current = map;
    setTimeout(() => map.invalidateSize(), 150);
    return () => { map.remove(); mapInstance.current = null; clusterRef.current = null; };
  }, [userPos]);

  // User marker
  useEffect(() => {
    if (!mapInstance.current || !userPos) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userPos.lat, userPos.lng]);
    } else {
      userMarkerRef.current = L.marker([userPos.lat, userPos.lng], { icon: userIcon }).addTo(mapInstance.current);
    }
    mapInstance.current.setView([userPos.lat, userPos.lng], 14);
  }, [userPos]);

  // Vet markers
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    vets.forEach((v) => {
      const marker = L.marker([v.latitude, v.longitude], { icon: vetIcon });
      (marker as any)._vetId = v.id;
      const popup = `
        <div style="width:220px;font-family:'DM Sans',system-ui,sans-serif;padding:12px 14px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:20px;">🏥</span>
            <span style="background:hsl(145,55%,48%);color:white;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;">Veterinaria</span>
          </div>
          <h3 style="margin:0 0 4px;font-size:14px;font-weight:700;font-family:'Outfit',sans-serif;">${v.name}</h3>
          ${v.address ? `<p style="margin:0 0 4px;font-size:12px;color:#666;">📍 ${v.address}</p>` : ""}
          ${v.phone ? `<p style="margin:0 0 4px;font-size:12px;color:#666;">📞 ${v.phone}</p>` : ""}
          <p style="margin:0 0 8px;font-size:12px;color:#666;">📏 ${v.distance.toFixed(1)} km</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${v.latitude},${v.longitude}" target="_blank" rel="noopener" style="display:inline-block;background:hsl(145,55%,48%);color:white;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;text-decoration:none;">Abrir en mapa</a>
        </div>`;
      marker.bindPopup(popup, { maxWidth: 240, className: "custom-popup" });
      cluster.addLayer(marker);
    });
  }, [vets]);

  const handleLocateMe = useCallback(() => {
    mapInstance.current?.locate({ setView: true, maxZoom: 15 });
  }, []);

  const handleViewOnMap = useCallback((vet: typeof vets[number]) => {
    if (!mapInstance.current) return;
    mapInstance.current.setView([vet.latitude, vet.longitude], 16);
    setHighlightedId(vet.id);
    clusterRef.current?.eachLayer((layer) => {
      if ((layer as any)._vetId === vet.id && layer instanceof L.Marker) {
        layer.openPopup();
      }
    });
  }, []);

  const loading = locating || vetsLoading;

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-secondary/10">
          <Stethoscope className="h-7 w-7 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Veterinarias Cercanas</h1>
          <p className="text-sm text-muted-foreground">
            {userPos ? `Mostrando clínicas en un radio de 3 km · ${vets.length} encontradas` : "Mostrando clínicas en Santiago"}
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-border" style={{ height: "500px" }}>
          {loading && (
            <div className="absolute inset-0 z-[1001] bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Navigation className="h-8 w-8 text-secondary animate-pulse" />
                <p className="text-sm font-medium text-muted-foreground">Buscando veterinarias cercanas…</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLocateMe}
            className="absolute top-4 right-4 z-[1000] bg-card rounded-2xl p-3 shadow-md hover:shadow-lg transition-all duration-200 group border border-border"
            title="Mi ubicación"
          >
            <Navigation className="h-5 w-5 text-foreground group-hover:text-secondary transition-colors" />
          </button>
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : vets.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground font-medium">No se encontraron veterinarias cercanas</p>
              </CardContent>
            </Card>
          ) : (
            vets.map((v) => (
              <Card
                key={v.id}
                className={cn(
                  "border transition-all duration-200 cursor-pointer hover:shadow-md card-hover",
                  highlightedId === v.id ? "border-secondary shadow-md" : "border-border"
                )}
                onClick={() => handleViewOnMap(v)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm text-foreground font-display leading-tight mb-2">{v.name}</h3>
                  {v.address && (
                    <p className="text-xs text-muted-foreground flex items-start gap-1 mb-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />{v.address}
                    </p>
                  )}
                  {v.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <Phone className="h-3 w-3 shrink-0" />{v.phone}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-secondary">📍 {v.distance.toFixed(1)} km</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs px-3" onClick={(e) => { e.stopPropagation(); handleViewOnMap(v); }}>
                        Ver en mapa
                      </Button>
                      <Button size="sm" className="h-7 text-xs px-3 bg-secondary hover:bg-secondary/90" asChild>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${v.latitude},${v.longitude}`} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="h-3 w-3 mr-1" /> Abrir
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

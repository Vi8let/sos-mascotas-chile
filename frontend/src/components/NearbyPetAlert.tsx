import { useEffect, useState, useRef, useCallback } from "react";
import { X, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NearbyReport {
  id: string;
  title: string;
  photos?: string[] | null;
  latitude: number;
  longitude: number;
  type: string;
  created_at: string;
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const RADIUS_KM = 2;
const CHECK_INTERVAL = 60000; // 1 minute

export function NearbyPetAlert() {
  const [alert, setAlert] = useState<(NearbyReport & { distance: number }) | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const lastCheckRef = useRef<string | null>(null);
  const navigate = useNavigate();

  // Get user location once
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  const checkNearby = useCallback(async () => {
    if (!userPos) return;

    // TODO: Usar el servicio real
    const data: any[] = []; // Mock vacio por ahora

    lastCheckRef.current = new Date().toISOString();

    if (!data) return;

    for (const r of data) {
      if (dismissed.has(r.id)) continue;
      const dist = getDistanceKm(userPos.lat, userPos.lng, r.latitude, r.longitude);
      if (dist <= RADIUS_KM) {
        setAlert({ ...r, distance: dist });
        return;
      }
    }
  }, [userPos, dismissed]);

  // Periodic check
  useEffect(() => {
    if (!userPos) return;
    checkNearby();
    const interval = setInterval(checkNearby, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [userPos, checkNearby]);

  if (!alert) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top-4 duration-300">
      <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 backdrop-blur-xl" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <button
          onClick={() => {
            setDismissed((s) => new Set(s).add(alert.id));
            setAlert(null);
          }}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4 text-destructive" />
        </button>

        <div className="flex gap-3">
          {alert.photos?.[0] && (
            <img
              src={alert.photos[0]}
              alt={alert.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-xs font-bold text-destructive">Mascota perdida cerca de ti</span>
            </div>
            <p className="text-sm font-semibold text-foreground line-clamp-1">{alert.title}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> A {alert.distance.toFixed(1)} km de tu ubicación
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full mt-3 rounded-full h-8 text-xs font-semibold"
          onClick={() => {
            setDismissed((s) => new Set(s).add(alert.id));
            setAlert(null);
            navigate("/mapa");
          }}
        >
          Ver en mapa
        </Button>
      </div>
    </div>
  );
}

import { Marker } from "react-leaflet";
import L from "leaflet";

const createIcon = (emoji: string, color: string, opacity = 1) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};width:40px;height:40px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:2.5px solid white;opacity:${opacity};">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const icons = {
  lost: createIcon("🐾", "hsl(0, 72%, 51%)"),
  found: createIcon("🎉", "hsl(160, 55%, 40%)", 0.6),
  sighting: createIcon("👁️", "hsl(40, 90%, 60%)"),
  colony: createIcon("🐱", "hsl(270, 55%, 55%)"),
  clinic: createIcon("🏥", "hsl(200, 65%, 48%)"),
  event: createIcon("📅", "hsl(16, 90%, 54%)"),
};

interface MapMarkersProps {
  reports: any[];
  colonies: any[];
  clinics: any[];
  events: any[];
}

export function MapMarkers({ reports, colonies, clinics, events }: MapMarkersProps) {
  return (
    <>
      {reports.slice(0, 5).map((r) => {
        const isResolved = !r.is_active || !!r.resolved_at;
        const iconKey = isResolved ? "found" : (r.type as keyof typeof icons);
        return (
          <Marker
            key={`r-${r.id}`}
            position={[r.latitude, r.longitude]}
            icon={icons[iconKey] ?? icons.sighting}
          />
        );
      })}
      {colonies.slice(0, 5).map((c) => (
        <Marker key={`c-${c.id}`} position={[c.latitude, c.longitude]} icon={icons.colony} />
      ))}
      {clinics.slice(0, 5).map((cl) => (
        <Marker key={`cl-${cl.id}`} position={[cl.latitude, cl.longitude]} icon={icons.clinic} />
      ))}
      {events.filter(e => e.latitude && e.longitude).slice(0, 5).map((ev) => (
        <Marker key={`e-${ev.id}`} position={[ev.latitude!, ev.longitude!]} icon={icons.event} />
      ))}
    </>
  );
}

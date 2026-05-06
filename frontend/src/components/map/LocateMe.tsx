import { useCallback } from "react";
import { useMap } from "react-leaflet";
import { Crosshair } from "lucide-react";

export function LocateMe() {
  const map = useMap();

  const handleLocate = useCallback(() => {
    map.locate({ setView: true, maxZoom: 15 });
  }, [map]);

  return (
    <button
      onClick={handleLocate}
      className="absolute top-4 right-4 z-[1000] glass rounded-2xl p-3 hover:bg-card transition-all duration-200 group"
      title="Mi ubicación"
      aria-label="Centrar en mi ubicación"
    >
      <Crosshair className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
    </button>
  );
}

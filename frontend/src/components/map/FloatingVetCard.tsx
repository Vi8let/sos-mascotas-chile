import { X, MapPin, Phone, Star, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VetData {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  latitude: number;
  longitude: number;
  is_24_hours?: boolean | null;
  is_verified?: boolean | null;
  has_microchip_scanner?: boolean | null;
}

interface FloatingVetCardProps {
  clinic: VetData;
  onClose: () => void;
}

export function FloatingVetCard({ clinic, onClose }: FloatingVetCardProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1001] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-8 duration-300 ease-out">
      <div className="bg-card rounded-2xl border border-border overflow-hidden p-4" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🏥</span>
          <Badge className="bg-secondary/15 text-secondary border-0 text-[10px] font-bold">
            Veterinaria
          </Badge>
          {clinic.is_24_hours && (
            <Badge className="bg-accent/15 text-accent-foreground border-0 text-[10px] font-bold">
              <Clock className="h-3 w-3 mr-0.5" /> 24h
            </Badge>
          )}
          {clinic.is_verified && (
            <Badge className="bg-primary/15 text-primary border-0 text-[10px] font-bold">
              ✓ Verificada
            </Badge>
          )}
        </div>

        <h3 className="font-display font-bold text-sm text-foreground mb-1">{clinic.name}</h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{clinic.address}</span>
        </div>

        {clinic.phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Phone className="h-3 w-3 shrink-0" />
            <span>{clinic.phone}</span>
          </div>
        )}

        {clinic.has_microchip_scanner && (
          <p className="text-xs text-secondary font-medium mb-2">📟 Lector de microchip disponible</p>
        )}

        <Button size="sm" className="w-full rounded-full h-8 text-xs font-semibold bg-secondary hover:bg-secondary/90 mt-2" asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`}
            target="_blank"
            rel="noopener"
          >
            <ExternalLink className="h-3 w-3 mr-1.5" />
            Ver en Google Maps
          </a>
        </Button>
      </div>
    </div>
  );
}

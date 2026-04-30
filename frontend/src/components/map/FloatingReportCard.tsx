import { X, MapPin, ExternalLink, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ReportData {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  photos?: string[] | null;
  city?: string;
  address?: string | null;
  contact_phone?: string | null;
  created_at?: string;
}

interface FloatingReportCardProps {
  report: ReportData;
  onClose: () => void;
}

export function FloatingReportCard({ report, onClose }: FloatingReportCardProps) {
  const navigate = useNavigate();
  const photo = report.photos?.[0];
  const statusLabel = report.type === "lost" ? "Perdido" : report.type === "found" ? "Encontrado" : "Avistado";
  const statusColor = report.type === "lost" ? "destructive" : report.type === "sighting" ? "default" : "secondary";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1001] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-8 duration-300 ease-out">
      <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
        {/* Close & Share */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          <ShareButton reportId={report.id} title={report.title} description={report.description || undefined} />
          <button onClick={onClose} className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-0">
          {photo && (
            <div className="w-28 shrink-0">
              <img src={photo} alt={report.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className={cn("flex-1 p-4", !photo && "pl-4")}>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={statusColor as any} className="text-[10px] font-bold px-2 py-0.5">
                {report.type === "lost" ? "🚨" : "👁️"} {statusLabel}
              </Badge>
            </div>

            <h3 className="font-display font-bold text-sm text-foreground leading-tight mb-1 line-clamp-1">
              {report.title}
            </h3>

            {report.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5 leading-relaxed">
                {report.description}
              </p>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">{report.address || report.city || "Sin ubicación"}</span>
            </div>

            {report.contact_phone && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Phone className="h-3 w-3 shrink-0" />
                <a href={`tel:${report.contact_phone}`} className="hover:text-foreground transition-colors">
                  {report.contact_phone}
                </a>
              </div>
            )}

            <Button
              size="sm"
              className="w-full rounded-full h-8 text-xs font-semibold"
              onClick={() => navigate(`/reporte/${report.id}`)}
            >
              <ExternalLink className="h-3 w-3 mr-1.5" />
              Ver detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

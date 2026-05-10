import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  adoption: { label: "Adopción", emoji: "🏠", color: "bg-primary/15 text-primary" },
  sterilization: { label: "Esterilización", emoji: "✂️", color: "bg-secondary/15 text-secondary" },
  vaccination: { label: "Vacunación", emoji: "💉", color: "bg-accent/15 text-accent-foreground" },
  rescue: { label: "Rescate", emoji: "🆘", color: "bg-destructive/15 text-destructive" },
  other: { label: "Otro", emoji: "📅", color: "bg-muted text-muted-foreground" },
};

export default function Events() {
  const navigate = useNavigate();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // Mock para eliminar Supabase
      return [];
    },
  });

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-primary/10">
          <Calendar className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Eventos Comunitarios</h1>
          <p className="text-sm text-muted-foreground">
            Adopciones, jornadas de esterilización, vacunación y más
          </p>
        </div>
      </div>

      {/* Event grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display font-bold text-lg text-foreground mb-2">No hay eventos próximos</h3>
            <p className="text-muted-foreground text-sm">Vuelve pronto para ver nuevos eventos comunitarios.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;
            const startDate = new Date(event.start_date);
            const isPast = startDate < new Date();

            return (
              <Card
                key={event.id}
                className={cn(
                  "border transition-all duration-200 hover:shadow-md card-hover",
                  isPast ? "opacity-60" : ""
                )}
              >
                <CardContent className="p-5">
                  {/* Type badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={cn("border-0 text-[11px] font-bold", config.color)}>
                      {config.emoji} {config.label}
                    </Badge>
                    {isPast && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Finalizado</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight">
                    {event.title}
                  </h3>

                  {/* Description */}
                  {event.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="font-medium">
                      {format(startDate, "d 'de' MMMM, yyyy · HH:mm", { locale: es })}
                    </span>
                  </div>

                  {/* Location */}
                  {event.address && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-secondary" />
                      <span>{event.address}, {event.city}</span>
                    </div>
                  )}

                  {/* Actions */}
                  {event.latitude && event.longitude && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-full h-8 text-xs font-semibold"
                      onClick={() => navigate("/mapa")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1.5" />
                      Ver en mapa
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

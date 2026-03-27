import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Cat, MapPin, Users, Scissors, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function CatColonies() {
  const navigate = useNavigate();

  const { data: colonies = [], isLoading } = useQuery({
    queryKey: ["cat-colonies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cat_colonies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-accent/20">
          <Cat className="h-7 w-7 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Colonias Felinas</h1>
          <p className="text-sm text-muted-foreground">
            Directorio de colonias registradas, estado de esterilización y necesidades
          </p>
        </div>
      </div>

      {/* Stats bar */}
      {!isLoading && colonies.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <div className="glass rounded-2xl px-4 py-2.5 text-sm">
            🐱 <span className="font-semibold text-foreground">{colonies.length}</span> <span className="text-muted-foreground">colonias</span>
          </div>
          <div className="glass rounded-2xl px-4 py-2.5 text-sm">
            🐈 <span className="font-semibold text-foreground">{colonies.reduce((s, c) => s + c.approximate_count, 0)}</span> <span className="text-muted-foreground">gatos aprox.</span>
          </div>
          <div className="glass rounded-2xl px-4 py-2.5 text-sm">
            ✂️ <span className="font-semibold text-foreground">{colonies.reduce((s, c) => s + (c.sterilized_count || 0), 0)}</span> <span className="text-muted-foreground">esterilizados</span>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : colonies.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Cat className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display font-bold text-lg text-foreground mb-2">No hay colonias registradas</h3>
            <p className="text-muted-foreground text-sm">Sé el primero en registrar una colonia felina.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colonies.map((colony) => {
            const sterilizationPct = colony.sterilized_count
              ? Math.round((colony.sterilized_count / colony.approximate_count) * 100)
              : 0;

            return (
              <Card
                key={colony.id}
                className={cn(
                  "border transition-all duration-200 hover:shadow-md card-hover",
                  colony.needs_help ? "border-destructive/30" : ""
                )}
              >
                <CardContent className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {colony.is_verified && (
                      <Badge className="bg-secondary/15 text-secondary border-0 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verificada
                      </Badge>
                    )}
                    {colony.needs_help && (
                      <Badge className="bg-destructive/15 text-destructive border-0 text-[10px] font-bold">
                        <AlertCircle className="h-3 w-3 mr-0.5" /> Necesita ayuda
                      </Badge>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight flex items-center gap-2">
                    <span className="text-lg">🐱</span> {colony.name}
                  </h3>

                  {/* Description */}
                  {colony.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                      {colony.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Cat className="h-3.5 w-3.5 shrink-0" />
                      <span><span className="font-semibold text-foreground">{colony.approximate_count}</span> gatos aprox.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Scissors className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <span className="font-semibold text-foreground">{colony.sterilized_count || 0}</span> esterilizados
                        <span className="ml-1 text-secondary font-semibold">({sterilizationPct}%)</span>
                      </span>
                    </div>
                    {/* Sterilization bar */}
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-500"
                        style={{ width: `${sterilizationPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Caretaker */}
                  {colony.caretaker_name && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>{colony.caretaker_name}</span>
                    </div>
                  )}

                  {/* Location */}
                  {colony.address && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{colony.address}, {colony.city}</span>
                    </div>
                  )}

                  {/* Action */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full rounded-full h-8 text-xs font-semibold"
                    onClick={() => navigate("/mapa")}
                  >
                    Ver en mapa
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { petService } from "@/services/petService";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Clock, Filter, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import emptyImg from "@/assets/empty-state-pets.png";

const statusConfig: Record<string, { label: string; emoji: string; className: string }> = {
  lost: { label: "Perdido", emoji: "🚨", className: "bg-destructive/10 text-destructive border-destructive/20" },
  sighting: { label: "Avistado", emoji: "👁️", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  found: { label: "Encontrado", emoji: "✅", className: "bg-secondary/10 text-secondary border-secondary/20" },
};

export default function Reports() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "lost" | "sighting" | "found">("all");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["all-reports"],
    queryFn: async () => {
      // Reemplaza la consulta directa a Supabase por la llamada al nuevo servicio (Mock API)
      const data = await petService.getPets();
      return data;
    },
  });

  const filtered = reports.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const petName = (r.pets as any)?.name?.toLowerCase() || "";
      return (
        r.title.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.address || "").toLowerCase().includes(q) ||
        petName.includes(q)
      );
    }
    return true;
  });

  const filterButtons: { key: typeof filterType; label: string; emoji: string }[] = [
    { key: "all", label: "Todos", emoji: "📋" },
    { key: "lost", label: "Perdidos", emoji: "🚨" },
    { key: "sighting", label: "Avistados", emoji: "👁️" },
    { key: "found", label: "Encontrados", emoji: "✅" },
  ];

  return (
    <div className="container py-8 px-4 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Reportes de Mascotas 🐾
          </h1>
          <p className="text-muted-foreground">
            Explora todos los reportes activos de mascotas perdidas y avistamientos.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, ciudad o comuna..."
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            {filterButtons.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                  filterType === f.key
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <span>{f.emoji}</span>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <img src={emptyImg} alt="Sin reportes" className="w-48 h-48 object-contain mb-6 opacity-80" />
            <h3 className="text-xl font-display font-bold text-foreground mb-2">
              {search.trim() ? "No se encontraron resultados 🔍" : "Aún no hay reportes 🐾"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {search.trim()
                ? "Intenta con otros términos de búsqueda."
                : "Sé el primero en reportar una mascota perdida o un avistamiento."}
            </p>
            {!search.trim() && (
              <Link to="/reportar-perdido">
                <Button className="rounded-full px-6 font-semibold gap-2">
                  <PawPrint className="h-4 w-4" /> Reportar mascota perdida
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        {/* Reports grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((report, i) => {
              const pet = report.pets as any;
              const photo = pet?.photos?.[0] || report.photos?.[0];
              const petName = pet?.name || report.title;
              const species = pet?.species;
              const config = statusConfig[report.type] || statusConfig.lost;
              const timeAgo = formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: es });

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={cn(
                    "rounded-2xl border border-border bg-card overflow-hidden card-hover group",
                    (!report.is_active || report.resolved_at) && "opacity-60"
                  )}
                >
                  {/* Photo */}
                  <div className="relative h-44 bg-muted">
                    {photo ? (
                      <img src={photo} alt={petName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {species === "cat" ? "🐱" : "🐶"}
                      </div>
                    )}
                    <Badge className={cn("absolute top-3 left-3 border rounded-full text-xs font-semibold", config.className)}>
                      {config.emoji} {config.label}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground mb-1 truncate">{petName}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                      {(report.description || "Sin descripción").slice(0, 100)}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {report.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {timeAgo}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/reporte/${report.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
                          Ver detalles
                        </Button>
                      </Link>
                      <Link to={`/mapa?lat=${report.latitude}&lng=${report.longitude}`}>
                        <Button variant="ghost" size="sm" className="rounded-xl text-xs">
                          <MapPin className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Mostrando {filtered.length} reporte{filtered.length !== 1 ? "s" : ""} activo{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </motion.div>
    </div>
  );
}

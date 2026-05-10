import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { petService } from "@/services/petService";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, MapPin, PawPrint, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import emptyStatePets from "@/assets/empty-state-pets.png";

const speciesLabels: Record<string, string> = {
  dog: "🐶 Perro",
  cat: "🐱 Gato",
  bird: "🐦 Ave",
  rabbit: "🐰 Conejo",
  hamster: "🐹 Hámster",
  turtle: "🐢 Tortuga",
  fish: "🐟 Pez",
  other: "🐾 Otro",
};

const typeConfig: Record<string, { label: string; variant: "destructive" | "secondary" | "default" }> = {
  lost: { label: "Perdido", variant: "destructive" },
  sighting: { label: "Avistado", variant: "secondary" },
  found: { label: "Encontrado", variant: "default" },
};

const placeholderPhotos = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=300&fit=crop",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export function RecentReports() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: async () => {
      return await petService.getRecentReports();
    },
  });

  const hasReports = reports && reports.length > 0;

  return (
    <section className="bg-muted/30">
      <div className="container py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Reportes recientes
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Los últimos reportes de mascotas en la comunidad.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !hasReports ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center max-w-md mx-auto py-8"
          >
            <img
              src={emptyStatePets}
              alt="Sin reportes"
              className="w-48 h-48 mb-6 drop-shadow-md"
            />
            <p className="text-lg font-semibold text-foreground mb-2">
              Aún no hay reportes en esta zona 🐾
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Sé el primero en ayudar a la comunidad reportando una mascota perdida o un avistamiento.
            </p>
            <Button asChild size="lg" className="gap-2 rounded-full font-semibold shadow-lg">
              <Link to="/reportar-perdido">
                <PawPrint className="h-5 w-5" />
                Reportar mascota perdida
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          >
            {reports.map((report: any, index: number) => {
              const pet = report.pets;
              const photo =
                pet?.photos?.[0] ||
                report.photos?.[0] ||
                placeholderPhotos[index % placeholderPhotos.length];
              const petName = pet?.name || report.title;
              const species = pet?.species
                ? speciesLabels[pet.species] || pet.species
                : "🐾 Mascota";
              const t = typeConfig[report.type] ?? typeConfig.sighting;
              const desc = report.description
                ? truncate(report.description, 80)
                : null;
              const timeAgo = formatDistanceToNow(new Date(report.created_at), {
                addSuffix: true,
                locale: es,
              });

              return (
                <motion.div key={report.id} variants={itemVariants}>
                  <div className="rounded-2xl overflow-hidden border border-border/50 h-full bg-card flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1">
                    {/* Photo */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={photo}
                        alt={petName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      <Badge variant={t.variant} className="absolute top-3 left-3 rounded-full text-xs px-3 py-1 shadow-md">
                        {t.label}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-2">
                        <h3 className="font-bold text-base text-foreground mb-1">
                          {petName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{species}</p>
                      </div>

                      {desc && (
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {desc}
                        </p>
                      )}

                      <div className="mt-auto space-y-3">
                        <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                          {report.city !== "Sin especificar" ? (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{report.city}</span>
                            </span>
                          ) : <span />}
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {timeAgo}
                          </span>
                        </div>
                        <Link
                          to={`/reporte/${report.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          Ver detalles <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { findOrCreateConversation } from "@/lib/messaging";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Loader2, ArrowLeft, Share2, MessageCircle, Star, MapPin,
  Calendar, Tag, Eye, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SightingChatDialog } from "@/components/SightingChatDialog";
import { MarkFoundButton } from "@/components/MarkFoundButton";
import { HelpedButton } from "@/components/HelpedButton";
import { ReportFlagDialog } from "@/components/ReportFlagDialog";
import { ReputationBadges } from "@/components/ReputationBadges";

const typeConfig: Record<string, { label: string; emoji: string; variant: "destructive" | "default" | "secondary" }> = {
  lost: { label: "Perdido", emoji: "🐾", variant: "destructive" },
  found: { label: "Encontrado", emoji: "✅", variant: "default" },
  sighting: { label: "Avistamiento", emoji: "👁️", variant: "secondary" },
};

const speciesLabels: Record<string, string> = {
  dog: "Perro", cat: "Gato", bird: "Ave", rabbit: "Conejo",
  hamster: "Hámster", turtle: "Tortuga", fish: "Pez", other: "Otro",
};

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacting, setContacting] = useState(false);
  const [sightingOpen, setSightingOpen] = useState(false);

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("reports").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: pet } = useQuery({
    queryKey: ["report-pet", report?.pet_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("pets").select("*").eq("id", report!.pet_id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!report?.pet_id,
  });

  const { data: reporter } = useQuery({
    queryKey: ["report-profile", report?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", report!.user_id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!report?.user_id,
  });

  const { data: reporterHelpCount = 0 } = useQuery({
    queryKey: ["reporter-help-count", report?.user_id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("report_helpers")
        .select("id", { count: "exact", head: true })
        .eq("user_id", report!.user_id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!report?.user_id,
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: report?.title ?? "Reporte", url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const handleSighting = () => {
    if (!user) { navigate("/login"); return; }
    if (report?.user_id === user.id) {
      toast.info("No puedes reportar un avistamiento de tu propio reporte.");
      return;
    }
    setSightingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Reporte no encontrado</h1>
        <p className="text-muted-foreground mt-2">El reporte que buscas no existe o fue eliminado.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  const t = typeConfig[report.type] ?? typeConfig.sighting;
  const photos = pet?.photos?.length ? pet.photos : report.photos;
  const mainPhoto = photos?.[0];
  const isResolved = !report.is_active || !!report.resolved_at;
  const isOwner = user?.id === report.user_id;

  return (
    <div className="container max-w-3xl py-8 px-4 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </Link>

      {/* Found celebration banner */}
      {isResolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-secondary text-sm">¡Esta mascota ya fue encontrada!</p>
            <p className="text-xs text-muted-foreground">Gracias a la comunidad por su ayuda.</p>
          </div>
        </motion.div>
      )}

      {/* Photo + Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-3xl overflow-hidden ${isResolved ? "opacity-80" : ""}`}
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {mainPhoto ? (
          <img src={mainPhoto} alt={report.title} className="w-full h-72 sm:h-96 object-cover" />
        ) : (
          <div className="w-full h-72 sm:h-96 bg-muted flex items-center justify-center">
            <span className="text-7xl">{t.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-5 left-5 flex gap-2">
          <Badge variant={t.variant} className="text-sm px-4 py-1.5 rounded-full shadow-lg">
            {t.emoji} {t.label}
          </Badge>
          {isResolved && (
            <Badge className="text-sm px-4 py-1.5 rounded-full shadow-lg bg-secondary text-secondary-foreground">
              ✅ Encontrada
            </Badge>
          )}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{report.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(report.created_at), "d MMMM yyyy", { locale: es })}
            </span>
            {report.city !== "Sin especificar" && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />{report.city}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Community actions */}
      <div className="flex flex-wrap items-center gap-2">
        <HelpedButton reportId={report.id} />
        <ReportFlagDialog reportId={report.id} />
      </div>

      {/* Pet details */}
      {pet && (
        <Card className="card-hover rounded-2xl border-border/50">
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-bold text-foreground flex items-center gap-2 text-base">
              <Tag className="h-4 w-4 text-primary" /> Datos de la mascota
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                { label: "Nombre", value: pet.name },
                { label: "Especie", value: speciesLabels[pet.species] ?? pet.species },
                pet.breed ? { label: "Raza", value: pet.breed } : null,
                pet.color ? { label: "Color", value: pet.color } : null,
                pet.size ? { label: "Tamaño", value: pet.size } : null,
              ].filter(Boolean).map((item) => (
                <div key={item!.label} className="bg-muted/50 rounded-xl p-3">
                  <span className="text-muted-foreground block text-xs font-medium">{item!.label}</span>
                  <span className="font-semibold text-foreground capitalize">{item!.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {report.description && (
        <Card className="card-hover rounded-2xl border-border/50">
          <CardContent className="pt-6">
            <h2 className="font-bold text-foreground mb-3 text-base">Descripción</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{report.description}</p>
          </CardContent>
        </Card>
      )}

      <Card className="card-hover rounded-2xl border-border/50">
        <CardContent className="pt-6">
          <h2 className="font-bold text-foreground flex items-center gap-2 text-base mb-3">
            <MapPin className="h-4 w-4 text-primary" /> Última ubicación conocida
          </h2>
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            {report.address && <p className="text-sm text-foreground font-medium">{report.address}</p>}
            <p className="text-xs text-muted-foreground">📍 Coordenadas: {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</p>
            {report.city !== "Sin especificar" && (
              <p className="text-xs text-muted-foreground">🏙️ {report.city}, {report.region}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {report.contact_phone && (
        <Card className="card-hover rounded-2xl border-border/50">
          <CardContent className="pt-6">
            <h2 className="font-bold text-foreground flex items-center gap-2 text-base mb-3">
              <Phone className="h-4 w-4 text-primary" /> Información de contacto
            </h2>
            <p className="text-sm text-muted-foreground">📞 {report.contact_phone}</p>
          </CardContent>
        </Card>
      )}

      {reporter && (
        <Card className="card-hover rounded-2xl border-border/50">
          <CardContent className="pt-6">
            <h2 className="font-bold text-foreground mb-4 text-base">Reportado por</h2>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl font-bold text-primary shadow-sm">
                {(reporter.display_name ?? "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{reporter.display_name ?? "Usuario"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Star className="h-3.5 w-3.5 text-accent fill-accent" /> {reporter.reputation_points ?? 0} puntos de reputación
                </p>
                <ReputationBadges reputationPoints={reporter.reputation_points ?? 0} helperCount={reporterHelpCount} className="mt-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-4">
        {isOwner && report.type === "lost" && (
          <MarkFoundButton reportId={report.id} isResolved={isResolved} />
        )}
        {!isResolved && (
          <>
            <Button size="lg" variant="outline" className="flex-1 gap-2 rounded-full font-semibold" onClick={handleSighting}>
              <Eye className="h-4 w-4" /> Lo vi
            </Button>
            <Button
              size="lg"
              className="flex-1 gap-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={contacting || report.user_id === user?.id}
              onClick={async () => {
                if (!user) { navigate("/login"); return; }
                setContacting(true);
                try {
                  const convoId = await findOrCreateConversation(user.id, report.user_id);
                  navigate(`/mensajes?c=${convoId}`);
                } catch { toast.error("Error al iniciar conversación"); } finally { setContacting(false); }
              }}
            >
              {contacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
              Contactar al dueño
            </Button>
          </>
        )}
        <Button variant="outline" size="lg" className="flex-1 gap-2 rounded-full font-semibold" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Compartir
        </Button>
      </div>

      {report && (
        <SightingChatDialog
          open={sightingOpen}
          onOpenChange={setSightingOpen}
          reportTitle={report.title}
          reportOwnerId={report.user_id}
        />
      )}
    </div>
  );
}

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { History, MapPin, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; emoji: string; className: string }> = {
  lost: { label: "Perdido", emoji: "🚨", className: "bg-destructive/10 text-destructive border-destructive/20" },
  sighting: { label: "Avistado", emoji: "👁️", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  found: { label: "Encontrado", emoji: "✅", className: "bg-secondary/10 text-secondary border-secondary/20" },
};

export default function ReportHistory() {
  const { user } = useAuth();

  const { data: myReports = [], isLoading: loadingMine } = useQuery({
    queryKey: ["my-reports", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*, pets(name, species, photos)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: helpedReports = [], isLoading: loadingHelped } = useQuery({
    queryKey: ["helped-reports", user?.id],
    queryFn: async () => {
      const { data: helpers, error: hErr } = await supabase
        .from("report_helpers")
        .select("report_id")
        .eq("user_id", user!.id);
      if (hErr) throw hErr;
      if (!helpers?.length) return [];
      const ids = helpers.map((h) => h.report_id);
      const { data, error } = await supabase
        .from("reports")
        .select("*, pets(name, species, photos)")
        .in("id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isLoading = loadingMine || loadingHelped;

  const resolvedCount = myReports.filter((r) => !r.is_active || r.resolved_at).length;
  const activeCount = myReports.filter((r) => r.is_active && !r.resolved_at).length;

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Historial de Reportes</h1>
        </div>
        <p className="text-muted-foreground ml-[52px] mb-8">
          Tus reportes y los casos en los que ayudaste.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Mis reportes", value: myReports.length, icon: AlertTriangle, color: "text-destructive" },
            { label: "Resueltos", value: resolvedCount, icon: CheckCircle, color: "text-secondary" },
            { label: "Casos ayudados", value: helpedReports.length, icon: Eye, color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
              <s.icon className={cn("h-5 w-5 mx-auto mb-1", s.color)} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* My reports */}
        <h2 className="font-bold text-foreground text-lg mb-4">Mis Reportes</h2>
        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
        ) : myReports.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No has creado reportes aún.</p>
        ) : (
          <div className="space-y-3 mb-10">
            {myReports.map((report: any) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* Helped reports */}
        {helpedReports.length > 0 && (
          <>
            <h2 className="font-bold text-foreground text-lg mb-4">Casos en los que ayudé</h2>
            <div className="space-y-3">
              {helpedReports.map((report: any) => (
                <ReportRow key={report.id} report={report} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function ReportRow({ report }: { report: any }) {
  const pet = report.pets;
  const photo = pet?.photos?.[0] || report.photos?.[0];
  const config = statusConfig[report.type] || statusConfig.lost;
  const isResolved = !report.is_active || !!report.resolved_at;
  const timeAgo = formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: es });

  return (
    <Link to={`/reporte/${report.id}`}>
      <div className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all",
        isResolved && "opacity-70"
      )}>
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          {photo ? (
            <img src={photo} alt={report.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm truncate">{pet?.name || report.title}</h3>
            <Badge variant="outline" className={cn("text-[10px] rounded-full border", config.className)}>
              {config.emoji} {config.label}
            </Badge>
            {isResolved && (
              <Badge variant="outline" className="text-[10px] rounded-full border-secondary/20 bg-secondary/10 text-secondary">
                ✅ Resuelto
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {report.city}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

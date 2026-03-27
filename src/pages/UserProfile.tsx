import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Star, PawPrint, ClipboardList, History } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReputationBadges } from "@/components/ReputationBadges";

export default function UserProfile() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: helpCount = 0 } = useQuery({
    queryKey: ["my-help-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("report_helpers")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: reportCount = 0 } = useQuery({
    queryKey: ["my-report-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-12 space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
        {/* Profile card */}
        <Card className="rounded-2xl border-border/50 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
          <CardContent className="-mt-10 pb-6">
            <div className="flex items-end gap-4 mb-4">
              <div className="h-20 w-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center text-3xl font-bold text-primary shadow-lg">
                {(profile?.display_name ?? "U")[0].toUpperCase()}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-foreground">{profile?.display_name ?? "Usuario"}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-sm font-semibold text-foreground">{profile?.reputation_points ?? 0} puntos de reputación</span>
            </div>

            <ReputationBadges reputationPoints={profile?.reputation_points ?? 0} helperCount={helpCount} />

            {(profile?.city || profile?.region) && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-3">
                <MapPin className="h-3.5 w-3.5" /> {profile?.city}{profile?.region ? `, ${profile.region}` : ""}
              </p>
            )}

            {profile?.bio && (
              <p className="text-sm text-muted-foreground mt-3">{profile.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <ClipboardList className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold text-foreground">{reportCount}</p>
            <p className="text-xs text-muted-foreground">Reportes creados</p>
          </div>
          <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <PawPrint className="h-5 w-5 mx-auto mb-1 text-secondary" />
            <p className="text-2xl font-bold text-foreground">{helpCount}</p>
            <p className="text-xs text-muted-foreground">Casos ayudados</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-2">
          <Link to="/historial">
            <Button variant="outline" className="w-full rounded-xl justify-start gap-2 font-semibold">
              <History className="h-4 w-4" /> Ver historial de reportes
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full rounded-xl justify-start gap-2 font-semibold">
              <User className="h-4 w-4" /> Ir al panel de usuario
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

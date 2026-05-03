import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { reportService } from "@/services/reportService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HandHeart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HelpedButtonProps {
  reportId: string;
}

export function HelpedButton({ reportId }: HelpedButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data } = useQuery({
    queryKey: ["report-helpers", reportId],
    queryFn: async () => {
      // Reemplaza llamada a Supabase por mock del servicio
      return await reportService.getHelpers(reportId);
    },
  });

  const count = data?.length ?? 0;
  // Supongamos que la estructura devuelta por el backend será { user_id: string }[]
  const hasHelped = data?.some((h: any) => h.user_id === user?.id) ?? false;

  const handleToggle = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      // Reemplaza supabase.delete/insert por nuestro servicio
      const response = await reportService.markAsHelped(reportId, hasHelped);
      if (!response.success) throw new Error("Error de red");

      if (hasHelped) {
        toast.success("Se eliminó tu ayuda");
      } else {
        toast.success("¡Gracias por ayudar! 🐾");
      }
      queryClient.invalidateQueries({ queryKey: ["report-helpers", reportId] });
    } catch {
      toast.error("Error al registrar tu ayuda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={hasHelped ? "default" : "outline"}
      size="sm"
      className="gap-1.5 rounded-full text-xs font-semibold"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <HandHeart className="h-3.5 w-3.5" />}
      {hasHelped ? "Ayudé" : "Ayudé en este caso"}
      {count > 0 && <span className="ml-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>}
    </Button>
  );
}

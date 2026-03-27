import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from("report_helpers")
        .select("id, user_id")
        .eq("report_id", reportId);
      if (error) throw error;
      return data ?? [];
    },
  });

  const count = data?.length ?? 0;
  const hasHelped = data?.some((h) => h.user_id === user?.id) ?? false;

  const handleToggle = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      if (hasHelped) {
        await supabase.from("report_helpers").delete().eq("report_id", reportId).eq("user_id", user.id);
        toast.success("Se eliminó tu ayuda");
      } else {
        await supabase.from("report_helpers").insert({ report_id: reportId, user_id: user.id });
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

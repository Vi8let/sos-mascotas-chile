import { useState } from "react";
import { reportService } from "@/services/reportService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PartyPopper, Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MarkFoundButtonProps {
  reportId: string;
  isResolved: boolean;
}

export function MarkFoundButton({ reportId, isResolved }: MarkFoundButtonProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleMark = async () => {
    setLoading(true);
    try {
      // Reemplaza supabase.update por nuestro servicio
      const response = await reportService.markAsFound(reportId);
      if (!response.success) throw new Error("Fallo en el servicio");

      toast.success("🎉 ¡Mascota marcada como encontrada!");
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      queryClient.invalidateQueries({ queryKey: ["all-reports"] });
      queryClient.invalidateQueries({ queryKey: ["recent-reports"] });
    } catch {
      toast.error("Error al actualizar el reporte");
    } finally {
      setLoading(false);
    }
  };

  if (isResolved) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/10 border border-secondary/20">
        <PartyPopper className="h-5 w-5 text-secondary" />
        <span className="text-sm font-semibold text-secondary">🎉 Esta mascota ya fue encontrada</span>
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 rounded-full font-semibold border-secondary/30 text-secondary hover:bg-secondary/10">
          <PartyPopper className="h-4 w-4" /> Marcar como encontrada
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 ¿Mascota encontrada?</AlertDialogTitle>
          <AlertDialogDescription>
            Esto marcará el reporte como resuelto. El marcador cambiará en el mapa y otros usuarios podrán ver que la mascota fue encontrada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleMark} disabled={loading} className="rounded-full gap-2 bg-secondary hover:bg-secondary/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PartyPopper className="h-4 w-4" />}
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

const REASONS = [
  { value: "spam", label: "🚫 Spam", desc: "Contenido no relacionado" },
  { value: "incorrect", label: "❌ Información incorrecta", desc: "Datos falsos o engañosos" },
  { value: "inappropriate", label: "⚠️ Contenido inapropiado", desc: "Lenguaje o imágenes ofensivas" },
  { value: "duplicate", label: "📋 Duplicado", desc: "Ya existe un reporte igual" },
] as const;

interface ReportFlagDialogProps {
  reportId: string;
}

export function ReportFlagDialog({ reportId }: ReportFlagDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!user) { navigate("/login"); return; }
    if (!reason) { toast.error("Selecciona un motivo"); return; }
    setSending(true);
    try {
      const { error } = await supabase.from("report_flags").insert({
        report_id: reportId,
        user_id: user.id,
        reason,
        details: details.trim() || null,
      });
      if (error) {
        if (error.code === "23505") {
          toast.info("Ya has reportado este reporte");
        } else throw error;
      } else {
        toast.success("Reporte enviado a moderación");
      }
      setOpen(false);
    } catch {
      toast.error("Error al enviar el reporte");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-xs text-muted-foreground" onClick={() => {
        if (!user) { navigate("/login"); return; }
        setOpen(true);
      }}>
        <Flag className="h-3.5 w-3.5" /> Reportar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-destructive" /> Reportar publicación
            </DialogTitle>
            <DialogDescription>¿Por qué deseas reportar este reporte?</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            {REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                  reason === r.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:bg-muted/50"
                }`}
              >
                <span className="font-semibold text-foreground">{r.label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{r.desc}</span>
              </button>
            ))}
          </div>

          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Detalles adicionales (opcional)..."
            rows={2}
            maxLength={500}
            className="rounded-xl resize-none"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={sending || !reason} className="rounded-full gap-2" variant="destructive">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
              Enviar reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

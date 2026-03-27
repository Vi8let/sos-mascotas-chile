import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { findOrCreateConversation } from "@/lib/messaging";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Eye } from "lucide-react";

interface SightingChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  reportOwnerId: string;
}

export function SightingChatDialog({ open, onOpenChange, reportTitle, reportOwnerId }: SightingChatDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    `Hola, creo haber visto a "${reportTitle}" cerca de [indica la ubicación]. ¿Podrías confirmar si es tu mascota?`
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!user || !message.trim()) return;
    setSending(true);
    try {
      const convoId = await findOrCreateConversation(user.id, reportOwnerId);
      await supabase.from("messages").insert({
        conversation_id: convoId,
        sender_id: user.id,
        content: message.trim(),
      });
      toast.success("Mensaje enviado al dueño");
      onOpenChange(false);
      navigate(`/mensajes?c=${convoId}`);
    } catch {
      toast.error("Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Eye className="h-5 w-5 text-primary" />
            He visto esta mascota
          </DialogTitle>
          <DialogDescription>
            Envía un mensaje al dueño con la información del avistamiento.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={2000}
          className="rounded-xl resize-none"
          placeholder="Describe dónde y cuándo viste a la mascota..."
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={sending || !message.trim()} className="rounded-full gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar mensaje
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

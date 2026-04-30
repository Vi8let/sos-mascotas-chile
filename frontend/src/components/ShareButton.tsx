import { Share2, MessageCircle, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  reportId: string;
  title: string;
  description?: string;
}

export function ShareButton({ reportId, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/reporte/${reportId}`;
  const text = `${title}${description ? ` - ${description.slice(0, 80)}` : ""}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("¡Enlace copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full">
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            <MessageCircle className="h-4 w-4 text-green-500" />
            WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-secondary" /> : <Link2 className="h-4 w-4" />}
            {copied ? "¡Copiado!" : "Copiar enlace"}
          </button>
          {typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <Share2 className="h-4 w-4 text-primary" />
              Compartir...
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

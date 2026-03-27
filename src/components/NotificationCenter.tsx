import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, MessageCircle, Eye, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
  id: string;
  type: "message" | "sighting" | "nearby";
  title: string;
  body: string;
  link: string;
  createdAt: string;
  read: boolean;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch unread messages as notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];
      const items: Notification[] = [];

      // Get conversations user is part of
      const { data: parts } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (parts?.length) {
        const convoIds = parts.map((p) => p.conversation_id);

        // Unread messages
        const { data: unread } = await supabase
          .from("messages")
          .select("id, content, sender_id, conversation_id, created_at")
          .in("conversation_id", convoIds)
          .neq("sender_id", user.id)
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(10);

        if (unread?.length) {
          // Get sender profiles
          const senderIds = [...new Set(unread.map((m) => m.sender_id))];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, display_name")
            .in("user_id", senderIds);
          const profileMap = new Map(profiles?.map((p) => [p.user_id, p.display_name]) ?? []);

          for (const msg of unread) {
            items.push({
              id: msg.id,
              type: "message",
              title: `💬 ${profileMap.get(msg.sender_id) ?? "Usuario"}`,
              body: msg.content.length > 60 ? msg.content.slice(0, 60) + "…" : msg.content,
              link: `/mensajes?c=${msg.conversation_id}`,
              createdAt: msg.created_at,
              read: false,
            });
          }
        }
      }

      // Recent sightings on user's reports
      const { data: myReports } = await supabase
        .from("reports")
        .select("id, title")
        .eq("user_id", user.id)
        .eq("type", "lost");

      if (myReports?.length) {
        const reportIds = myReports.map((r) => r.id);
        const reportMap = new Map(myReports.map((r) => [r.id, r.title]));

        // Find sightings near the user's lost reports (same city)
        const { data: sightings } = await supabase
          .from("reports")
          .select("id, title, created_at, city")
          .eq("type", "sighting")
          .eq("is_active", true)
          .neq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (sightings?.length) {
          for (const s of sightings) {
            items.push({
              id: `sighting-${s.id}`,
              type: "sighting",
              title: "👁️ Posible avistamiento",
              body: s.title,
              link: `/reporte/${s.id}`,
              createdAt: s.created_at,
              read: false,
            });
          }
        }
      }

      return items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)).slice(0, 15);
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Realtime subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notification-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as any;
          if (msg.sender_id !== user.id) {
            queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            // Browser push notification
            if (Notification.permission === "granted") {
              new Notification("💬 Nuevo mensaje en SOS Mascotas", {
                body: msg.content?.slice(0, 100),
                icon: "/favicon.ico",
              });
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports", filter: "type=eq.sighting" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
          if (Notification.permission === "granted") {
            new Notification("👁️ Nuevo avistamiento reportado", {
              body: "Alguien ha reportado un avistamiento cerca.",
              icon: "/favicon.ico",
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  // Ask for notification permission on mount
  useEffect(() => {
    if (user && "Notification" in window && Notification.permission === "default") {
      // Delay the prompt slightly so it doesn't feel intrusive
      const timer = setTimeout(() => {
        Notification.requestPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (notif: Notification) => {
    // Mark messages as read
    if (notif.type === "message") {
      supabase.from("messages").update({ is_read: true }).eq("id", notif.id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      });
    }
    navigate(notif.link);
    setOpen(false);
  };

  if (!user) return null;

  const iconMap = {
    message: MessageCircle,
    sighting: Eye,
    nearby: MapPin,
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl"
        onClick={() => setOpen(!open)}
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground min-w-[18px] h-[18px] px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-border/50 bg-card overflow-hidden"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-bold text-sm text-foreground">Notificaciones</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <ScrollArea className="max-h-80">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Sin notificaciones</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = iconMap[notif.type];
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className={cn(
                          "w-full text-left px-4 py-3 border-b border-border/20 hover:bg-muted/40 transition-colors flex gap-3",
                          !notif.read && "bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          notif.type === "message" && "bg-primary/10 text-primary",
                          notif.type === "sighting" && "bg-accent/20 text-accent-foreground",
                          notif.type === "nearby" && "bg-destructive/10 text-destructive",
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{notif.body}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </button>
                    );
                  })
                )}
              </ScrollArea>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs rounded-xl"
                    onClick={() => { navigate("/mensajes"); setOpen(false); }}
                  >
                    Ver todos los mensajes
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, MessageCircle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeConvoId = searchParams.get("c");
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConvos } = useQuery({
    queryKey: ["my-conversations", user?.id],
    queryFn: async () => {
      // MOCK
      return [];
    },
    enabled: !!user,
  });

  // Fetch messages for active conversation
  const { data: messages = [], isLoading: loadingMsgs } = useQuery({
    queryKey: ["messages", activeConvoId],
    queryFn: async () => {
      // MOCK
      return [];
    },
    enabled: !!activeConvoId,
  });

  // Realtime subscription
  useEffect(() => {
    // MOCK
  }, [activeConvoId, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!message.trim() || !activeConvoId || !user) return;
    setSending(true);
    try {
      // MOCK
      await new Promise(res => setTimeout(res, 300));
      setMessage("");
    } finally {
      setSending(false);
    }
  }, [message, activeConvoId, user]);

  const selectConvo = (id: string) => navigate(`/mensajes?c=${id}`);

  if (!user) return null;

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  return (
    <div className="container max-w-5xl py-6 px-2 sm:px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
      </div>

      <div className="border border-border/50 rounded-2xl overflow-hidden flex h-[calc(100vh-13rem)]" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Conversation list */}
        <div className={cn(
          "w-full sm:w-80 border-r border-border/50 flex-shrink-0 flex flex-col bg-card",
          activeConvoId && "hidden sm:flex"
        )}>
          <div className="p-4 border-b border-border/50">
            <h2 className="font-bold text-sm text-foreground">Conversaciones</h2>
          </div>
          <ScrollArea className="flex-1">
            {loadingConvos ? (
              <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-6">
                <MessageCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No tienes conversaciones aún.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Contacta a un reportante desde un reporte.</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectConvo(c.id)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 border-b border-border/30 hover:bg-muted/40 transition-all duration-200",
                    c.id === activeConvoId && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {c.otherName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground truncate">{c.otherName}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className={cn(
          "flex-1 flex flex-col bg-background",
          !activeConvoId && "hidden sm:flex"
        )}>
          {activeConvoId ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-card/50">
                <button onClick={() => navigate("/mensajes")} className="sm:hidden p-1 rounded-lg hover:bg-muted">
                  <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {activeConvo?.otherName?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">{activeConvo?.otherName ?? "Conversación"}</span>
                  <span className="text-[11px] text-muted-foreground">En línea</span>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {loadingMsgs ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">No hay mensajes aún. ¡Envía el primero! 👋</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => {
                      const isMine = m.sender_id === user.id;
                      return (
                        <div key={m.id} className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
                          {!isMine && (
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 mb-1">
                              {activeConvo?.otherName?.[0]?.toUpperCase() ?? "?"}
                            </div>
                          )}
                          <div className={cn(
                            "max-w-[70%] px-4 py-2.5 text-sm leading-relaxed",
                            isMine
                              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm"
                              : "bg-muted text-foreground rounded-2xl rounded-bl-md"
                          )}>
                            <p>{m.content}</p>
                            <p className={cn("text-[10px] mt-1.5 text-right", isMine ? "text-primary-foreground/50" : "text-muted-foreground/60")}>
                              {format(new Date(m.created_at), "HH:mm", { locale: es })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border/50 bg-card/30 flex gap-2">
                <Input
                  placeholder="Escribe un mensaje…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  maxLength={2000}
                  disabled={sending}
                  className="rounded-xl h-11"
                />
                <Button size="icon" className="h-11 w-11 rounded-xl shadow-sm" onClick={handleSend} disabled={sending || !message.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Selecciona una conversación</p>
                <p className="text-xs text-muted-foreground/60 mt-1">O contacta a alguien desde un reporte</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

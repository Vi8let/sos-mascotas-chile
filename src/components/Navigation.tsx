import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Map, AlertTriangle, Eye, Calendar,
  Cat, Stethoscope, User, Menu, X, PawPrint, LogIn, LogOut, LayoutDashboard, MessageCircle, ClipboardList, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { NotificationCenter } from "@/components/NotificationCenter";

const publicNavItems = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/mapa", label: "Mapa", icon: Map },
  { path: "/reportes", label: "Reportes", icon: ClipboardList },
  { path: "/eventos", label: "Eventos", icon: Calendar },
  { path: "/colonias-felinas", label: "Colonias", icon: Cat },
  { path: "/veterinarias", label: "Veterinarias", icon: Stethoscope },
];

const authNavItems = [
  { path: "/reportar-perdido", label: "Reportar", icon: AlertTriangle },
  { path: "/mensajes", label: "Mensajes", icon: MessageCircle },
  { path: "/historial", label: "Historial", icon: History },
  { path: "/dashboard", label: "Panel", icon: LayoutDashboard },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [...publicNavItems, ...(user ? authNavItems : [])];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <PawPrint className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              SOS Mascotas
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <NotificationCenter />
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-2 text-muted-foreground rounded-xl">
                  <LogOut className="mr-1 h-4 w-4" />
                  Salir
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm" className="ml-2 rounded-full px-5 font-semibold shadow-sm">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Ingresar
                </Button>
              </Link>
            )}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass p-4 lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                >
                  <LogIn className="h-5 w-5" />
                  Ingresar
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

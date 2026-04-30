import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Eye, PawPrint, MessageCircle, Map, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { user } = useAuth();

  const actions = [
    { icon: AlertTriangle, label: "Reportar Perdido", desc: "Crea un nuevo reporte", path: "/reportar-perdido", gradient: "from-destructive/10 to-destructive/5", iconColor: "text-destructive" },
    { icon: Eye, label: "Reportar Avistamiento", desc: "Reporta un animal visto", path: "/reportar-avistamiento", gradient: "from-accent/15 to-accent/5", iconColor: "text-accent-foreground" },
    { icon: Map, label: "Mapa Interactivo", desc: "Explora reportes cercanos", path: "/mapa", gradient: "from-primary/10 to-primary/5", iconColor: "text-primary" },
    { icon: MessageCircle, label: "Mensajes", desc: "Tus conversaciones", path: "/mensajes", gradient: "from-secondary/10 to-secondary/5", iconColor: "text-secondary" },
    { icon: PawPrint, label: "Mis Mascotas", desc: "Gestiona tus mascotas", path: "/perfil", gradient: "from-primary/10 to-accent/5", iconColor: "text-primary" },
  ];

  return (
    <div className="container py-10 sm:py-14 max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Usuario</h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          Bienvenido, {user?.email}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div key={action.path} variants={itemVariants}>
              <Link to={action.path}>
                <Card className={`card-hover rounded-2xl border-border/50 bg-gradient-to-br ${action.gradient} h-full`}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card shadow-sm flex-shrink-0">
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{action.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

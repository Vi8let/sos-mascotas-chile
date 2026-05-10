import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PawPrint, AlertTriangle, Map, Heart,
  Shield, Users, Search, FileText, Eye, Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentReports } from "@/components/RecentReports";
import heroPets from "@/assets/hero-pets.png";

const stats = [
  { icon: Shield, label: "Seguro y privado", desc: "Datos protegidos" },
  { icon: Users, label: "Comunidad activa", desc: "Miles de usuarios" },
  { icon: Search, label: "Búsqueda efectiva", desc: "Mapa en tiempo real" },
  { icon: Heart, label: "100% gratuito", desc: "Sin costo alguno" },
];

const steps = [
  {
    icon: FileText,
    emoji: "📝",
    title: "Reporta tu mascota",
    desc: "Publica un reporte con fotos, descripción y ubicación para alertar a la comunidad.",
    color: "from-destructive/10 to-destructive/5",
    iconColor: "text-destructive bg-destructive/10",
  },
  {
    icon: Eye,
    emoji: "👀",
    title: "La comunidad ayuda a buscar",
    desc: "Vecinos y rescatistas ven tu reporte y reportan avistamientos si ven a tu mascota.",
    color: "from-accent/15 to-accent/5",
    iconColor: "text-accent-foreground bg-accent/15",
  },
  {
    icon: Smile,
    emoji: "🐾",
    title: "Reencuéntrate con tu mascota",
    desc: "Recibe alertas, contacta a quien la encontró y tráela de vuelta a casa.",
    color: "from-secondary/10 to-secondary/5",
    iconColor: "text-secondary bg-secondary/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.25rem] xl:text-6xl text-foreground leading-[1.1]">
                Encuentra mascotas perdidas con la ayuda de la comunidad
              </h1>

              <p className="mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed mx-auto lg:mx-0">
                SOS Mascotas conecta dueños, vecinos y rescatistas para ayudar a encontrar animales perdidos en Chile.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="gap-2 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
                  <Link to="/reportar-perdido">
                    <AlertTriangle className="h-5 w-5" />
                    Reportar Mascota Perdida
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 px-8 text-base font-semibold rounded-full">
                  <Link to="/mapa">
                    <Map className="h-5 w-5" />
                    Explorar el Mapa
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-primary/5 blur-2xl" />
                <img
                  src={heroPets}
                  alt="Perros y gatos felices"
                  className="relative w-72 sm:w-80 lg:w-96 xl:w-[26rem] drop-shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <RecentReports />

      {/* Cómo funciona */}
      <section className="container py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">¿Cómo funciona?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tres pasos simples para ayudar a reunir mascotas con sus familias.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.title} variants={itemVariants}>
                <div className={`card-hover rounded-2xl p-6 bg-gradient-to-br ${step.color} border border-border/50 h-full text-center`}>
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Paso {i + 1}</span>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconColor} shadow-sm`}>
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-card border-t">
        <div className="container py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              ¿Perdiste a tu mascota?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              No pierdas tiempo. Crea un reporte ahora y deja que la comunidad te ayude a encontrarla.
            </p>
            <Button asChild size="lg" className="gap-2 px-10 text-base font-semibold rounded-full shadow-lg">
              <Link to="/registro">
                <PawPrint className="h-5 w-5" />
                Crear cuenta gratis
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

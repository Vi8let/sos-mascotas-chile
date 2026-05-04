import { Outlet, Link } from "react-router-dom";
import { Navigation } from "./Navigation";
// import { NearbyPetAlert } from "./NearbyPetAlert";
import { PawPrint, Heart } from "lucide-react";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col paw-bg">
      <Navigation />
      {/* <NearbyPetAlert /> */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/80 backdrop-blur-sm">
        <div className="container py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <PawPrint className="h-4 w-4" />
                </div>
                <span className="font-display font-bold text-lg text-foreground">SOS Mascotas</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plataforma comunitaria para el rescate y bienestar animal en Chile. 🐾
              </p>
            </div>

            {/* About */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Sobre el proyecto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground transition-colors">Inicio</Link></li>
                <li><Link to="/mapa" className="hover:text-foreground transition-colors">Mapa interactivo</Link></li>
                <li><Link to="/eventos" className="hover:text-foreground transition-colors">Eventos</Link></li>
                <li><Link to="/colonias-felinas" className="hover:text-foreground transition-colors">Colonias felinas</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/reportar-perdido" className="hover:text-foreground transition-colors">Reportar mascota</Link></li>
                <li><Link to="/veterinarias" className="hover:text-foreground transition-colors">Veterinarias</Link></li>
                <li><Link to="/registro" className="hover:text-foreground transition-colors">Crear cuenta</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📧 contacto@sosmascotas.cl</li>
                <li>📍 Santiago, Chile</li>
                <li className="flex gap-3 pt-1">
                  <a href="#" className="hover:text-foreground transition-colors" aria-label="Instagram">
                    📸 Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors" aria-label="Facebook">
                    📘 Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SOS Mascotas Chile — Todos los derechos reservados
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Hecho con <Heart className="h-3 w-3 text-destructive fill-destructive" /> para las mascotas de Chile
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

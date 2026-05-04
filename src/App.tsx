import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ReportSighting from "./pages/ReportSighting";
import PetProfile from "./pages/PetProfile";
import UserProfile from "./pages/UserProfile";
import Events from "./pages/Events";
import CatColonies from "./pages/CatColonies";
import VetClinics from "./pages/VetClinics";
import ReportDetail from "./pages/ReportDetail";
import ReportHistory from "./pages/ReportHistory";
import NotFound from "./pages/NotFound";

const Messages = lazy(() => import("./pages/Messages"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/mapa" element={<MapPage />} />
              <Route path="/reportes" element={<Reports />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/eventos" element={<Events />} />
              <Route path="/colonias-felinas" element={<CatColonies />} />
              <Route path="/veterinarias" element={<VetClinics />} />
              <Route path="/mascota/:id" element={<PetProfile />} />
              <Route path="/reporte/:id" element={<ReportDetail />} />
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/reportar-perdido" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
              <Route path="/reportar-avistamiento" element={<ProtectedRoute><ReportSighting /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/mensajes" element={<ProtectedRoute><Suspense fallback={<div className="p-8 text-center">Cargando mensajes...</div>}><Messages /></Suspense></ProtectedRoute>} />
              <Route path="/historial" element={<ProtectedRoute><ReportHistory /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

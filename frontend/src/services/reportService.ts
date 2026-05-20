// src/services/reportService.ts

const API_BASE_URL = "/api/reports";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const toTipoReporte = () => {
  return "ANIMAL_PERDIDO";
};

const normalizeCreatePayload = (data: any) => ({
  titulo: data.petName ? `Reporte de ${data.petName}` : "Reporte de mascota",
  tipo: toTipoReporte(),
  descripcion: data.description || "Sin descripcion",
  ubicacion: data.location
    ? `${data.location.lat}, ${data.location.lng}`
    : [data.city, data.address].filter(Boolean).join(", ") || "Sin ubicacion",
  imagenUrl: null,
  contacto: data.contactPhone || data.phone || "Sin contacto",
});

const toFrontendReport = (report: any) => ({
  id: String(report.id),
  type: report.estado === "ENCONTRADO" ? "found" : report.tipo === "ANIMAL_PERDIDO" ? "sighting" : "lost",
  title: report.titulo,
  city: report.ubicacion || "Sin ubicacion",
  created_at: report.creadoEn || new Date().toISOString(),
  is_active: report.estado === "ACTIVO",
  resolved_at: report.estado === "ACTIVO" ? null : report.creadoEn,
  photos: report.imagenUrl ? [report.imagenUrl] : [],
  pets: {
    name: report.titulo,
    species: report.tipo === "ANIMAL_PERDIDO" ? "dog" : "other",
    photos: report.imagenUrl ? [report.imagenUrl] : [],
  },
});

export const reportService = {
  createReport: async (data: any) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(normalizeCreatePayload(data)),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al crear el reporte");
    }

    const report = await response.json();
    return { success: true, reportId: String(report.id), photoUrl: report.imagenUrl ?? null };
  },

  markAsFound: async (reportId: string) => {
    const response = await fetch(`${API_BASE_URL}/${reportId}/estado?estado=ENCONTRADO`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al marcar como encontrado");
    }

    return { success: true };
  },

  markAsHelped: async (_reportId: string, _hasHelped: boolean) => {
    return { success: true };
  },

  getHelpers: async (_reportId: string) => {
    return [];
  },

  createSighting: async (data: any) => {
    return reportService.createReport({ ...data, petName: "Avistamiento", status: "sighting" });
  },

  getUserReports: async (_userId?: string) => {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al obtener reportes");
    }

    const reports = await response.json();
    return reports.map(toFrontendReport);
  },
};

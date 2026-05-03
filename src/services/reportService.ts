// src/services/reportService.ts

/**
 * SERVICIO TEMPORAL (MOCK)
 * Este servicio reemplazará supabase.from(...).insert(...) y el storage
 * Actualmente simula la petición POST a un backend propio preparado para usar JWT.
 */

export const reportService = {
  createReport: async (data: any) => {
    // Preparar headers con el token JWT si existe en localStorage
    const token = localStorage.getItem("jwt_token");
    const headers: Record<string, string> = {
      // En una implementación real, si mandas archivos (FormData), 
      // no seteas Content-Type, dejas que el browser lo asigne (multipart/form-data con boundary).
      "Content-Type": "application/json"
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Simular petición POST a /api/reports
    console.log("MOCK: POST /api/reports");
    console.log("Headers enviados:", headers);
    console.log("Datos enviados al backend:", data);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular tiempo de subida y guardado

    // Simular que si hay un archivo en "data.photo", el servidor nos devuelve una URL guardada (ej S3)
    const mockPhotoUrl = data.photo ? "https://placehold.co/600x400?text=Mock+Pet+Photo" : null;

    // Retornar la respuesta simulada
    return {
      success: true,
      reportId: "mock-report-" + Date.now(),
      photoUrl: mockPhotoUrl
    };
  },

  markAsFound: async (reportId: string) => {
    const token = localStorage.getItem("jwt_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    console.log(`MOCK: POST /api/reports/${reportId}/found`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  markAsHelped: async (reportId: string, hasHelped: boolean) => {
    const token = localStorage.getItem("jwt_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    console.log(`MOCK: ${hasHelped ? 'DELETE' : 'POST'} /api/reports/${reportId}/help`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  getHelpers: async (reportId: string) => {
    console.log(`MOCK: GET /api/reports/${reportId}/helpers`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return []; // Retorna lista vacía simulada
  },

  createSighting: async (data: any) => {
    const token = localStorage.getItem("jwt_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    console.log("MOCK: POST /api/reports/sighting");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, reportId: "mock-sighting-" + Date.now() };
  },

  getUserReports: async (userId?: string) => {
    const token = localStorage.getItem("jwt_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    console.log("MOCK: GET /api/reports/me");
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Array.from({ length: 3 }).map((_, i) => ({
      id: `history-mock-${i}`,
      type: "lost",
      title: `Mi Reporte Histórico ${i + 1}`,
      city: "Santiago",
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      is_active: i === 0,
      resolved_at: i === 0 ? null : new Date().toISOString(),
      pets: {
        name: `Mi Mascota ${i + 1}`,
        species: "dog",
        photos: []
      }
    }));
  }
};

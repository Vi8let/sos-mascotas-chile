// src/services/petService.ts

/**
 * SERVICIO TEMPORAL (MOCK)
 * Este servicio reemplaza las consultas directas de lectura a Supabase.
 * Está preparado para conectarse al futuro backend (Spring Boot).
 */

export const petService = {
  getPets: async () => {
    // Simular petición GET a /api/pets (o /api/reports)
    console.log("MOCK: GET /api/pets");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Datos simulados estructurados como los devolvería la API (DTO)
    return [
      {
        id: "mock-report-1",
        type: "lost",
        title: "Perrito perdido en el parque",
        description: "Se perdió cerca de los juegos. Es muy asustadizo.",
        city: "Santiago",
        address: "Parque O'Higgins",
        latitude: -33.46,
        longitude: -70.66,
        created_at: new Date().toISOString(),
        is_active: true,
        resolved_at: null,
        pets: {
          name: "Max",
          species: "dog",
          photos: ["https://placehold.co/400x400?text=Max"]
        }
      },
      {
        id: "mock-report-2",
        type: "sighting",
        title: "Gato visto en el techo",
        description: "Gato negro con collar rojo.",
        city: "Providencia",
        address: "Av. Los Leones",
        latitude: -33.43,
        longitude: -70.60,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_active: true,
        resolved_at: null,
        pets: {
          name: "Michi",
          species: "cat",
          photos: ["https://placehold.co/400x400?text=Gato"]
        }
      },
      {
        id: "mock-report-3",
        type: "found",
        title: "Encontré este perrito",
        description: "Estaba vagando en la plaza con hambre.",
        city: "Ñuñoa",
        address: "Plaza Ñuñoa",
        latitude: -33.45,
        longitude: -70.59,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        is_active: true,
        resolved_at: null,
        pets: {
          name: "Desconocido",
          species: "dog",
          photos: null
        }
      }
    ];
  },

  getPetById: async (id: string) => {
    console.log(`MOCK: GET /api/pets/${id}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Retornar un mock individual simulando la respuesta del backend
    return {
      id,
      user_id: "mock-owner-123",
      pet_id: "mock-pet-123",
      type: "lost",
      title: "Reporte de Mascota simulado",
      description: "Este es un reporte simulado obtenido por ID. Desacoplado de Supabase.",
      city: "Santiago",
      region: "Región Metropolitana",
      address: "Centro",
      latitude: -33.45,
      longitude: -70.65,
      contact_phone: "+56 9 1234 5678",
      created_at: new Date().toISOString(),
      is_active: true,
      resolved_at: null,
      pets: {
        id: "mock-pet-123",
        name: "Mock Pet",
        species: "dog",
        breed: "Mestizo",
        color: "Café con blanco",
        size: "Mediano",
        photos: []
      }
    };
  },

  getRecentReports: async () => {
    console.log("MOCK: GET /api/pets/recent");
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Devolvemos 6 reportes simulados usando la misma estructura anidada de pets
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `recent-mock-${i}`,
      type: i % 3 === 0 ? "lost" : i % 3 === 1 ? "sighting" : "found",
      title: `Reporte Reciente ${i + 1}`,
      description: "Este es un reporte reciente simulado para el home.",
      city: "Santiago",
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      is_active: true,
      pets: {
        name: `Mascota ${i + 1}`,
        species: i % 2 === 0 ? "dog" : "cat",
        photos: []
      }
    }));
  }
};

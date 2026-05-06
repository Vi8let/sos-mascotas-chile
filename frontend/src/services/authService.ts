// src/services/authService.ts

/**
 * SERVICIO TEMPORAL (MOCK)
 * Este servicio es parte de la migración progresiva desde Supabase a un backend propio (Spring Boot + JWT).
 * Actualmente simula las peticiones HTTP y será conectado a la API real posteriormente.
 */

export const authService = {
  login: async (email: string, password: string) => {
    // Simular POST a /api/auth/login
    console.log("MOCK: fetch /api/auth/login", { email, password });
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simular respuesta con token
    const mockToken = "mock_jwt_token_" + Date.now();
    return { token: mockToken, user: { id: "mock-uuid-1234-5678", email } };
  },

  register: async (email: string, password: string, name?: string, phone?: string) => {
    // Simular POST a /api/auth/register
    console.log("MOCK: fetch /api/auth/register", { email, password, name, phone });
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return { success: true };
  },

  logout: async () => {
    // Simular POST a /api/auth/logout
    console.log("MOCK: fetch /api/auth/logout");
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true };
  }
};

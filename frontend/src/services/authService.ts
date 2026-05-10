// frontend/src/services/authService.ts

/**
 * SERVICIO DE AUTENTICACIÓN REAL (Conexión con Spring Boot)
 * Este servicio conecta el frontend con el backend de Guerben en http://localhost:8080
 */

const API_BASE_URL = "http://localhost:8080/api/auth";

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    return await response.json();
  },

  register: async (email: string, password: string, nombre: string, telefono: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre, telefono })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    return await response.json();
  },

  logout: async () => {
    // Para JWT stateless, el logout suele ser limpiar el token localmente.
    // Si el backend tuviera una lista negra de tokens, se llamaría aquí.
    return { success: true };
  }
};

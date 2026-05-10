// src/services/userService.ts

/**
 * SERVICIO TEMPORAL (MOCK)
 * Maneja el perfil y preferencias del usuario.
 */

export const userService = {
  getUserProfile: async (userId: string) => {
    console.log(`MOCK: GET /api/users/${userId}/profile`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      user_id: userId,
      display_name: "Usuario Demo",
      avatar_url: null,
      reputation_points: 150,
      phone: "+56912345678",
      created_at: new Date().toISOString()
    };
  },

  updateUserProfile: async (userId: string, data: any) => {
    const token = localStorage.getItem("jwt_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    console.log(`MOCK: PUT /api/users/${userId}/profile`, data);
    await new Promise((resolve) => setTimeout(resolve, 800));

    return { success: true };
  }
};

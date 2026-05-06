import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// TODO: Estos tipos son temporales para simular la estructura JWT.
// Al migrar a Spring Boot, se recomienda usar los DTOs que provengan de tu API.
export interface User {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // La firma mantiene compatibilidad hacia atrás. Se agrega name y phone opcionales.
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al inicializar la app, verificamos si hay una sesión guardada.
    const checkSession = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        // En producción, se debería hacer un GET /api/auth/me usando el token
        // o leerlo desde la cookie HttpOnly sin consultar a localStorage.
        
        // Simulación: restauramos el usuario
        const mockUser = {
          id: "mock-uuid-1234-5678",
          email: "usuario@ejemplo.com",
        };
        setUser(mockUser);
        setSession({ access_token: token });
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    try {
      // Simular petición: await fetch("/api/auth/register", { method: 'POST', body: ... })
      console.log("Simulando POST /api/auth/register", { email, password, name, phone });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simula latencia
      
      // La regla pide que signUp no inicie sesión automáticamente.
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simular petición: await fetch("/api/auth/login", { method: 'POST', body: ... })
      console.log("Simulando POST /api/auth/login", { email, password });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simula latencia
      
      // Simulación de respuesta del backend con JWT
      const mockToken = "mock_jwt_token_" + Date.now();
      const mockUser = {
        id: "mock-uuid-1234-5678",
        email: email,
      };

      // NOTA TEMPORAL: Para desarrollo se guarda el JWT en localStorage.
      // En PRODUCCIÓN, es fuertemente recomendado manejar los JWT mediante cookies HttpOnly 
      // configuradas directamente por el servidor (Spring Boot) por seguridad.
      localStorage.setItem("jwt_token", mockToken);
      
      setSession({ access_token: mockToken });
      setUser(mockUser);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    // Simular petición a backend: await fetch("/api/auth/logout", { method: 'POST' })
    localStorage.removeItem("jwt_token");
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

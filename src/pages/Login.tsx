import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, LogIn } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error("Error al iniciar sesión", { description: error.message });
    } else {
      toast.success("¡Bienvenido de vuelta!");
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-10 px-4 gradient-hero">
      <Card className="w-full max-w-md rounded-3xl border-border/50" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <PawPrint className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu cuenta de SOS Mascotas</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-8">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl h-11" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-8 pb-8">
            <Button type="submit" className="w-full rounded-full h-11 font-semibold shadow-md" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="font-semibold text-primary hover:underline">Regístrate</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

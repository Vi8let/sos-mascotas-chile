import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { reportService } from "@/services/reportService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LocationPicker } from "@/components/map/LocationPicker";
import { Eye, Loader2 } from "lucide-react";
// Omitimos la importación de Database si no tenemos Supabase, pero mantendremos el type estático.
type PetSpecies = "dog" | "cat" | "bird" | "rabbit" | "hamster" | "turtle" | "fish" | "other";

const speciesOptions: { value: PetSpecies; label: string }[] = [
  { value: "dog", label: "Perro" },
  { value: "cat", label: "Gato" },
  { value: "bird", label: "Ave" },
  { value: "rabbit", label: "Conejo" },
  { value: "hamster", label: "Hámster" },
  { value: "turtle", label: "Tortuga" },
  { value: "fish", label: "Pez" },
  { value: "other", label: "Otro" },
];

export default function ReportSighting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    species: "" as PetSpecies | "",
    description: "",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!location) {
      toast.error("Selecciona una ubicación en el mapa.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await reportService.createSighting({
        ...form,
        location: location,
        photo: photo
      });
      if (!response.success) throw new Error("Fallo en servicio mock");

      await queryClient.invalidateQueries({ queryKey: ["map-reports"] });
      toast.success("¡Avistamiento reportado con éxito!");
      navigate("/mapa");
    } catch (err: any) {
      toast.error(err.message || "Error al crear el reporte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Eye className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle>Reportar Avistamiento</CardTitle>
              <CardDescription>¿Viste una mascota que podría estar perdida? Ayúdanos a encontrarla.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Especie (opcional)</Label>
              <Select value={form.species} onValueChange={(v) => handleChange("species", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} maxLength={1000} rows={3} placeholder="Describe el animal, su estado, comportamiento, etc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Foto del avistamiento</Label>
              <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
            </div>

            <div className="space-y-2">
              <Label>Ubicación *</Label>
              <LocationPicker value={location} onChange={setLocation} />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando…</> : "Reportar Avistamiento"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

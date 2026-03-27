import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Loader2, Upload, PawPrint } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type PetSpecies = Database["public"]["Enums"]["pet_species"];

const speciesOptions: { value: PetSpecies; label: string; emoji: string }[] = [
  { value: "dog", label: "Perro", emoji: "🐶" },
  { value: "cat", label: "Gato", emoji: "🐱" },
  { value: "bird", label: "Ave", emoji: "🐦" },
  { value: "rabbit", label: "Conejo", emoji: "🐰" },
  { value: "hamster", label: "Hámster", emoji: "🐹" },
  { value: "turtle", label: "Tortuga", emoji: "🐢" },
  { value: "fish", label: "Pez", emoji: "🐟" },
  { value: "other", label: "Otro", emoji: "🐾" },
];

export default function ReportLost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    petName: "",
    species: "" as PetSpecies | "",
    breed: "",
    color: "",
    description: "",
    dateLost: "",
    city: "",
    address: "",
    phone: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.petName.trim() || !form.species) {
      toast.error("Completa los campos obligatorios: nombre y especie.");
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (photo) {
        const ext = photo.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("pet-photos")
          .upload(path, photo);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("pet-photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      // Default coordinates for Santiago if none provided
      const lat = -33.45;
      const lng = -70.65;
      const city = form.city.trim() || "Sin especificar";

      const { data: pet, error: petError } = await supabase
        .from("pets")
        .insert({
          user_id: user.id,
          name: form.petName.trim(),
          species: form.species as PetSpecies,
          breed: form.breed.trim() || null,
          color: form.color.trim() || null,
          description: form.description.trim() || null,
          photos: photoUrl ? [photoUrl] : [],
          status: "lost",
          lost_date: form.dateLost || null,
          latitude: lat,
          longitude: lng,
          city,
          region: "Sin especificar",
        })
        .select("id")
        .single();
      if (petError) throw petError;

      const { error: reportError } = await supabase.from("reports").insert({
        user_id: user.id,
        pet_id: pet.id,
        type: "lost",
        title: `Mascota perdida: ${form.petName.trim()}`,
        description: form.description.trim() || null,
        latitude: lat,
        longitude: lng,
        photos: photoUrl ? [photoUrl] : [],
        city,
        region: "Sin especificar",
        address: form.address.trim() || null,
        contact_phone: form.phone.trim() || null,
      });
      if (reportError) throw reportError;

      await queryClient.invalidateQueries({ queryKey: ["recent-reports"] });
      toast.success("¡Reporte publicado con éxito! 🐾");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Error al crear el reporte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="rounded-2xl border-border/50 overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader className="bg-gradient-to-r from-destructive/5 to-destructive/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-xl">Reportar Mascota Perdida</CardTitle>
                <CardDescription>Completa el formulario para alertar a la comunidad.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Foto de la mascota</Label>
                <div className="relative">
                  {photoPreview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Haz clic para subir una foto</span>
                      <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG (máx 5MB)</span>
                    </label>
                  )}
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petName">Nombre de la mascota *</Label>
                  <Input
                    id="petName"
                    value={form.petName}
                    onChange={(e) => handleChange("petName", e.target.value)}
                    maxLength={100}
                    placeholder="Ej: Max, Luna..."
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Especie *</Label>
                  <Select value={form.species} onValueChange={(v) => handleChange("species", v)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccionar especie" />
                    </SelectTrigger>
                    <SelectContent>
                      {speciesOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.emoji} {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Raza</Label>
                  <Input id="breed" value={form.breed} onChange={(e) => handleChange("breed", e.target.value)} maxLength={100} placeholder="Ej: Labrador, Siamés..." className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" value={form.color} onChange={(e) => handleChange("color", e.target.value)} maxLength={50} placeholder="Ej: Café, blanco..." className="rounded-xl" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Señas particulares, última vez que fue visto, comportamiento..."
                  className="rounded-xl"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad o comuna</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    maxLength={100}
                    placeholder="Ej: Santiago, Providencia..."
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección o sector</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    maxLength={200}
                    placeholder="Ej: Av. Providencia 1234"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Contact & date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de contacto</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    maxLength={20}
                    placeholder="+56 9 1234 5678"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateLost">Fecha de pérdida</Label>
                  <Input
                    id="dateLost"
                    type="date"
                    value={form.dateLost}
                    onChange={(e) => handleChange("dateLost", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 rounded-full font-semibold shadow-lg text-base"
                disabled={submitting}
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Publicando…</>
                ) : (
                  <><PawPrint className="h-5 w-5" /> Publicar reporte</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

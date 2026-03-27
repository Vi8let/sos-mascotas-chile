import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MapReportFormProps {
  lat: number;
  lng: number;
  onClose: () => void;
  onSubmitted: () => void;
}

export function MapReportForm({ lat, lng, onClose, onSubmitted }: MapReportFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    petName: "",
    species: "dog" as "dog" | "cat",
    status: "lost" as "lost" | "sighting",
    description: "",
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

    if (!user) {
      toast.error("Debes iniciar sesión para reportar.");
      navigate("/login");
      return;
    }

    if (!form.petName.trim()) {
      toast.error("Ingresa el nombre de la mascota.");
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (photo) {
        const ext = photo.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("pet-photos").upload(path, photo);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("pet-photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      // Create pet
      const { data: pet, error: petError } = await supabase
        .from("pets")
        .insert({
          user_id: user.id,
          name: form.petName.trim(),
          species: form.species,
          description: form.description.trim() || null,
          photos: photoUrl ? [photoUrl] : [],
          status: form.status === "lost" ? "lost" : "safe",
          lost_date: form.status === "lost" ? new Date().toISOString() : null,
          latitude: lat,
          longitude: lng,
          city: "Desde mapa",
          region: "Sin especificar",
        })
        .select("id")
        .single();
      if (petError) throw petError;

      // Create report
      const { error: reportError } = await supabase.from("reports").insert({
        user_id: user.id,
        pet_id: pet.id,
        type: form.status === "lost" ? "lost" : "sighting",
        title: `${form.species === "dog" ? "Perro" : "Gato"} ${form.status === "lost" ? "perdido" : "avistado"}: ${form.petName.trim()}`,
        description: form.description.trim() || null,
        latitude: lat,
        longitude: lng,
        photos: photoUrl ? [photoUrl] : [],
        city: "Desde mapa",
        region: "Sin especificar",
        contact_phone: form.phone.trim() || null,
      });
      if (reportError) throw reportError;

      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Error al crear el reporte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute top-0 right-0 z-[1001] w-full max-w-sm h-full overflow-y-auto bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
        <h3 className="font-display font-bold text-base">📌 Nuevo Reporte</h3>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
          📍 Coordenadas: {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>

        {/* Photo */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Foto</Label>
          {photoPreview ? (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 text-xs">✕</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Subir foto</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Nombre de la mascota *</Label>
          <Input value={form.petName} onChange={(e) => handleChange("petName", e.target.value)} placeholder="Ej: Max, Luna..." className="rounded-xl h-9 text-sm" required />
        </div>

        {/* Species & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tipo</Label>
            <Select value={form.species} onValueChange={(v) => handleChange("species", v)}>
              <SelectTrigger className="rounded-xl h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">🐶 Perro</SelectItem>
                <SelectItem value="cat">🐱 Gato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Estado</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger className="rounded-xl h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lost">🚨 Perdido</SelectItem>
                <SelectItem value="sighting">👁️ Avistado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Descripción</Label>
          <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={2} placeholder="Señas particulares..." className="rounded-xl text-sm" />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Teléfono de contacto</Label>
          <Input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+56 9 1234 5678" className="rounded-xl h-9 text-sm" />
        </div>

        <Button type="submit" className="w-full rounded-full font-semibold" disabled={submitting}>
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Publicando…</> : "📌 Publicar reporte"}
        </Button>
      </form>
    </div>
  );
}

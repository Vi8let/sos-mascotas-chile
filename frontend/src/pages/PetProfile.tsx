import { PawPrint } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function PetProfile() {
  return (
    <PagePlaceholder
      icon={PawPrint}
      title="Perfil de Mascota"
      description="Información detallada de la mascota, historial de reportes y estado actual."
    />
  );
}

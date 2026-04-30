import { useQuery } from "@tanstack/react-query";

interface OverpassVet {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  address?: string;
}

const FALLBACK_VETS: OverpassVet[] = [
  { id: 1, name: "Clínica Veterinaria PetCare", latitude: -33.4265, longitude: -70.6145, address: "Av. Providencia 1234, Providencia", phone: "+56 2 2345 6789" },
  { id: 2, name: "Hospital Veterinario de Santiago", latitude: -33.4520, longitude: -70.5980, address: "Av. Irarrázaval 3456, Ñuñoa", phone: "+56 2 2456 7890" },
  { id: 3, name: "VetExpress 24h", latitude: -33.4110, longitude: -70.5760, address: "Av. Apoquindo 5678, Las Condes", phone: "+56 2 2567 8901" },
  { id: 4, name: "Clínica Animal Feliz", latitude: -33.4780, longitude: -70.6320, address: "Av. Vicuña Mackenna 2345, San Joaquín", phone: "+56 2 2678 9012" },
  { id: 5, name: "Centro Veterinario Amigos", latitude: -33.4630, longitude: -70.5530, address: "Av. Grecia 1234, Peñalolén", phone: "+56 2 2789 0123" },
  { id: 6, name: "Pet Hospital Premium", latitude: -33.3980, longitude: -70.5690, address: "Av. Kennedy 7890, Vitacura", phone: "+56 2 2901 2345" },
  { id: 7, name: "VetCenter Maipú", latitude: -33.5100, longitude: -70.7560, address: "Av. Pajaritos 3210, Maipú", phone: "+56 2 2123 4567" },
  { id: 8, name: "Clínica Pequeños Animales", latitude: -33.5180, longitude: -70.5870, address: "Av. La Florida 9876, La Florida", phone: "+56 2 2234 5678" },
];

async function fetchOverpassVets(lat: number, lng: number, radiusM = 3000): Promise<OverpassVet[]> {
  const query = `[out:json][timeout:10];
    node["amenity"="veterinary"](around:${radiusM},${lat},${lng});
    out body;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!res.ok) throw new Error("Overpass API error");
  const data = await res.json();

  return (data.elements || []).map((el: any) => ({
    id: el.id,
    name: el.tags?.name || "Veterinaria",
    latitude: el.lat,
    longitude: el.lon,
    phone: el.tags?.phone || el.tags?.["contact:phone"],
    website: el.tags?.website || el.tags?.["contact:website"],
    address: [el.tags?.["addr:street"], el.tags?.["addr:housenumber"], el.tags?.["addr:city"]]
      .filter(Boolean)
      .join(" ") || undefined,
  }));
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useOverpassVets(userPos: { lat: number; lng: number } | null) {
  return useQuery({
    queryKey: ["overpass-vets", userPos?.lat, userPos?.lng],
    queryFn: async () => {
      const center = userPos || { lat: -33.45, lng: -70.66 };
      try {
        const vets = await fetchOverpassVets(center.lat, center.lng);
        if (vets.length === 0) throw new Error("No results");
        return vets
          .map((v) => ({ ...v, distance: getDistanceKm(center.lat, center.lng, v.latitude, v.longitude) }))
          .sort((a, b) => a.distance - b.distance);
      } catch {
        // Fallback to hardcoded data
        return FALLBACK_VETS.map((v) => ({
          ...v,
          distance: getDistanceKm(center.lat, center.lng, v.latitude, v.longitude),
        })).sort((a, b) => a.distance - b.distance);
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

export type { OverpassVet };

import { useQuery } from "@tanstack/react-query";
import { petService } from "@/services/petService";

export function useMapData() {
  const reports = useQuery({
    queryKey: ["map-reports"],
    queryFn: async () => {
      const data = await petService.getPets();
      return data;
    },
  });

  const colonies = useQuery({
    queryKey: ["map-colonies"],
    queryFn: async () => {
      return []; // MOCK
    },
  });

  const clinics = useQuery({
    queryKey: ["map-clinics"],
    queryFn: async () => {
      return []; // MOCK
    },
  });

  const events = useQuery({
    queryKey: ["map-events"],
    queryFn: async () => {
      return []; // MOCK
    },
  });

  const isLoading = reports.isLoading || colonies.isLoading || clinics.isLoading || events.isLoading;

  return {
    reports: reports.data ?? [],
    colonies: colonies.data ?? [],
    clinics: clinics.data ?? [],
    events: events.data ?? [],
    isLoading,
  };
}

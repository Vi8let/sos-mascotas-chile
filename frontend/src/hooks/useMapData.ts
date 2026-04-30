import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMapData() {
  const reports = useQuery({
    queryKey: ["map-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  const colonies = useQuery({
    queryKey: ["map-colonies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cat_colonies").select("*");
      if (error) throw error;
      return data;
    },
  });

  const clinics = useQuery({
    queryKey: ["map-clinics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vet_clinics").select("*");
      if (error) throw error;
      return data;
    },
  });

  const events = useQuery({
    queryKey: ["map-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) throw error;
      return data;
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

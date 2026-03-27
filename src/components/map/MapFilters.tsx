import { cn } from "@/lib/utils";

type FilterKey = "dogs" | "cats" | "sightings" | "vets" | "events" | "colonies";

interface MapFiltersProps {
  filters: Record<FilterKey, boolean>;
  onToggle: (key: FilterKey) => void;
}

const items: { key: FilterKey; emoji: string; label: string }[] = [
  { key: "dogs", emoji: "🐶", label: "Perros perdidos" },
  { key: "cats", emoji: "🐱", label: "Gatos perdidos" },
  { key: "sightings", emoji: "👀", label: "Avistamientos" },
  { key: "vets", emoji: "🏥", label: "Veterinarias" },
  { key: "events", emoji: "📅", label: "Eventos" },
  { key: "colonies", emoji: "🐈", label: "Colonias" },
];

export function MapFilters({ filters, onToggle }: MapFiltersProps) {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onToggle(item.key)}
          className={cn(
            "glass rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5",
            filters[item.key]
              ? "bg-card text-foreground shadow-md"
              : "text-muted-foreground opacity-50 hover:opacity-75"
          )}
        >
          <span>{item.emoji}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

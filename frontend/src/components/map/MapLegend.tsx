import { cn } from "@/lib/utils";

interface LegendItem {
  label: string;
  emoji: string;
  color: string;
  count: number;
  active: boolean;
  onToggle: () => void;
}

interface MapLegendProps {
  items: LegendItem[];
}

const descriptions: Record<string, string> = {
  Perdidos: "Mascotas reportadas como perdidas",
  Encontrados: "Mascotas encontradas",
  Avistamientos: "Animales vistos posiblemente perdidos",
  Colonias: "Colonias de gatos comunitarios",
  Clínicas: "Clínicas veterinarias",
  Eventos: "Eventos de la comunidad animal",
};

export function MapLegend({ items }: MapLegendProps) {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] glass rounded-2xl p-4 max-w-[320px] sm:max-w-[360px]">
      <h4 className="text-[11px] font-bold text-foreground mb-3 uppercase tracking-widest">Filtros y Leyenda</h4>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onToggle}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left",
              item.active
                ? "bg-foreground/[0.06] text-foreground"
                : "text-muted-foreground opacity-35 hover:opacity-60"
            )}
          >
            <span className="text-lg flex-shrink-0 w-7 text-center">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{item.label}</span>
                <span className="text-[10px] font-bold opacity-50 tabular-nums ml-2 bg-foreground/5 px-1.5 py-0.5 rounded-md">{item.count}</span>
              </div>
              <p className="text-[10px] opacity-50 leading-tight truncate mt-0.5">{descriptions[item.label]}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

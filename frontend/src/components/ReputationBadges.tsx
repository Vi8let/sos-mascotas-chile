import { Badge } from "@/components/ui/badge";
import { Shield, HandHeart, Star, Award } from "lucide-react";

interface ReputationBadgesProps {
  reputationPoints: number;
  helperCount?: number;
  className?: string;
}

export function ReputationBadges({ reputationPoints, helperCount = 0, className = "" }: ReputationBadgesProps) {
  const badges: { label: string; icon: React.ElementType; className: string }[] = [];

  if (helperCount >= 1) {
    badges.push({
      label: "Ayudó a encontrar mascotas",
      icon: HandHeart,
      className: "bg-secondary/10 text-secondary border-secondary/20",
    });
  }

  if (reputationPoints >= 50) {
    badges.push({
      label: "Voluntario activo",
      icon: Shield,
      className: "bg-primary/10 text-primary border-primary/20",
    });
  }

  if (reputationPoints >= 100) {
    badges.push({
      label: "Miembro destacado",
      icon: Award,
      className: "bg-accent/20 text-accent-foreground border-accent/20",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <Badge key={b.label} variant="outline" className={`text-[10px] font-semibold gap-1 rounded-full px-2 py-0.5 border ${b.className}`}>
            <Icon className="h-3 w-3" />
            {b.label}
          </Badge>
        );
      })}
    </div>
  );
}

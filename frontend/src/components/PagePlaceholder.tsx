import type { LucideIcon } from "lucide-react";

interface PagePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PagePlaceholder({ icon: Icon, title, description }: PagePlaceholderProps) {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-2xl bg-primary/10 p-5">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
    </div>
  );
}

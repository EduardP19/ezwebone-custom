import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  compact?: boolean;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  compact = false,
}: ServiceCardProps) {
  return (
    <article className="group surface-card p-6 transition duration-300 hover:-translate-y-1 hover:border-[rgba(154,124,255,0.45)] hover:shadow-[0_24px_70px_rgba(154,124,255,0.14)]">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(214,199,255,0.24),rgba(154,124,255,0.1))] text-[color:var(--color-text-accent)]">
        <Icon size={22} />
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
        {title}
      </h3>
      <p
        className={cn(
          "mt-4 text-[color:var(--color-text-secondary)]",
          compact ? "text-sm leading-6" : "text-base leading-7"
        )}
      >
        {description}
      </p>
    </article>
  );
}

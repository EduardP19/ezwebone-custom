import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className, padding = "md" }: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-10",
  };

  return (
    <div
      className={cn(
        "bg-white/85 border border-brand-border/80 rounded-[1.75rem] shadow-[0_18px_50px_rgba(16,24,38,0.06)] overflow-hidden backdrop-blur-sm",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

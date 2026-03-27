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
        "bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

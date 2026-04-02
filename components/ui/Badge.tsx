import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-purple/12 text-brand-purple uppercase tracking-[0.22em]",
        className
      )}
    >
      {children}
    </span>
  );
}

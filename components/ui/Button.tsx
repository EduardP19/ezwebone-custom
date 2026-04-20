import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow-[0_12px_40px_rgba(124,58,237,0.28)] hover:border-[color:var(--color-primary-light)] hover:bg-[color:var(--color-primary-light)] hover:shadow-[0_18px_50px_rgba(124,58,237,0.36)] transition-all",
      secondary:
        "border border-[color:var(--color-border)] bg-[#F5F2ED]/5 text-[color:var(--color-text-primary)] backdrop-blur-xl hover:border-[color:var(--color-primary-light)] hover:bg-[#F5F2ED]/8 transition-all",
      ghost: "border border-transparent text-[color:var(--color-text-primary)] hover:bg-[#F5F2ED]/5",
    };

    const sizes = {
      sm: "px-4 py-2.5 text-sm font-semibold",
      md: "px-6 py-3.5 text-base font-semibold",
      lg: "px-8 py-4 text-lg font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full tracking-[0.01em] transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-dark)]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

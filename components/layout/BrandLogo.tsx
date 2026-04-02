import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  size?: number;
  variant?: "mark" | "wordmark";
}

export function BrandLogo({
  className,
  priority = false,
  size = 64,
  variant = "mark",
}: BrandLogoProps) {
  return (
    <Image
      src={variant === "wordmark" ? "/logo.svg" : "/brand/ez-logo-circle.png"}
      alt="EZWebOne logo"
      width={variant === "wordmark" ? size * 3 : size}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}

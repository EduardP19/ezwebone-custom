import Image from "next/image";
import { BRAND_LOGO_MARK_SRC, BRAND_LOGO_WORDMARK_SRC } from "@/lib/brand";
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
      src={variant === "wordmark" ? BRAND_LOGO_WORDMARK_SRC : BRAND_LOGO_MARK_SRC}
      alt="EZWebOne logo"
      width={variant === "wordmark" ? size * 3 : size}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}

import Image from "next/image";
import { BRAND_LOGO_MARK_SRC } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  priority?: boolean;
  className?: string;
}

/**
 * The graphic mango mark (no animation — see Wordmark for the animated
 * text half of the lockup).
 */
export function BrandMark({ size = 40, priority = false, className }: BrandMarkProps) {
  return (
    <Image
      src={BRAND_LOGO_MARK_SRC}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

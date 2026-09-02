import { BrandMark } from "@/components/layout/BrandMark";
import { Wordmark } from "@/components/layout/Wordmark";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  markSize?: number;
}

/** Full lockup: graphic mango mark + animated text wordmark. */
export function BrandLogo({ className, markSize = 40 }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark size={markSize} />
      <Wordmark className="text-2xl" />
    </span>
  );
}

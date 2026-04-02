import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  business: string;
  quote: string;
  image: string;
}

export function TestimonialCard({ name, business, quote, image }: TestimonialCardProps) {
  return (
    <article className="relative h-full overflow-hidden rounded-[1.6rem] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-8">
      <span className="pointer-events-none absolute right-6 top-2 text-8xl font-semibold text-[rgba(124,58,237,0.12)]">
        &quot;
      </span>

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-1 text-amber-300">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={16} fill="currentColor" />
          ))}
        </div>

        <p className="text-lg italic leading-8 text-[color:var(--color-text-primary)]">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="mt-8 flex items-center gap-4">
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
          />
          <div>
            <p className="font-medium text-[color:var(--color-text-primary)]">{name}</p>
            <p className="text-sm text-[color:var(--color-text-secondary)]">{business}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

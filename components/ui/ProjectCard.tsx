import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  description: string;
  highlights: string[];
  className?: string;
}

export function ProjectCard({
  title,
  category,
  image,
  description,
  highlights,
  className,
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.6rem] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(124,58,237,0.5)] hover:shadow-[0_28px_80px_rgba(124,58,237,0.12)]",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <span className="inline-flex rounded-full border border-white/10 bg-[color:var(--color-bg-elevated)] px-3 py-1 text-xs text-[color:var(--color-text-accent)]">
          {category}
        </span>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--color-text-secondary)]">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/8 bg-[color:var(--color-bg-elevated)] px-3 py-1 text-xs text-[color:var(--color-text-secondary)]"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          href="/portfolio"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-text-accent)] transition hover:text-white"
        >
          View Project
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

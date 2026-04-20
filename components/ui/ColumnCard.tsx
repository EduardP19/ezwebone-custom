"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";

interface ColumnCardProps {
  slug: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  publishedAt: string;
  readTime: number;
  views: number;
}

export function ColumnCard({
  slug,
  title,
  subtitle,
  coverImage,
  publishedAt,
  readTime,
  views,
}: ColumnCardProps) {
  const { locale } = useI18n();

  return (
    <LocalizedLink href={`/columns/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-[#F5F2ED] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(28,42,68,0.14)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={coverImage || "/blog/placeholder.png"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="flex flex-grow flex-col p-5">
          <div className="mb-1 text-sm text-brand-gray">Eduard Proca</div>
          <div className="mb-4 flex items-center gap-2 text-sm text-brand-gray">
            <span>
              {new Date(publishedAt).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{readTime} min read</span>
            <span>·</span>
            <span>{views} views</span>
          </div>

          <h3 className="mb-3 text-4xl font-display font-semibold leading-[1.15] tracking-tight text-brand-black transition-colors group-hover:text-brand-purple">
            {title}
          </h3>

          {subtitle ? (
            <p className="line-clamp-3 text-base leading-relaxed text-brand-gray">{subtitle}</p>
          ) : null}
        </div>
      </motion.div>
    </LocalizedLink>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ArrowUpRight } from "lucide-react";

interface ColumnCardProps {
  slug: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  publishedAt: string;
}

export function ColumnCard({ slug, title, subtitle, coverImage, publishedAt }: ColumnCardProps) {
  const { locale, dictionary } = useI18n();

  return (
    <LocalizedLink href={`/columns/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={coverImage || "/blog/placeholder.png"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex flex-grow flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest leading-none text-brand-gray">
              {new Date(publishedAt).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-border opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowUpRight size={12} className="text-brand-purple" />
            </div>
          </div>

          <h3 className="mb-2 text-lg font-display font-bold leading-tight text-brand-black transition-colors group-hover:text-brand-purple">
            {title}
          </h3>

          {subtitle ? (
            <p className="mb-4 line-clamp-2 text-[13px] leading-snug text-brand-gray">{subtitle}</p>
          ) : null}

          <div className="mt-auto border-t border-brand-border/50 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-black decoration-brand-purple underline-offset-4 group-hover:underline">
              {dictionary.pages.columns.readEntry}
            </span>
          </div>
        </div>
      </motion.div>
    </LocalizedLink>
  );
}

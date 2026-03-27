import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "lucide-react";

interface ColumnCardProps {
  slug: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  publishedAt: string;
}

export function ColumnCard({ slug, title, subtitle, coverImage, publishedAt }: ColumnCardProps) {
  return (
    <Link href={`/columns/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-brand-border transition-all duration-300 hover:shadow-2xl hover:shadow-brand-purple/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={coverImage || "/blog/placeholder.png"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-bold text-brand-gray uppercase tracking-widest leading-none">
              {new Date(publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="w-6 h-6 rounded-full border border-brand-border flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowUpRight size={12} className="text-brand-purple" />
            </div>
          </div>

          <h3 className="text-lg font-display font-bold text-brand-black mb-2 group-hover:text-brand-purple transition-colors leading-tight">
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-brand-gray text-[13px] leading-snug mb-4 line-clamp-2">
              {subtitle}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-brand-border/50">
            <span className="text-[10px] font-bold text-brand-black uppercase tracking-wider group-hover:underline underline-offset-4 decoration-brand-purple">
              Read Entry
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

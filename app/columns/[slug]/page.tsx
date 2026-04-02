"use client";

import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function ColumnDetailPage({ params }: { params: { slug: string } }) {
  const [column, setColumn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColumn() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("columns")
        .select("*")
        .eq("slug", params.slug)
        .single();
      
      if (data) setColumn(data);
      setLoading(false);
    }
    fetchColumn();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="py-40 bg-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-xl font-display text-brand-black/40 animate-pulse">Retrieving column...</p>
        </div>
      </div>
    );
  }

  if (!column) {
    notFound();
  }

  return (
    <div className="bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OpinionNewsArticle",
          "headline": column.title,
          "description": column.subtitle,
          "image": [column.cover_image || "https://ezwebone.co.uk/blog/placeholder.png"],
          "datePublished": column.created_at,
          "author": [{
            "@type": "Person",
            "name": column.author_name || "Eduard",
            "jobTitle": column.author_role || "Founder, EZWebOne",
            "url": "https://ezwebone.co.uk/about"
          }]
        }}
      />

      <div className="relative h-[45vh] min-h-[350px] w-full overflow-hidden">
        <Image 
          src={column.cover_image || "/blog/placeholder.png"} 
          alt={column.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <Link href="/columns" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Columns</span>
              </Link>
              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white mb-6 leading-tight">
                {column.title}
              </h1>
              {column.subtitle && (
                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-medium">
                  {column.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Sidebar / Meta */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-32 space-y-12">
                <div>
                  <h4 className="text-[10px] font-bold text-brand-black uppercase tracking-widest mb-6 px-1 border-l-2 border-brand-purple">Published</h4>
                  <p className="text-sm font-bold text-brand-gray">
                    {new Date(column.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-brand-black uppercase tracking-widest mb-6 px-1 border-l-2 border-brand-purple">Author</h4>
                  <div className="flex items-center gap-4">
                    {column.author_avatar ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-border">
                        <Image src={column.author_avatar} alt={column.author_name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-warm flex items-center justify-center font-bold text-brand-purple">
                        {column.author_name?.[0] || 'E'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-brand-black">{column.author_name || "Eduard"}</p>
                      <p className="text-[10px] text-brand-gray font-medium">{column.author_role || "Founder"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href="/contact">
                   <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest border border-brand-border py-6 hover:bg-brand-black hover:text-white transition-all">
                     Join the conversation
                   </Button>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content area */}
            <div className="flex-1 max-w-2xl">
              <div 
                className="prose prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-black prose-p:text-brand-gray prose-p:leading-relaxed prose-strong:text-brand-black prose-li:text-brand-gray"
                dangerouslySetInnerHTML={{ __html: column.content }}
              />
            </div>
          </div>
        </div>
      </div>

      <FinalCTA variant="glass" />
    </div>
  );
}

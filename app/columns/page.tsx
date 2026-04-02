"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";
import { ColumnCard } from "@/components/ui/ColumnCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";

type Column = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  created_at: string;
};

export default function ColumnsPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColumns() {
      if (!supabase) {
        setColumns([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("columns")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (data) setColumns(data);
      setLoading(false);
    }
    fetchColumns();
  }, []);

  return (
    <div className="bg-[#fafafa]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "EZWebOne Columns",
          "itemListElement": columns.map((col, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://ezwebone.co.uk/columns/${col.slug}`,
            "name": col.title
          }))
        }}
      />
      
      <div className="container mx-auto px-4 py-20 md:px-6">
        <div className="max-w-3xl mb-20">
          <Badge className="mb-4">Columns & Insights</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-black mb-6">
            Expert <span className="text-brand-purple italic">Voices</span>. <br />
            Hard-won insights.
          </h1>
          <p className="text-xl text-brand-gray leading-relaxed">
            A growing collection of deep dives into technology, business growth, and the future of digital products.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-brand-warm animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {columns.map((column) => (
              <ColumnCard
                key={column.id}
                slug={column.slug}
                title={column.title}
                subtitle={column.subtitle}
                coverImage={column.cover_image}
                publishedAt={column.created_at}
              />
            ))}
          </div>
        )}
      </div>

      <FinalCTA variant="black" />
    </div>
  );
}

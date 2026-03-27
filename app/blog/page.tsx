"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4">Blog</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-black mb-6">
            Insights for small business owners.
          </h1>
          <p className="text-xl text-brand-gray leading-relaxed">
            Tips on web design, SEO, automation, and growing your business online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card padding="sm" className="h-full hover:border-brand-purple transition-all group">
                  <div className="aspect-[16/9] bg-brand-warm rounded-lg mb-4 overflow-hidden relative">
                    <Image
                      src={post.cover_image || "/blog/placeholder.png"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest mb-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <h2 className="text-lg font-bold text-brand-black mb-2 group-hover:text-brand-purple transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-brand-gray text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                </Card>
              </Link>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>

      <div className="mt-20">
        <FinalCTA variant="glass" />
      </div>
    </div>
  );
}

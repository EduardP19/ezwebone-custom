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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("slug", params.slug)
        .single();
      
      if (data) setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-xl font-display text-brand-black">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="py-12 bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "image": [post.cover_image || "https://ezwebone.co.uk/blog/placeholder.png"],
          "datePublished": post.created_at,
          "author": [{
            "@type": "Person",
            "name": "Eduard",
            "url": "https://ezwebone.co.uk/about"
          }]
        }}
      />
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors mb-12 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Blog</span>
        </Link>
        
        <article>
          <div className="mb-12">
            <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-4">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-brand-black mb-8 leading-tight">
              {post.title}
            </h1>
            <div className="w-full h-64 bg-brand-warm rounded-3xl mb-12 overflow-hidden relative">
              <Image 
                src={post.cover_image || "/blog/placeholder.png"} 
                alt={post.title} 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-black prose-p:text-brand-gray prose-li:text-brand-gray prose-strong:text-brand-black"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-20 pt-12 border-t border-brand-border text-center">
          <h2 className="text-2xl font-display font-bold text-brand-black mb-6">Ready to see these results for your business?</h2>
          <Button size="lg">Book a Free Call Today</Button>
        </div>
      </div>
    </div>
  );
}

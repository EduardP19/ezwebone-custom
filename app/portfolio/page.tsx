"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { FinalCTA } from "@/components/sections/FinalCTA";

const ALL_PROJECTS = [
  { name: "Say I Do Weddings", industry: "Events", image: "/portfolio/project1.png" },
  { name: "The Memory Corners", industry: "Events", image: "/portfolio/project2.png" },
  { name: "Txengo", industry: "Creative", image: "/portfolio/project3.png" },
  { name: "ProveIt", industry: "Community", image: "/portfolio/project4.png" },
  { name: "Study and Succeed", industry: "Travel", image: "/portfolio/project5.png" },
];

const CATEGORIES = ["All", "Events", "Creative", "Community", "Travel", "Health"];

export default function PortfolioPage() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4">Portfolio</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-black mb-6">
            Our Work
          </h1>
          <p className="text-xl text-brand-gray leading-relaxed">
            Every project is custom-designed for the client's industry, audience, and goals. No templates. No cookie-cutter layouts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="px-6 py-2 rounded-full border border-brand-border text-sm font-medium hover:border-brand-purple hover:text-brand-purple transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PROJECTS.map((project) => (
            <Card key={project.name} padding="sm" className="group">
               <div className="aspect-video bg-brand-warm rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <Badge className="mb-3 bg-brand-warm text-brand-gray">{project.industry}</Badge>
              <h3 className="text-xl font-bold text-brand-black mb-2">{project.name}</h3>
              <p className="text-sm text-brand-gray">Custom web project for {project.industry} sector.</p>
            </Card>
          ))}
        </div>

      </div>

      <FinalCTA variant="black" />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

const PROJECTS = [
  {
    name: "Say I Do Weddings",
    industry: "Wedding Organiser",
    image: "/portfolio/project1.png",
  },
  {
    name: "The Memory Corners",
    industry: "Photo Booth Company",
    image: "/portfolio/project2.png",
  },
  {
    name: "Txengo",
    industry: "Creative Designer Portfolio",
    image: "/portfolio/project3.png",
  },
];

export function Portfolio() {
  return (
    <section className="py-24 bg-white" id="portfolio">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <Badge className="mb-4">Our Work</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-brand-black mb-4">
              Built for real businesses. Designed to convert.
            </h2>
            <p className="text-brand-gray text-lg">
              Here's a selection of recent projects. Every site is custom — no templates, no shortcuts.
            </p>
          </div>
          <Link href="/portfolio">
            <Button variant="secondary">See All Projects</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card padding="sm" className="group cursor-pointer">
                <div className="aspect-[4/3] bg-brand-warm rounded-lg mb-6 overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <Badge className="mb-3 bg-brand-warm text-brand-gray font-medium">{project.industry}</Badge>
                <h3 className="text-xl font-bold text-brand-black group-hover:text-brand-purple transition-colors">
                  {project.name}
                </h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

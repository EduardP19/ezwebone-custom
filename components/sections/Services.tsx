"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Layout, Search, Share2, Target, Zap, Bot, ArrowRight } from "lucide-react";
import Image from "next/image";

const SERVICES = [
  {
    title: "Landing Pages",
    description: "Perfect mini-project for your big campaigns, whether it's cold emails, ads or referrals.",
    icon: Layout,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "SEO Optimization",
    description: "Built-in SEO best practices to help your site rank higher in search results.",
    icon: Search,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Marketing & Integrations",
    description: "Connect your website with automated social posting, pixel tracking, and ad retargeting to grow consistently.",
    icon: Share2,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Leads Generation",
    description: "Boost website traffic and turn it into qualified leads and real opportunities.",
    icon: Target,
    color: "bg-red-50 text-red-600",
  },
  {
    title: "Automations",
    description: "Streamline your business processes by automating repetitive tasks and workflows.",
    icon: Zap,
    color: "bg-green-50 text-green-600",
  },
];

export function Services() {
  return (
    <section className="py-24 bg-[#FDFCFF] relative overflow-hidden" id="services">
      {/* Background Mesh/Grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(124,58,237,0.08),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-brand-purple/10 text-brand-purple border-none px-4 py-1">Our Services</Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-brand-black mb-4">
            Everything your business needs to succeed online.
          </h2>
          <p className="text-brand-gray max-w-2xl mx-auto">
            From concept to launch, we handle every detail of your digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column: Services List */}
          <div className="space-y-12">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                  <service.icon size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black mb-2 flex items-center gap-2 group-hover:text-brand-purple transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-brand-gray leading-relaxed text-sm md:text-base max-w-md">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-6"
            >
              <Link href="/services">
                <Button variant="ghost" className="text-brand-purple font-bold gap-2 group p-0 hover:bg-transparent">
                  View All Services <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Workstation Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
              <Image
                src="/sections/workstation.png"
                alt="Our Workstation"
                width={800}
                height={1000}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/20 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Badge (UI Flavour) */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-brand-warm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-1">AI Reception</p>
                  <p className="text-sm font-bold text-brand-black">Powered by Resevia</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

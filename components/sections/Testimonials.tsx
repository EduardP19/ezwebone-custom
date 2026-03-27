"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "EZWebOne delivered exactly what we needed. Our new site looks professional, loads fast, and we've already had new enquiries through it.",
    author: "UK Small Business Owner",
  },
  {
    quote: "Eduard was easy to work with, fast, and delivered more than we expected. Highly recommend for any small business needing a quality website quickly.",
    author: "UK Small Business Owner",
  },
  {
    quote: "The whole process was smooth from start to finish. We had our site live in 5 days and it's better than we imagined.",
    author: "UK Small Business Owner",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-brand-warm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">What Our Clients Say</Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-brand-black">
            Real results for real businesses.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full italic flex flex-col justify-between">
                <div>
                  <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                  <p className="text-brand-black leading-relaxed mb-8">"{t.quote}"</p>
                </div>
                <p className="not-italic font-bold text-sm text-brand-gray">— {t.author}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Layout, Search, Share2, Target, Zap, Bot, ArrowRight, MousePointer2 } from "lucide-react";

const TYPING_PHRASES = [
  "high-conversion.",
  "fully automated.",
  "built in 5 days.",
];

function TypewriterText() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = TYPING_PHRASES[index % TYPING_PHRASES.length];
      
      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIndex((prev) => prev + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, typingSpeed]);

  return (
    <span className="text-brand-purple min-h-[1em] inline-block">
      {displayText}
      <span className="animate-pulse ml-1">|</span>
    </span>
  );
}

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative bg-mesh pt-20 pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Social Proof */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 mb-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-brand-warm relative overflow-hidden">
                  <Image
                    src={`/clients/client${i}.png`}
                    alt={`Client ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <span className="text-sm font-medium text-brand-black">
                110+ happy clients · 5.0 rating · No contracts
              </span>
            </div>
          </motion.div>

          {/* Headline - Direct & Punchy */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-7xl font-display font-black tracking-tight text-brand-black mb-8 leading-none"
          >
            Digital products, <br />
            <TypewriterText />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-brand-gray mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We build high-performance websites for UK businesses and experts. Delivered in 5 days, with full ownership and no monthly fees.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple-deep text-white border-none shadow-xl px-10">Book a Free Call</Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="secondary" className="hover:bg-brand-warm transition-all">View Our Work</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid opacity-[0.2] pointer-events-none" />
      
      {/* Liquid Glass Blobs - More Vibrant & Large */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -100, 60, 0],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 -left-40 w-[800px] h-[800px] bg-brand-purple/15 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 100, 0],
            y: [0, 120, -80, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 -right-40 w-[700px] h-[700px] bg-brand-blue/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1.5, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-orange/10 rounded-full blur-[200px]"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

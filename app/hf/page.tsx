"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Monitor, Calendar, CreditCard, Mail, Search, Bot,
  Star, ArrowRight, Zap, Target, TrendingUp,
  Clock,
  Menu, X, Users, CheckCircle,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const NEON = '#39FF14';
const HERO_BG =
  'https://images.unsplash.com/photo-1758521958525-eedaa20ffdb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwYXRobGV0ZSUyMHRyYWluaW5nJTIwYWN0aW9ufGVufDF8fHx8MTc3NjY5NDg2N3ww&ixlib=rb-4.1.0&q=80&w=1920';
const AVATAR_FEMALE =
  'https://images.unsplash.com/photo-1758875569110-f47cf6dc49da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBmaXRuZXNzJTIwaW5zdHJ1Y3RvciUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzY2OTQ4NzJ8MA&ixlib=rb-4.1.0&q=80&w=200';
const AVATAR_MALE =
  'https://images.unsplash.com/photo-1633008692793-aafdd155486a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZ3ltJTIwdHJhaW5lciUyMG11c2N1bGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc2Njk0ODc2fDA&ixlib=rb-4.1.0&q=80&w=200';
const AVATAR_OWNER =
  'https://images.unsplash.com/photo-1683889842940-cbdbe08cf5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGd5bSUyMGJ1c2luZXNzJTIwb3duZXIlMjBjb25maWRlbnQlMjBzbWlsZXxlbnwxfHx8fDE3NzY2OTQ4ODR8MA&ixlib=rb-4.1.0&q=80&w=200';

const SG = "'Space Grotesk', sans-serif";

// ─── Typewriter ───────────────────────────────────────────────────────────────
const PHRASES = [
  'More Bookings. More Revenue.',
  'Modern Design. Proven Results.',
  'Your Business. Fully Online.',
  'Better Experience. Faster Growth.',
];

function TypewriterText() {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && displayed === phrase) {
      timer = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && displayed === '') {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
    } else if (!deleting) {
      timer = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 72);
    } else {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 34);
    }
    return () => clearTimeout(timer);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span>
      {displayed}
      <span
        className="animate-pulse"
        style={{ color: NEON, textShadow: `0 0 12px ${NEON}` }}
      >
        |
      </span>
    </span>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const linkClass = `text-sm font-semibold transition-opacity hover:opacity-60 text-black`;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#F5F2ED] shadow-lg`}
      animate={{
        filter: [
          `drop-shadow(0 0 2px ${NEON}44)`,
          `drop-shadow(0 0 25px ${NEON}80)`,
          `drop-shadow(0 0 2px ${NEON}44)`,
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-0 flex items-center justify-between relative h-24 md:h-32">
        {/* Left Side: Hamburger Menu (Global) */}
        <div className="flex-1 flex justify-start">
          <button
            className="p-1 text-black flex items-center gap-2 hover:opacity-60 transition-opacity"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
            <span className="hidden md:block text-xs uppercase tracking-widest font-bold" style={{ fontFamily: SG }}>MENU</span>
          </button>
        </div>

        {/* Center: Logo (Global) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <a href="/hf" className="block hover:opacity-80 transition-opacity">
            <img
              src="/brand/HF_EZ-Navy-Tear.png"
              alt="EZWebOne"
              className="h-28 md:h-44 w-auto block object-contain"
            />
          </a>
        </div>

        <div className="flex-1 flex justify-end">
          <a
            href="https://calendly.com/eduard-ezwebone/20min?UTM_SOURCE=HF_LP&UTM_MEDIUM=LP&UTM_CAMPAIGN=HF"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm text-black transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{ fontFamily: SG, fontWeight: 700, background: NEON, boxShadow: `0 0-18px ${NEON}55` }}
          >
            Audit
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#F5F2ED] border-t border-gray-100 px-6 py-8 flex flex-col gap-6"
            style={{ fontFamily: SG }}
          >
            {[
              ['#services', 'Growth'],
              ['#ecosystem', 'Expertise'],
              ['#why-us', 'Flexibility'],
              ['#how-it-works', 'Process'],
              ['#testimonials', 'Reviews']
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-lg font-bold text-black" onClick={() => setOpen(false)}>{label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pointy Divider */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none translate-y-full">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-8 block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L600 120 L1200 0 Z"
            fill="#F5F2ED"
          />
          {/* Neon line at the point edge */}
          <path
            d="M0 0 L600 120 L1200 0"
            fill="none"
            stroke={NEON}
            strokeWidth="4"
          />
        </svg>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* BG image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.46)' }} />

      {/* Neon bottom edge accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${NEON}, transparent)` }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-[-30px]">
        {/* Combined Badge & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full mb-8 border border-white/20 bg-[#F5F2ED]/10 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: NEON, boxShadow: `0 0 8px ${NEON}` }}
            />
            <span className="text-white text-sm font-semibold" style={{ fontFamily: SG }}>
              Health &amp; Wellness
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={NEON} className="text-neon" style={{ filter: `drop-shadow(0 0 3px ${NEON}60)` }} />
              ))}
            </div>
            <span className="text-white font-bold text-xs" style={{ fontFamily: SG }}>5.0</span>
          </div>
        </motion.div>



        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white mb-6"
          style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.1, minHeight: '1.2em' }}
        >
          <TypewriterText />
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="text-lg md:text-xl text-white/75 mb-10 max-max-2xl mx-auto"
          style={{ fontFamily: SG, fontWeight: 400 }}
        >
          We build digital systems that fill your schedule and grow your wellness business.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://calendly.com/eduard-ezwebone/20min?UTM_SOURCE=HF_LP&UTM_MEDIUM=LP&UTM_CAMPAIGN=HF"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full text-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            style={{ fontFamily: SG, fontWeight: 700, fontSize: '1rem', background: NEON, boxShadow: `0 0 35px ${NEON}65` }}
          >
            Get a Free Audit <ArrowRight size={18} />
          </a>
          <a
            href="#services"
            className="px-8 py-4 rounded-full text-white border-2 border-white transition-all hover:bg-[#F5F2ED] hover:text-black flex items-center justify-center gap-2 font-bold"
            style={{ fontFamily: SG }}
          >
            See What We Do
          </a>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span
            className="text-xs uppercase tracking-[0.4em] font-bold"
            style={{ fontFamily: SG, color: NEON, textShadow: `0 0 12px ${NEON}66` }}
          >
            The Method
          </span>
          <div className="w-px h-12 bg-[#F5F2ED]/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2"
              style={{ background: NEON, boxShadow: `0 0 10px ${NEON}` }}
              animate={{ top: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [complete, setComplete] = useState(false);
  const [exiting, setExiting] = useState(false);
  const colorInterpolated = useTransform(count, [0, 100], ['#144514', NEON]);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Lock scroll on mount
    const controls = animate(count, 100, {
      duration: 3,
      ease: "easeInOut",
      delay: 0.5,
      onUpdate: (latest) => {
        if (latest >= 100 && !complete) {
          setComplete(true);
        }
      }
    });

    return () => {
      controls.stop();
      document.body.style.overflow = '';
    };
  }, [count, complete]);

  useEffect(() => {
    if (complete) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 800); 
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [complete, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[99] flex items-center justify-center bg-[#0a0a0a]"
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          className="text-white text-center uppercase tracking-[0.2em] font-black text-xl md:text-3xl"
          style={{ fontFamily: SG }}
        >
          LOADING <br className="block md:hidden" /> ONLINE PRESENCE...
        </div>

        <motion.div 
          className="text-8xl md:text-[10rem] font-black leading-none select-none"
          animate={exiting ? { scale: 50, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={exiting ? { duration: 0.8, ease: "easeIn" } : {}}
          style={{ 
            fontFamily: SG,
            color: colorInterpolated,
            textShadow: complete ? `0 0 40px ${NEON}` : 'none'
          }}
        >
          <motion.span>{rounded}</motion.span>%
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  const badges = [
    { emoji: '🚀', label: 'Growth Partner' },
    { emoji: '💪', label: 'Trusted by 30+ Wellness Businesses' },
    { emoji: '⭐', label: '5.0 Star Rated' }
  ];

  return (
    <section className="relative bg-[#F5F2ED] py-5 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${NEON}, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${NEON}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-base">{b.emoji}</span>
              <span
                className="text-sm text-gray-500 whitespace-nowrap"
                style={{ fontFamily: SG, fontWeight: 500 }}
              >
                {b.label}
              </span>
              {i < badges.length - 1 && (
                <span className="hidden lg:block text-gray-200 ml-4 select-none">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem ─────────────────────────────────────────────────────────────────
function Problem() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const pain = [
    {
      icon: <Monitor size={22} />,
      title: 'Your Website Doesn\'t Convert',
      desc: 'You\'re getting traffic but no sign-ups. Visitors land and leave without booking a trial or joining a session.',
    },
    {
      icon: <Clock size={22} />,
      title: 'Manual Bookings Eat Your Time',
      desc: 'You\'re stuck answering DMs, calls, and emails just to schedule someone. That\'s admin hell, not growth.',
    },
    {
      icon: <Users size={22} />,
      title: 'No Follow-Up System',
      desc: 'Leads come in and go cold. There\'s no automated sequence nurturing them from enquiry to paying client.',
    },
    {
      icon: <Search size={22} />,
      title: 'Invisible on Google',
      desc: 'People nearby are searching for wellness practitioners right now — and finding your competitors, not you.',
    },
  ];

  return (
    <section ref={ref} className="bg-[#F5F2ED] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2
            className="text-4xl md:text-5xl text-black mb-5"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
          >
            Running a top-tier business<br />
            <span style={{ color: NEON }}>isn&apos;t enough</span> anymore.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto" style={{ fontFamily: SG }}>
            If your digital presence doesn't match your coaching quality, you're leaving money on the table every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pain.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-[#F5F2ED] rounded-2xl p-7 flex gap-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              style={{ borderLeft: `4px solid ${NEON}` }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${NEON}18` }}
              >
                <span style={{ color: '#111' }}>{p.icon}</span>
              </div>
              <div>
                <h3 className="text-base text-black mb-1.5" style={{ fontFamily: SG, fontWeight: 700 }}>
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SG }}>
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const services = [
    {
      icon: <Monitor size={26} />,
      title: 'Websites',
      desc: 'Fast, mobile-first sites built to convert visitors into clients — not just look pretty.',
    },
    {
      icon: <Calendar size={26} />,
      title: 'Booking Integration',
      desc: 'Connect Mindbody, Glofox, or any booking system seamlessly into your digital presence.',
    },
    {
      icon: <CreditCard size={26} />,
      title: 'Payment Systems',
      desc: 'Online bookings, service plans, and product sales — all automated and frictionless.',
    },
    {
      icon: <Mail size={26} />,
      title: 'Email Marketing',
      desc: 'Automated sequences that retain clients, re-engage churners, and fill your schedule.',
    },
    {
      icon: <Search size={26} />,
      title: 'SEO',
      desc: 'Get found on Google by people searching for wellness services near them — before your competitors do.',
    },
    {
      icon: <Bot size={26} />,
      title: 'AI Agents & Automations',
      desc: '24/7 AI reception, intelligent lead follow-up, and smart workflows so nothing slips through.',
    },
  ];

  return (
    <section id="services" ref={ref} className="py-24 px-6" style={{ background: '#f7f8fa' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
            style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}20`, color: '#111' }}
          >
            Growth
          </span>
          <h2
            className="text-4xl md:text-5xl text-black"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
          >
            Everything your business<br />needs — in one place.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-[#F5F2ED] rounded-2xl p-7 shadow-sm border border-gray-100 relative overflow-hidden cursor-default"
            >
              {/* Top neon stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: NEON }}
              />
              <div
                className="w-13 h-13 rounded-xl flex items-center justify-center mb-5"
                style={{ width: 52, height: 52, background: `${NEON}18` }}
              >
                <span style={{ color: '#111' }}>{s.icon}</span>
              </div>
              <h3
                className="text-lg text-black mb-2"
                style={{ fontFamily: SG, fontWeight: 700 }}
              >
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SG }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Media ─────────────────────────────────────────────────────────────
function SocialMedia() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    {
      title: 'Strategy & Concept',
      desc: 'We define your brand voice, content pillars, and aesthetic style to ensure every post serves your growth goals.',
      icon: <Target size={24} />,
    },
    {
      title: 'Premium Asset Creation',
      desc: 'High-fidelity photography, custom graphics, and professional video editing tailored specifically for wellness platforms.',
      icon: <Users size={24} />,
    },
    {
      title: 'Hands-off Publishing',
      desc: 'Daily management, captions, and scheduling. We handle the technical side so you can stay in the flow of your practice.',
      icon: <Calendar size={24} />,
    },
  ];

  return (
    <section id="social-media" ref={ref} className="py-24 px-6 bg-[#F5F2ED] border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span
              className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}20`, color: '#111' }}
            >
              Presence
            </span>
            <h2
              className="text-4xl md:text-5xl text-black mb-8"
              style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
            >
              Your Social Media,<br />
              <span style={{ color: NEON, background: '#000', padding: '0 8px' }}>Done For You.</span>
            </h2>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 rounded-lg flex flex-shrink-0 items-center justify-center" style={{ background: `${NEON}15`, color: '#000' }}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1" style={{ fontFamily: SG }}>{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SG }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1074&auto=format&fit=crop"
                alt="Instagram Social Media Management"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-[#F5F2ED]/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center max-w-sm">
                  <Star className="text-yellow-400 mx-auto mb-4" size={32} fill="currentColor" />
                  <p className="text-white text-lg font-medium italic mb-4" style={{ fontFamily: SG }}>
                    "Our engagement doubled within the first month. We no longer worry about what to post."
                  </p>
                  <p className="text-white/60 text-sm uppercase tracking-widest font-bold" style={{ fontFamily: SG }}>
                    - Wellness Business Owner
                  </p>
                </div>
              </div>
            </div>
            {/* Geometric accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon opacity-10 rounded-full blur-3xl" style={{ backgroundColor: NEON }} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon opacity-10 rounded-full blur-3xl" style={{ backgroundColor: NEON }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── CountUp Helper ──────────────────────────────────────────────────────────
function CountUp({ to, duration, delay, inView }: { to: number; duration: number; delay: number; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, delay, ease: 'easeInOut' });
      return controls.stop;
    }
  }, [inView, count, to, duration, delay]);

  useEffect(() => {
    return rounded.onChange((v) => setDisplay(v));
  }, [rounded]);

  return <span>{display}%</span>;
}

// ─── Automations ──────────────────────────────────────────────────────────────
function Automations() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    {
      title: 'Auto-Pilot Bookings',
      desc: 'Seamless integration with Cal.com, Acuity, or Mindbody. Your schedule fills up while you sleep.',
      icon: <Calendar size={24} />,
    },
    {
      title: 'Retention Sequences',
      desc: 'Automated email & SMS follow-ups that ensure your clients keep coming back for more.',
      icon: <Mail size={24} />,
    },
    {
      title: 'Smart Lead Nurturing',
      desc: 'Instantly capture and segment new enquiries based on their specific wellness goals.',
      icon: <Bot size={24} />,
    },
  ];

  return (
    <section id="automations" ref={ref} className="py-24 px-6 relative overflow-hidden" style={{ background: '#080808' }}>
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon opacity-5 blur-[120px] rounded-full" style={{ backgroundColor: NEON }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon opacity-5 blur-[120px] rounded-full" style={{ backgroundColor: NEON }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-neon opacity-20 blur-2xl" style={{ backgroundColor: NEON }} />
              <div className="space-y-10">
                {[
                  { label: 'Booking Automation', val: 100, delay: 0.2 },
                  { label: 'Email Marketing', val: 100, delay: 1.2 },
                  { label: 'Sales Funnel', val: 100, delay: 2.2 }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400" style={{ fontFamily: SG }}>
                        {item.label}
                      </span>
                      <div className="text-xs font-bold" style={{ fontFamily: SG, color: NEON }}>
                        <CountUp to={item.val} duration={3.5} delay={item.delay} inView={inView} />
                      </div>
                    </div>
                    <div className="h-2 bg-[#F5F2ED]/5 rounded-full overflow-hidden relative border border-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: NEON,
                          boxShadow: `0 0 15px ${NEON}44`
                        }}
                        initial={{ width: '0%' }}
                        animate={inView ? { width: `${item.val}%` } : {}}
                        transition={{ duration: 3.5, delay: item.delay, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon/10 border border-neon/20 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: NEON }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" style={{ backgroundColor: NEON }} />
                    System Status: Optimized
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <span
              className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}20`, color: NEON }}
            >
              Efficiency
            </span>
            <h2
              className="text-4xl md:text-5xl text-white mb-8"
              style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
            >
              Systems that scale<br />
              <span style={{ color: NEON }}>without you.</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg" style={{ fontFamily: SG }}>
              We don't just build websites; we build engines. Our automation stacks handle the heavy lifting so you can focus on your clients.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center border border-white/10 group-hover:border-neon group-hover:text-neon transition-colors duration-300" style={{ color: NEON }}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1" style={{ fontFamily: SG }}>{f.title}</h4>
                    <p className="text-gray-500 text-sm" style={{ fontFamily: SG }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Why Us (Black) ───────────────────────────────────────────────────────────
function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const pillars = [
    {
      icon: <Target size={30} />,
      title: 'Industry Expertise',
      desc: 'We understand the unique needs of personal trainers, nutritionists, and therapists.',
    },
    {
      icon: <Zap size={30} />,
      title: 'End-to-End Delivery',
      desc: 'Strategy to launch and beyond — we handle everything so you can focus on what you do best.',
    },
    {
      icon: <TrendingUp size={30} />,
      title: 'Results-Led Approach',
      desc: 'We measure what matters: leads, bookings, revenue. Not vanity metrics.',
    },
  ];

  const stats = [
    { num: '50+', label: 'Wellness Businesses' },
    { num: '3×', label: 'Avg Revenue Growth' },
    { num: '98%', label: 'Client Retention' },
  ];

  return (
    <section id="why-us" ref={ref} className="py-24 px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
            style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}22`, color: NEON }}
          >
            Flexibility
          </span>
          <h2
            className="text-4xl md:text-5xl text-white mb-6"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
          >
            Built for{' '}
            <span style={{ color: NEON }}>growth</span>.
            <br />
            Designed for <span style={{ color: NEON }}>results</span>.
          </h2>
          <p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: SG }}
          >
            We provide tailored systems that handle the complexity of growing your digital presence, so you can focus entirely on delivering exceptional results for your clients.
          </p>
        </motion.div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.15 }}
              className="rounded-2xl p-8 text-center border"
              style={{ borderColor: '#F5F2ED12', background: '#F5F2ED07' }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{ background: `${NEON}20`, color: NEON }}
              >
                {p.icon}
              </div>
              <h3
                className="text-xl text-white mb-3"
                style={{ fontFamily: SG, fontWeight: 800 }}
              >
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SG }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 rounded-2xl overflow-hidden border"
          style={{ borderColor: '#F5F2ED12', background: '#F5F2ED05' }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="py-10 px-4 text-center"
              style={{ borderRight: i < stats.length - 1 ? '1px solid #F5F2ED12' : 'none' }}
            >
              <div
                className="text-4xl md:text-5xl mb-2"
                style={{ fontFamily: SG, fontWeight: 800, color: NEON, textShadow: `0 0 20px ${NEON}60` }}
              >
                {s.num}
              </div>
              <div className="text-gray-500 text-sm" style={{ fontFamily: SG }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Projects (Holistic Ecosystem) ──────────────────────────────────────────
function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const ecosystems = [
    {
      title: 'High-Performance Gyms',
      desc: 'Digital engines for strength communities. We build high-conversion funnels that turn local residents into dedicated lifters.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
      tag: 'Strength',
      href: '/hf/battery'
    },
    {
      title: 'Wellness & Mindfulness',
      desc: 'Serene, beautiful platforms for yoga studios and mindfulness practitioners. Designed to calm the mind and fill the mat.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
      tag: 'Balance',
      href: '/hf/youga'
    },
    {
      title: 'Nutrition & Dietetics',
      desc: 'Precision systems for clinical experts. We automate bookings and consultations so you can focus on health outcomes.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop',
      tag: 'Fuel',
      href: '/hf/balancedbite'
    }
  ];

  return (
    <section id="ecosystem" ref={ref} className="py-32 md:py-48 px-6 bg-[#16211C] relative">
      {/* Top Shape Divider */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-[40px] md:h-[80px]" style={{ fill: '#f7f8fa' }}>
          <polygon points="0,0 100,0 100,10" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-[0.2em] font-bold"
            style={{ fontFamily: SG, background: '#6BAF6B20', color: '#6BAF6B' }}
          >
            Case Studies
          </span>
          <h2
            className="text-4xl md:text-5xl text-white mb-6"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
          >
            One division. <span style={{ color: '#6BAF6B' }}>Three industries.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: SG }}>
            Whether you run a high-intensity gym, a mindful wellness studio, or a clinical nutrition practice — we are the agency with the solution. We build specialized, high-converting digital ecosystems designed exclusively to automate bookings and scale your growth.
          </p>
        </motion.div>

        {/* Mobile Slider / Desktop Grid */}
        <div
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar"
          style={{ width: 'calc(100% + 3rem)', margin: '0 -1.5rem', padding: '0 1.5rem' }}
        >
          {ecosystems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col min-w-[85vw] md:min-w-0 snap-center transition-opacity hover:opacity-90"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-white uppercase tracking-widest font-bold" style={{ fontFamily: SG }}>
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-xl font-bold mb-3 text-black" style={{ fontFamily: SG }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SG }}>{item.desc}</p>
              </div>
              <div className="px-8 pb-8">
                <div className="h-px bg-gray-100 mb-6" />
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6BAF6B]" style={{ fontFamily: SG }}>
                  View Expertise <ArrowRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Shape Divider */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0" style={{ transform: 'translateY(1px)' }}>
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-[40px] md:h-[80px]" style={{ fill: '#F5F2ED' }}>
          <polygon points="0,10 100,10 100,0" />
        </svg>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    {
      num: '01',
      title: 'Discovery',
      desc: 'We audit your digital presence, understand your goals, and map out exactly what needs to be built.',
    },
    {
      num: '02',
      title: 'Build',
      desc: 'Our team designs and develops your complete digital system — website, automations, booking, SEO, and more.',
    },
    {
      num: '03',
      title: 'Launch & Grow',
      desc: 'We go live, monitor performance, and optimise continuously so your systems keep delivering results.',
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="bg-[#F5F2ED] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span
            className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
            style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}20`, color: '#111' }}
          >
            Our Process
          </span>
          <h2
            className="text-4xl md:text-5xl text-black"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
          >
            From zero to{' '}
            <span style={{ color: NEON }}>fully launched</span>
            <br />in three steps.
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {/* Connector line */}
          <div
            className="hidden md:block absolute"
            style={{
              top: 27,
              left: '20%',
              right: '20%',
              height: 2,
              background: `linear-gradient(90deg, ${NEON}50, ${NEON}50)`,
              zIndex: 0,
            }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-black mb-7"
                style={{
                  fontFamily: SG,
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  background: NEON,
                  boxShadow: `0 0 28px ${NEON}55`,
                }}
              >
                {s.num}
              </div>
              <h3
                className="text-2xl text-black mb-3"
                style={{ fontFamily: SG, fontWeight: 800 }}
              >
                {s.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed max-w-xs"
                style={{ fontFamily: SG }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const reviews = [
    {
      quote:
        'EZWebOne completely transformed our online presence. Within 3 months we had 40 new clients from our website alone. The automated follow-up system is a genuine game changer.',
      name: 'Sarah Mitchell',
      role: 'Owner, CrossFit Forge',
      avatar: AVATAR_FEMALE,
    },
    {
      quote:
        'They spoke our language from day one. No time wasted explaining how bookings work. The integration is seamless and our clients love the experience.',
      name: 'James Okafor',
      role: 'Founder, Peak Performance PT',
      avatar: AVATAR_MALE,
    },
    {
      quote:
        'Our enquiries tripled in the first two months. The SEO work they did means we\'re now the top result when anyone searches for yoga studios in our city. Absolute legends.',
      name: 'Emma Rhodes',
      role: 'Director, Studio Zen Wellness',
      avatar: AVATAR_OWNER,
    },
  ];

  return (
    <section id="testimonials" ref={ref} className="py-24 px-6" style={{ background: '#F5F2ED' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
            style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}20`, color: '#111' }}
          >
            Reviews
          </span>
          <h2
            className="text-4xl md:text-5xl text-black"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.12 }}
          >
            Don&apos;t take our word for it.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.15 }}
              className="bg-[#F5F2ED] rounded-2xl p-8 shadow-sm flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={15} fill={NEON} color={NEON} />
                ))}
              </div>
              <p
                className="text-gray-700 text-sm leading-relaxed mb-6 flex-1 italic"
                style={{ fontFamily: SG }}
              >
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div
                    className="text-sm text-black"
                    style={{ fontFamily: SG, fontWeight: 700 }}
                  >
                    {r.name}
                  </div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: SG }}>
                    {r.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `${NEON}08`, filter: 'blur(100px)' }}
      />
      {/* Top neon border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${NEON}, transparent)` }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest"
            style={{ fontFamily: SG, fontWeight: 700, background: `${NEON}22`, color: NEON }}
          >
            <CheckCircle size={13} /> No contracts. No pressure. Just honest advice.
          </span>
          <h2
            className="text-4xl md:text-6xl text-white mb-6"
            style={{ fontFamily: SG, fontWeight: 800, lineHeight: 1.08 }}
          >
            Ready to scale
            <br />
            <span style={{ color: NEON }}>your business?</span>
          </h2>
          <p
            className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
            style={{ fontFamily: SG }}
          >
            Book a free 20-minute strategy call. We'll audit your current setup and show you exactly what's holding your business back.
          </p>
          <a
            href="https://calendly.com/eduard-ezwebone/20min?UTM_SOURCE=HF_LP&UTM_MEDIUM=LP&UTM_CAMPAIGN=HF"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-black transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: SG,
              fontWeight: 700,
              fontSize: '1.05rem',
              background: NEON,
              boxShadow: `0 0 45px ${NEON}65, 0 0 90px ${NEON}25`,
            }}
          >
            Book a Free Strategy Call <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="relative pt-12 pb-0 px-6 overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Top neon border shadow effect */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${NEON}, transparent)` }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* 3X Bigger Centered Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex justify-center"
        >
          <img 
            src="/brand/HF_EZ-White-_Tear.png" 
            alt="EZWebOne" 
            className="h-64 md:h-[400px] w-auto object-contain brightness-110" 
          />
        </motion.div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-16">
          {['Services', 'Why Us', 'Process', 'Reviews', 'Contact'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(' ', '')}`}
              className="text-gray-500 text-sm font-bold tracking-[0.2em] hover:text-neon transition-all uppercase"
              style={{ fontFamily: SG }}
            >
              {l}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="mb-12">
          <p className="text-gray-700 text-[10px] tracking-[0.4em] font-bold uppercase" style={{ fontFamily: SG }}>
            © 2026 EZWebOne. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

    </footer>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    business_name: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error: submitError } = await supabase
        .from('forms')
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          business_name: formData.business_name,
          message: formData.message,
          source: 'Health & Wellness Landing Page'
        }]);

      if (submitError) throw submitError;

      setSubmitted(true);
      setFormData({ full_name: '', email: '', business_name: '', message: '' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Pointy Neon Divider */}
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ zIndex: 20 }}>
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-10 block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L600 120 L1200 0 Z"
            fill="#F5F2ED"
          />
          <path
            d="M0 0 L600 120 L1200 0"
            fill="none"
            stroke={NEON}
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Background circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-neon/20 border border-neon/40 mb-6 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
          >
            <span className="text-neon text-xs font-bold uppercase tracking-widest" style={{ fontFamily: SG }}>Let's Build It</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
            style={{ fontFamily: SG }}
          >
            Let's Work on it <br/> Remotely
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-xl mx-auto text-lg"
          >
            Fill in the details below and we'll get back to you with a direct battle-plan for your business growth.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-[#161616] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative"
        >
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-neon/30">
                <CheckCircle size={40} className="text-neon" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: SG }}>Mission Accepted!</h3>
              <p className="text-white/60">We've received your transmission. Our team will review your project and contact you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <Users size={14} className="text-neon" />
                  <label className="text-xs uppercase tracking-widest text-white/70 font-bold">Full Name</label>
                </div>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-neon/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <Mail size={14} className="text-neon" />
                  <label className="text-xs uppercase tracking-widest text-white/70 font-bold">Work Email</label>
                </div>
                <input
                  required
                  type="email"
                  placeholder="john@wellness.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-neon/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center gap-2 ml-1">
                  <Target size={14} className="text-neon" />
                  <label className="text-xs uppercase tracking-widest text-white/70 font-bold">Business Name</label>
                </div>
                <input
                  type="text"
                  placeholder="The Wellness Collective"
                  value={formData.business_name}
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-neon/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center gap-2 ml-1">
                  <Bot size={14} className="text-neon" />
                  <label className="text-xs uppercase tracking-widest text-white/70 font-bold">Project Details</label>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your goals and what you want to achieve..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-neon/50 transition-all resize-none font-medium"
                />
              </div>
              
              {error && (
                <div className="md:col-span-2 text-red-500 text-sm font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#050505] border-2 border-neon text-neon py-5 rounded-xl font-black uppercase tracking-widest text-lg hover:bg-neon hover:text-black focus:bg-neon focus:text-black outline-none focus:outline-none active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_30px_rgba(57,255,20,0.2)]"
                  style={{ fontFamily: SG, fontWeight: 900 }}
                >
                  {loading ? 'Transmitting...' : 'Launch Strategy Session'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hf_loaded');
    if (hasLoaded) {
      setLoading(false);
    }
    setIsReady(true);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('hf_loaded', 'true');
    setLoading(false);
  };

  if (!isReady) return <div style={{ background: '#000', minHeight: '100vh' }} />;

  return (
    <div style={{ fontFamily: SG, overflowX: 'hidden' }}>
      <AnimatePresence>
        {loading && <Preloader onComplete={handleComplete} />}
      </AnimatePresence>
      <Nav />
      <Hero />
      <TrustBar />
      <Problem />
      <Services />
      <Projects />
      <SocialMedia />
      <Automations />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <ContactForm />
      <FinalCTA />
      <Footer />
    </div>
  );
}

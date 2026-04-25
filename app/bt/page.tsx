"use client";

import { ArrowRight, CheckCircle, Sparkles, Calendar, Monitor, Bot, Star, Quote } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizePath } from "@/lib/i18n/config";
import { CALENDLY_BOOKING_URL } from "@/lib/links";

const palette = {
  primary: "#EAE6DF",
  secondary: "#CFC7BD",
  accent: "#8A8F7A",
  dark: "#2B2B2B",
  bg: "#F8F7F5",
  premium: "#C2A878",
};

const content = {
  en: {
    nav: {
      services: "Services",
      sectors: "Sectors",
      process: "Process",
      testimonials: "Reviews",
      cta: "Book Consultation",
    },
    hero: {
      badge: "Beauty & Aesthetics Division",
      title: "Neutral luxury digital systems for modern beauty brands.",
      sub:
        "We design elegant websites, seamless booking journeys, and automations for salons, skin clinics, and aesthetic practitioners who want premium positioning.",
      primaryCta: "Book Strategy Call",
      secondaryCta: "View Services",
      stats: ["Unisex premium design", "Booking-first websites", "Automation with clinic tone"],
    },
    services: {
      badge: "What We Build",
      title: "Structured systems for beauty businesses that sell trust.",
      cards: [
        {
          title: "Premium Website Design",
          desc: "Editorial-inspired layouts with clean structure, refined spacing, and high-converting pages.",
        },
        {
          title: "Booking Journey Optimization",
          desc: "Clear treatment menus, practitioner pages, and frictionless booking flows that increase completed appointments.",
        },
        {
          title: "Automation & Follow-up",
          desc: "Consultation reminders, aftercare journeys, and rebooking sequences with the right premium tone.",
        },
        {
          title: "Aesthetic Content Systems",
          desc: "Reusable page blocks and campaign sections for treatments, seasonal offers, and clinic updates.",
        },
      ],
    },
    sectors: {
      badge: "Who It Is For",
      title: "Built for salons, clinics, and aesthetic specialists.",
      items: [
        "Advanced skincare clinics",
        "Injectables and facial aesthetics",
        "Hair and beauty salons",
        "Medical-aesthetic practices",
      ],
    },
    process: {
      badge: "Process",
      title: "From concept to launch in three clear stages.",
      steps: [
        {
          title: "Positioning & Direction",
          desc: "We define your digital tone, service hierarchy, and visual direction with a premium-unisex lens.",
        },
        {
          title: "Build & Integration",
          desc: "We craft the website and connect bookings, lead capture, and automation tools into one clean system.",
        },
        {
          title: "Launch & Refinement",
          desc: "We go live, review behavior data, and refine pages and journeys for stronger booking performance.",
        },
      ],
    },
    testimonials: {
      badge: "Client Feedback",
      title: "Trusted by teams that care about detail.",
      quotes: [
        "The brand finally looks as premium as the treatments we provide.",
        "Our consultations increased because the booking flow became genuinely effortless.",
        "The whole system feels elegant, clear, and professional on every device.",
      ],
    },
    final: {
      title: "Ready to elevate your beauty brand online?",
      sub: "Book a 20-minute strategy call and we will map the fastest route to a cleaner, higher-converting digital experience.",
      cta: "Book Consultation",
      note: "No pressure. No hard sell. Just clear next steps.",
    },
  },
  ro: {
    nav: {
      services: "Servicii",
      sectors: "Segmente",
      process: "Proces",
      testimonials: "Recenzii",
      cta: "Programeaza consultatie",
    },
    hero: {
      badge: "Divizia Beauty & Aesthetics",
      title: "Sisteme digitale luxury-neutre pentru branduri moderne de beauty.",
      sub:
        "Construim website-uri elegante, fluxuri de programare fara frictiune si automatizari pentru saloane, clinici de skincare si practicieni de estetica care vor pozitionare premium.",
      primaryCta: "Programeaza call strategic",
      secondaryCta: "Vezi serviciile",
      stats: ["Design premium unisex", "Website-uri orientate pe programari", "Automatizari cu ton de clinica"],
    },
    services: {
      badge: "Ce Construim",
      title: "Sisteme structurate pentru business-uri beauty care vand incredere.",
      cards: [
        {
          title: "Web Design Premium",
          desc: "Layout-uri cu vibe editorial, structura curata, spacing rafinat si pagini care convertesc.",
        },
        {
          title: "Optimizare Flux Programari",
          desc: "Meniuri clare de tratamente, pagini pentru specialisti si fluxuri de booking care cresc programarile finalizate.",
        },
        {
          title: "Automatizari & Follow-up",
          desc: "Reminder-e pentru consultatii, fluxuri de aftercare si secvente de reprogramare cu ton premium.",
        },
        {
          title: "Sisteme de Continut Estetic",
          desc: "Blocuri reutilizabile pentru tratamente, oferte sezoniere si update-uri de clinica.",
        },
      ],
    },
    sectors: {
      badge: "Pentru Cine",
      title: "Construit pentru saloane, clinici si specialisti in estetica.",
      items: [
        "Clinici de skincare avansat",
        "Injectabile si estetica faciala",
        "Saloane de hair si beauty",
        "Practici medico-estetice",
      ],
    },
    process: {
      badge: "Proces",
      title: "De la concept la lansare in trei etape clare.",
      steps: [
        {
          title: "Pozitionare & Directie",
          desc: "Stabilim tonul digital, ierarhia serviciilor si directia vizuala printr-o lentila premium-unisex.",
        },
        {
          title: "Build & Integrare",
          desc: "Construim website-ul si conectam booking-ul, captarea lead-urilor si automatizarile intr-un singur sistem curat.",
        },
        {
          title: "Lansare & Rafinare",
          desc: "Lansam, analizam comportamentul utilizatorilor si optimizam paginile pentru performanta mai buna in programari.",
        },
      ],
    },
    testimonials: {
      badge: "Feedback Clienti",
      title: "Ales de echipe care tin la detalii.",
      quotes: [
        "Brandul arata in sfarsit la fel de premium ca tratamentele pe care le oferim.",
        "Consultatiile au crescut pentru ca fluxul de booking a devenit cu adevarat simplu.",
        "Tot sistemul se simte elegant, clar si profesionist pe orice device.",
      ],
    },
    final: {
      title: "Vrei sa ridici brandul tau beauty in online?",
      sub: "Programeaza un call strategic de 20 de minute si iti aratam cea mai rapida ruta spre o experienta digitala mai curata si cu conversie mai mare.",
      cta: "Programeaza consultatie",
      note: "Fara presiune. Fara hard sell. Doar pasi clari.",
    },
  },
} as const;

export default function BTPage() {
  const { locale } = useI18n();
  const isRo = locale === "ro";
  const t = isRo ? content.ro : content.en;

  return (
    <div style={{ background: palette.bg, color: palette.dark, fontFamily: "var(--font-bt-body), Inter, sans-serif" }}>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] border-b"
        style={{
          background: "rgba(248, 247, 245, 0.88)",
          backdropFilter: "blur(10px)",
          borderColor: palette.secondary,
        }}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <a
            href={localizePath(locale, "/bt")}
            style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif", letterSpacing: "-0.02em" }}
            className="text-2xl"
          >
            BT <span style={{ color: palette.premium }}>|</span> EZWebOne
          </a>

          <div className="hidden items-center gap-8 md:flex" style={{ fontFamily: "var(--font-bt-ui), Montserrat, sans-serif" }}>
            <a href="#services" className="text-xs uppercase tracking-[0.16em]">{t.nav.services}</a>
            <a href="#sectors" className="text-xs uppercase tracking-[0.16em]">{t.nav.sectors}</a>
            <a href="#process" className="text-xs uppercase tracking-[0.16em]">{t.nav.process}</a>
            <a href="#testimonials" className="text-xs uppercase tracking-[0.16em]">{t.nav.testimonials}</a>
          </div>

          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-bt-ui), Montserrat, sans-serif",
              background: palette.dark,
              color: palette.bg,
            }}
          >
            {t.nav.cta}
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(194,168,120,0.18), transparent 38%), radial-gradient(circle at 85% 75%, rgba(138,143,122,0.16), transparent 40%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p
              className="mb-5 text-base"
              style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}
            >
              {t.hero.badge}
            </p>
            <h1
              className="max-w-4xl text-[clamp(3rem,7vw,4rem)] leading-[1.06]"
              style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif", letterSpacing: "-0.02em" }}
            >
              {t.hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-[1.6] text-[#4C4C4C]">{t.hero.sub}</p>

            <div className="mt-10 flex flex-wrap gap-4" style={{ fontFamily: "var(--font-bt-ui), Montserrat, sans-serif" }}>
              <a
                href={CALENDLY_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs uppercase tracking-[0.14em]"
                style={{ background: palette.dark, color: palette.bg }}
              >
                {t.hero.primaryCta} <ArrowRight size={16} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-xs uppercase tracking-[0.14em]"
                style={{ borderColor: palette.secondary, color: palette.dark }}
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border p-8" style={{ background: palette.primary, borderColor: palette.secondary, boxShadow: "0 18px 40px rgba(43,43,43,0.08)" }}>
            <p
              className="mb-5 text-sm"
              style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}
            >
              neutral luxury | unisex design | premium minimal
            </p>
            <div className="space-y-4">
              {t.hero.stats.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} color={palette.premium} />
                  <span className="text-[15px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-4 py-20 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-3 text-base" style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}>
            {t.services.badge}
          </p>
          <h2
            className="max-w-4xl text-[clamp(2rem,5vw,2.5rem)] leading-[1.1]"
            style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif", letterSpacing: "-0.01em" }}
          >
            {t.services.title}
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {t.services.cards.map((card, idx) => (
              <article
                key={card.title}
                className="rounded-3xl border p-7"
                style={{
                  borderColor: palette.secondary,
                  background: idx % 2 === 0 ? "#FBFAF8" : palette.primary,
                  boxShadow: "0 12px 30px rgba(43,43,43,0.06)",
                }}
              >
                <div className="mb-4 inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em]" style={{ borderColor: palette.premium, color: palette.accent, fontFamily: "var(--font-bt-ui), Montserrat, sans-serif" }}>
                  {idx === 0 && <Monitor size={14} className="mr-2" />}
                  {idx === 1 && <Calendar size={14} className="mr-2" />}
                  {idx === 2 && <Bot size={14} className="mr-2" />}
                  {idx === 3 && <Sparkles size={14} className="mr-2" />}
                  service
                </div>
                <h3 className="text-[30px] leading-[1.2]" style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif" }}>
                  {card.title}
                </h3>
                <p className="mt-3 text-[17px] leading-[1.6] text-[#505050]">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sectors" className="px-4 py-20 md:px-8" style={{ background: "#F3F1EC" }}>
        <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="mb-3 text-base" style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}>
              {t.sectors.badge}
            </p>
            <h2 className="text-[clamp(2rem,5vw,2.5rem)] leading-[1.12]" style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif" }}>
              {t.sectors.title}
            </h2>
            <div className="mt-8 grid gap-4">
              {t.sectors.items.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border px-4 py-4" style={{ borderColor: palette.secondary, background: "#F8F7F5" }}>
                  <Star size={14} color={palette.premium} fill={palette.premium} />
                  <span className="text-[17px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="aspect-[3/4] rounded-3xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop')" }} />
            <div className="aspect-[3/4] rounded-3xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop')" }} />
          </div>
        </div>
      </section>

      <section id="process" className="px-4 py-20 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-3 text-base" style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}>
            {t.process.badge}
          </p>
          <h2 className="text-[clamp(2rem,5vw,2.5rem)] leading-[1.12]" style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif" }}>
            {t.process.title}
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.process.steps.map((step, i) => (
              <article key={step.title} className="rounded-3xl border p-7" style={{ borderColor: palette.secondary, background: "#FBFAF8" }}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm" style={{ background: palette.dark, color: palette.bg, fontFamily: "var(--font-bt-ui), Montserrat, sans-serif" }}>
                  0{i + 1}
                </span>
                <h3 className="mt-5 text-[30px] leading-[1.2]" style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif" }}>
                  {step.title}
                </h3>
                <p className="mt-3 text-[17px] leading-[1.6] text-[#505050]">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-4 py-20 md:px-8" style={{ background: palette.primary }}>
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-3 text-base" style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}>
            {t.testimonials.badge}
          </p>
          <h2 className="text-[clamp(2rem,5vw,2.5rem)] leading-[1.12]" style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif" }}>
            {t.testimonials.title}
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.testimonials.quotes.map((quote) => (
              <blockquote key={quote} className="rounded-3xl border p-7" style={{ borderColor: palette.secondary, background: "#F8F7F5" }}>
                <Quote size={18} color={palette.premium} />
                <p className="mt-4 text-[17px] leading-[1.6] text-[#4A4A4A]">{quote}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-24 md:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-[2rem] border px-6 py-12 text-center md:px-12" style={{ borderColor: palette.secondary, background: "#FBFAF8", boxShadow: "0 18px 40px rgba(43,43,43,0.08)" }}>
          <h2 className="text-[clamp(2rem,5vw,2.5rem)] leading-[1.1]" style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif", letterSpacing: "-0.01em" }}>
            {t.final.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.6] text-[#4E4E4E]">{t.final.sub}</p>

          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs uppercase tracking-[0.14em]"
            style={{
              fontFamily: "var(--font-bt-ui), Montserrat, sans-serif",
              background: palette.dark,
              color: palette.bg,
            }}
          >
            {t.final.cta} <ArrowRight size={16} />
          </a>

          <p className="mt-6 text-sm" style={{ color: palette.accent }}>{t.final.note}</p>
        </div>
      </section>

      <footer className="border-t px-4 py-8 md:px-8" style={{ borderColor: palette.secondary, background: "#F4F2ED" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <a
            href={localizePath(locale, "/bt")}
            className="text-xl"
            style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif", letterSpacing: "-0.02em" }}
          >
            BT <span style={{ color: palette.premium }}>|</span> EZWebOne
          </a>
          <p className="text-sm text-[#5A5A5A]">{isRo ? "Divizie beauty si aesthetics pentru branduri premium moderne." : "Beauty & aesthetics division for modern premium brands."}</p>
        </div>
      </footer>
    </div>
  );
}

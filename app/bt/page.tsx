"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle,
  Monitor,
  Quote,
  Sparkles,
  Star,
  UserRound,
  Mail,
  Building2,
  MessageSquareText,
} from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizePath } from "@/lib/i18n/config";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import { BRAND_LOGO_MARK_LIGHT_SRC } from "@/lib/brand";
import { supabase } from "@/lib/supabase";

const palette = {
  primary: "#EAE6DF",
  secondary: "#CFC7BD",
  accent: "#8A8F7A",
  dark: "#2B2B2B",
  bg: "#F8F7F5",
  premium: "#C2A878",
  inkSoft: "#55524C",
};

const heroImage =
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=85&w=2200&auto=format&fit=crop";

const content = {
  en: {
    nav: {
      services: "Services",
      sectors: "Sectors",
      process: "Process",
      contact: "Contact",
      cta: "Book Consultation",
    },
    hero: {
      badge: "Beauty & Aesthetics",
      title: "Digital presence for premium clinics and modern salons.",
      sub:
        "Elegant websites, refined booking journeys, and discreet automations for beauty brands that need to feel trusted before the first consultation.",
      primaryCta: "Discuss Your Clinic",
      secondaryCta: "View Services",
      markers: ["Neutral luxury", "Unisex design", "Premium minimal"],
    },
    services: {
      badge: "Digital Systems",
      title: "A complete online experience for clients who buy confidence.",
      cards: [
        {
          icon: Monitor,
          title: "Premium Website Design",
          desc: "Editorial layouts, treatment-led navigation, and pages that make your service quality immediately visible.",
        },
        {
          icon: Calendar,
          title: "Booking Journey",
          desc: "Clear service menus, consultation pathways, and booking flows shaped around trust and conversion.",
        },
        {
          icon: Bot,
          title: "Clinic Automation",
          desc: "Consultation reminders, aftercare messages, rebooking prompts, and lead follow-up with a calm premium tone.",
        },
        {
          icon: Sparkles,
          title: "Treatment Campaigns",
          desc: "Reusable sections for seasonal offers, new treatments, practitioner launches, and education-led campaigns.",
        },
      ],
    },
    sectors: {
      badge: "Built For",
      title: "A refined fit for beauty, skincare, and aesthetic practices.",
      items: [
        "Advanced skincare clinics",
        "Injectables and facial aesthetics",
        "Hair, beauty, and grooming salons",
        "Medical-aesthetic practices",
      ],
    },
    process: {
      badge: "Process",
      title: "Calm, structured, and built around your client journey.",
      steps: [
        {
          title: "Positioning",
          desc: "We define the visual tone, service hierarchy, and credibility signals your ideal client needs to see.",
        },
        {
          title: "Build",
          desc: "We design and connect the website, booking flow, enquiry capture, and automation foundations.",
        },
        {
          title: "Refine",
          desc: "We launch, read the behaviour data, and tune the journey so more visitors become booked consultations.",
        },
      ],
    },
    testimonials: {
      badge: "Proof",
      title: "Details matter when the service is personal.",
      quotes: [
        "The website finally matches the level of care inside the clinic.",
        "The booking flow feels effortless, and consultation enquiries are much more qualified.",
        "It feels polished without looking overly feminine. Exactly what we needed.",
      ],
    },
    form: {
      badge: "Start The Conversation",
      title: "Tell us what your beauty brand needs next.",
      sub:
        "Share a few details and we will come back with a clear direction for the site, booking flow, and automation layer.",
      successTitle: "Enquiry received",
      successBody: "We have your details and will review the project within 24 hours.",
      fullName: "Full name",
      email: "Work email",
      businessName: "Clinic / salon name",
      message: "What do you want to improve?",
      placeholders: {
        fullName: "Alex Morgan",
        email: "alex@clinic.com",
        businessName: "Your clinic",
        message: "Tell us about the services, current website, and what should feel more premium.",
      },
      submit: "Send Project Brief",
      sending: "Sending...",
      error: "Something went wrong. Please try again.",
      supabaseError: "Supabase is not configured.",
      altCta: "Prefer to talk?",
      altCtaLink: "Book a consultation",
    },
    footer: "Beauty & aesthetics digital systems for premium modern brands.",
  },
  ro: {
    nav: {
      services: "Servicii",
      sectors: "Segmente",
      process: "Proces",
      contact: "Contact",
      cta: "Programeaza consultatie",
    },
    hero: {
      badge: "Beauty & Aesthetics",
      title: "Prezenta digitala pentru clinici premium si saloane moderne.",
      sub:
        "Website-uri elegante, fluxuri de booking rafinate si automatizari discrete pentru branduri beauty care trebuie sa inspire incredere inainte de prima consultatie.",
      primaryCta: "Discuta despre clinica ta",
      secondaryCta: "Vezi serviciile",
      markers: ["Luxury neutru", "Design unisex", "Premium minimal"],
    },
    services: {
      badge: "Sisteme Digitale",
      title: "O experienta online completa pentru clienti care cumpara incredere.",
      cards: [
        {
          icon: Monitor,
          title: "Web Design Premium",
          desc: "Layout-uri editoriale, navigatie pe tratamente si pagini care arata imediat calitatea serviciilor tale.",
        },
        {
          icon: Calendar,
          title: "Flux De Booking",
          desc: "Liste preturi clare, trasee pentru consultatii si programari gandite pentru incredere si conversie.",
        },
        {
          icon: Bot,
          title: "Automatizari De Clinica",
          desc: "Reminder-e, mesaje aftercare, rebooking si follow-up pentru lead-uri cu ton calm si premium.",
        },
        {
          icon: Sparkles,
          title: "Campanii Pentru Tratamente",
          desc: "Sectiuni reutilizabile pentru oferte sezoniere, tratamente noi, specialisti si campanii educative.",
        },
      ],
    },
    sectors: {
      badge: "Pentru Cine",
      title: "Potrivit pentru beauty, skincare si practici estetice.",
      items: [
        "Clinici de skincare avansat",
        "Injectabile si estetica faciala",
        "Saloane hair, beauty si grooming",
        "Practici medico-estetice",
      ],
    },
    process: {
      badge: "Proces",
      title: "Calm, structurat si construit in jurul clientului tau.",
      steps: [
        {
          title: "Pozitionare",
          desc: "Definim tonul vizual, ierarhia serviciilor si semnalele de incredere pe care clientul ideal trebuie sa le vada.",
        },
        {
          title: "Build",
          desc: "Design-ul, website-ul, fluxul de booking, captarea lead-urilor si automatizarile sunt conectate intr-un sistem clar.",
        },
        {
          title: "Rafinare",
          desc: "Lansam, citim datele de comportament si ajustam traseul ca mai multi vizitatori sa devina consultatii programate.",
        },
      ],
    },
    testimonials: {
      badge: "Dovada",
      title: "Detaliile conteaza cand serviciul este personal.",
      quotes: [
        "Website-ul arata in sfarsit la nivelul experientei din clinica.",
        "Fluxul de booking e simplu, iar cererile de consultatie sunt mult mai calificate.",
        "Se simte premium fara sa fie prea feminin. Exact ce aveam nevoie.",
      ],
    },
    form: {
      badge: "Incepe Conversatia",
      title: "Spune-ne ce are nevoie brandul tau beauty mai departe.",
      sub:
        "Trimite cateva detalii si revenim cu o directie clara pentru website, booking si stratul de automatizare.",
      successTitle: "Cerere primita",
      successBody: "Avem detaliile tale si vom analiza proiectul in 24 de ore.",
      fullName: "Nume complet",
      email: "Email de lucru",
      businessName: "Nume clinica / salon",
      message: "Ce vrei sa imbunatatesti?",
      placeholders: {
        fullName: "Alex Popescu",
        email: "alex@clinica.ro",
        businessName: "Clinica ta",
        message: "Spune-ne despre servicii, website-ul actual si ce ar trebui sa se simta mai premium.",
      },
      submit: "Trimite brief-ul",
      sending: "Se trimite...",
      error: "Ceva nu a mers bine. Incearca din nou.",
      supabaseError: "Supabase nu este configurat.",
      altCta: "Preferi sa vorbim?",
      altCtaLink: "Programeaza consultatie",
    },
    footer: "Sisteme digitale pentru beauty si aesthetics, create pentru branduri premium moderne.",
  },
} as const;

type FormState = {
  full_name: string;
  email: string;
  business_name: string;
  message: string;
};

export default function BTPage() {
  const { locale } = useI18n();
  const isRo = locale === "ro";
  const t = isRo ? content.ro : content.en;
  const [formData, setFormData] = useState<FormState>({
    full_name: "",
    email: "",
    business_name: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error(t.form.supabaseError);

      const { error: submitError } = await supabase.from("forms").insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          business_name: formData.business_name,
          message: formData.message,
          source: isRo ? "Beauty & Aesthetics Landing Page RO" : "Beauty & Aesthetics Landing Page",
        },
      ]);

      if (submitError) throw submitError;

      setSubmitted(true);
      setFormData({ full_name: "", email: "", business_name: "", message: "" });
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : t.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.dark,
        fontFamily: "var(--font-bt-body), Inter, sans-serif",
      }}
    >
      <nav
        className="fixed left-0 right-0 top-0 z-[100] border-b"
        style={{
          background: "rgba(248, 247, 245, 0.9)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(207, 199, 189, 0.65)",
        }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <a href={localizePath(locale, "/bt")} className="flex items-center" aria-label="EZWebOne BT">
            <Image
              src={BRAND_LOGO_MARK_LIGHT_SRC}
              alt="EZWebOne"
              width={84}
              height={84}
              priority
              className="h-12 w-12 object-contain md:h-16 md:w-16"
            />
          </a>

          <div
            className="hidden items-center gap-8 md:flex"
            style={{ fontFamily: "var(--font-bt-ui), Montserrat, sans-serif" }}
          >
            <a href="#services" className="text-xs uppercase tracking-[0.16em]">
              {t.nav.services}
            </a>
            <a href="#sectors" className="text-xs uppercase tracking-[0.16em]">
              {t.nav.sectors}
            </a>
            <a href="#process" className="text-xs uppercase tracking-[0.16em]">
              {t.nav.process}
            </a>
            <a href="#contact" className="text-xs uppercase tracking-[0.16em]">
              {t.nav.contact}
            </a>
          </div>

          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-[11rem] items-center justify-center rounded-md px-3 py-2 text-center text-[10px] uppercase leading-tight tracking-[0.08em] md:max-w-none md:px-5 md:text-[11px] md:tracking-[0.12em]"
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

      <section className="relative flex min-h-[86svh] items-end overflow-hidden px-4 pb-10 pt-24 md:min-h-[92svh] md:px-8 md:pb-16 md:pt-28">
        <div
          className="absolute inset-0 bg-cover bg-[65%_center] md:bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(248,247,245,0.98) 0%, rgba(248,247,245,0.9) 52%, rgba(43,43,43,0.18) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F7F5] to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p
              className="mb-3 text-base md:mb-4 md:text-lg"
              style={{
                fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif",
                color: palette.accent,
              }}
            >
              {t.hero.badge}
            </p>
            <h1
              className="max-w-[18ch] text-[40px] leading-[1.04] sm:text-[54px] lg:text-[64px]"
              style={{
                fontFamily: "var(--font-bt-heading), Playfair Display, serif",
                letterSpacing: "0",
              }}
            >
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-[1.6] text-[#47433E] md:mt-6 md:text-[17px]">{t.hero.sub}</p>

            <div
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9"
              style={{ fontFamily: "var(--font-bt-ui), Montserrat, sans-serif" }}
            >
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-center text-xs uppercase tracking-[0.12em] sm:w-auto md:px-7 md:tracking-[0.14em]"
                style={{ background: palette.dark, color: palette.bg }}
              >
                {t.hero.primaryCta} <ArrowRight size={16} />
              </a>
              <a
                href="#services"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-6 py-3 text-center text-xs uppercase tracking-[0.12em] sm:w-auto md:px-7 md:tracking-[0.14em]"
                style={{ borderColor: palette.secondary, color: palette.dark, background: "rgba(248,247,245,0.72)" }}
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 md:mt-10 md:gap-3">
            {t.hero.markers.map((marker) => (
              <span
                key={marker}
                className="border px-3 py-2 text-[13px] md:px-4 md:text-sm"
                style={{
                  borderColor: "rgba(194,168,120,0.55)",
                  background: "rgba(248,247,245,0.7)",
                  color: palette.inkSoft,
                }}
              >
                {marker}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro badge={t.services.badge} title={t.services.title} />

          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5">
            {t.services.cards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-lg border p-5 md:p-7"
                  style={{
                    borderColor: palette.secondary,
                    background: "#FBFAF8",
                    boxShadow: "0 18px 40px rgba(43,43,43,0.06)",
                  }}
                >
                  <Icon size={20} color={palette.premium} />
                  <h3
                    className="mt-4 text-[28px] leading-[1.12] md:mt-5 md:text-[32px]"
                    style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif" }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[#55524C] md:text-[17px]">{card.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="sectors" className="px-4 py-14 md:px-8 md:py-20" style={{ background: "#F1EEE9" }}>
        <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
          <div>
            <SectionIntro badge={t.sectors.badge} title={t.sectors.title} />
            <div className="mt-6 grid gap-3 md:mt-8">
              {t.sectors.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 md:py-4"
                  style={{ borderColor: palette.secondary, background: palette.bg }}
                >
                  <Star size={14} color={palette.premium} fill={palette.premium} />
                  <span className="text-[16px] leading-snug md:text-[17px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="aspect-[4/5] rounded-lg bg-cover bg-center shadow-[0_18px_40px_rgba(43,43,43,0.12)] md:aspect-[3/4]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop')",
              }}
            />
            <div
              className="aspect-[4/5] rounded-lg bg-cover bg-center shadow-[0_18px_40px_rgba(43,43,43,0.12)] md:aspect-[3/4] md:mt-12"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop')",
              }}
            />
          </div>
        </div>
      </section>

      <section id="process" className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro badge={t.process.badge} title={t.process.title} />
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
            {t.process.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-lg border p-5 md:p-7"
                style={{ borderColor: palette.secondary, background: "#FBFAF8" }}
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm"
                  style={{
                    background: palette.dark,
                    color: palette.bg,
                    fontFamily: "var(--font-bt-ui), Montserrat, sans-serif",
                  }}
                >
                  0{index + 1}
                </span>
                <h3
                  className="mt-4 text-[28px] leading-[1.12] md:mt-5 md:text-[32px]"
                  style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-[16px] leading-[1.6] text-[#55524C] md:text-[17px]">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-8 md:py-20" style={{ background: palette.primary }}>
        <div className="mx-auto w-full max-w-7xl">
          <SectionIntro badge={t.testimonials.badge} title={t.testimonials.title} />
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
            {t.testimonials.quotes.map((quote) => (
              <blockquote
                key={quote}
                className="rounded-lg border p-5 md:p-7"
                style={{ borderColor: palette.secondary, background: palette.bg }}
              >
                <Quote size={18} color={palette.premium} />
                <p className="mt-4 text-[16px] leading-[1.6] text-[#4A4A4A] md:text-[17px]">{quote}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-10">
          <div>
            <SectionIntro badge={t.form.badge} title={t.form.title} />
            <p className="mt-4 max-w-xl text-[16px] leading-[1.6] text-[#55524C] md:mt-5 md:text-[17px]">{t.form.sub}</p>
            <p className="mt-6 text-sm md:mt-8" style={{ color: palette.accent }}>
              {t.form.altCta}{" "}
              <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                {t.form.altCtaLink}
              </a>
            </p>
          </div>

          <div
            className="rounded-lg border p-4 md:p-8"
            style={{ borderColor: palette.secondary, background: "#FBFAF8", boxShadow: "0 18px 40px rgba(43,43,43,0.08)" }}
          >
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto mb-5" size={42} color={palette.accent} />
                <h3
                  className="text-[34px] leading-[1.1]"
                  style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif" }}
                >
                  {t.form.successTitle}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-[16px] leading-[1.6] text-[#55524C] md:text-[17px]">{t.form.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 md:gap-5">
                <TextField
                  icon={UserRound}
                  label={t.form.fullName}
                  placeholder={t.form.placeholders.fullName}
                  value={formData.full_name}
                  onChange={(value) => setFormData((current) => ({ ...current, full_name: value }))}
                  required
                />
                <TextField
                  icon={Mail}
                  type="email"
                  label={t.form.email}
                  placeholder={t.form.placeholders.email}
                  value={formData.email}
                  onChange={(value) => setFormData((current) => ({ ...current, email: value }))}
                  required
                />
                <div className="md:col-span-2">
                  <TextField
                    icon={Building2}
                    label={t.form.businessName}
                    placeholder={t.form.placeholders.businessName}
                    value={formData.business_name}
                    onChange={(value) => setFormData((current) => ({ ...current, business_name: value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#6A655D] md:text-xs md:tracking-[0.14em]">
                    <MessageSquareText size={14} color={palette.premium} />
                    {t.form.message}
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={t.form.placeholders.message}
                    value={formData.message}
                    onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                    className="w-full resize-none rounded-md border bg-[#F8F7F5] px-4 py-3 text-[16px] outline-none transition placeholder:text-[#8B867E] focus:border-[#8A8F7A]"
                    style={{ borderColor: palette.secondary }}
                  />
                </div>

                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:col-span-2">
                    {error}
                  </div>
                ) : null}

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-4 text-xs uppercase tracking-[0.1em] transition disabled:opacity-60 md:px-7 md:tracking-[0.14em]"
                    style={{
                      background: palette.dark,
                      color: palette.bg,
                      fontFamily: "var(--font-bt-ui), Montserrat, sans-serif",
                    }}
                  >
                    {loading ? t.form.sending : t.form.submit} <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-7 md:px-8 md:py-8" style={{ borderColor: palette.secondary, background: "#F4F2ED" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <a href={localizePath(locale, "/bt")} className="flex items-center" aria-label="EZWebOne BT">
            <Image
              src={BRAND_LOGO_MARK_LIGHT_SRC}
              alt="EZWebOne"
              width={76}
              height={76}
              className="h-12 w-12 object-contain md:h-14 md:w-14"
            />
          </a>
          <p className="max-w-sm text-sm leading-6 text-[#5A5A5A] md:max-w-none">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({ badge, title }: { badge: string; title: string }) {
  return (
    <>
      <p
        className="mb-2 text-base md:mb-3 md:text-lg"
        style={{ fontFamily: "var(--font-bt-subheading), Cormorant Garamond, serif", color: palette.accent }}
      >
        {badge}
      </p>
      <h2
        className="max-w-4xl text-[30px] leading-[1.12] md:text-[40px]"
        style={{ fontFamily: "var(--font-bt-heading), Playfair Display, serif", letterSpacing: "0" }}
      >
        {title}
      </h2>
    </>
  );
}

function TextField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  icon: typeof UserRound;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#6A655D] md:text-xs md:tracking-[0.14em]">
        <Icon size={14} color={palette.premium} />
        {label}
      </label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border bg-[#F8F7F5] px-4 py-3 text-[16px] outline-none transition placeholder:text-[#8B867E] focus:border-[#8A8F7A]"
        style={{ borderColor: palette.secondary }}
      />
    </div>
  );
}

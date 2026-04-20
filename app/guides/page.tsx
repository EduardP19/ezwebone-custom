"use client";

import * as React from "react";
import Image from "next/image";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { FaqSection } from "@/components/guides/FaqSection";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import { getLocaleFromPathname, localizePath } from "@/lib/i18n/config";
import { Check, CircleAlert, Search, Mail, CalendarCheck, ArrowRight } from "lucide-react";
import { SuccessSection } from "@/components/sections/SuccessSection";

type ResolveResponse = {
  ok: boolean;
  error?: string;
  code?: string;
  companyName?: string;
};

type ClaimResponse = {
  ok: boolean;
  error?: string;
  guideUrl?: string;
};

type Testimonial = {
  name: string;
  quote: string;
  image: string;
};

export default function GuidesPage() {
  const { locale } = useI18n();
  const isRo = locale === "ro";

  const copy = {
    title: isRo
      ? "Cum sa iti cresti business-ul in beauty, chiar daca pornesti de la zero"
      : "How to grow your beauty business, even if you're starting from zero",
    subtitle: isRo
      ? "Un ghid practic pentru o prezenta online corecta si atragere de clienti, fara dependente."
      : "A practical guide to build the right online presence and attract clients without dependency.",
    bullets: isRo
      ? [
          "Ce ai nevoie cu adevarat la inceput",
          "Ce poti face singur si ce nu",
          "Cum atragi primii clienti fara bugete mari",
          "Cum eviti dependenta de Google/FB Ads",
        ]
      : [
          "What you really need at the start",
          "What you can do yourself and what to outsource",
          "How to attract first clients without huge budgets",
          "How to avoid dependency on Google/FB Ads",
        ],
    codePlaceholder: isRo ? "Cod unic" : "Unique code",
    checkButtonIdle: isRo ? "Descarca Gratuit Ghidul" : "Download Free Guide",
    checkButtonLoading: isRo ? "Verificam codul..." : "Checking code...",
    helper: isRo ? "Ghid practic, nu teorie" : "Practical guide, not theory",
    validPrefix: isRo ? "Cod valid pentru" : "Valid code for",

    learnTitle: isRo ? "Ce vei invata din ghid" : "What you'll learn in the guide",
    learnSubtitle: isRo
      ? "Pasii esentiali pentru a porni si creste corect un business in UK."
      : "Essential steps to start and grow your UK business the right way.",
    feature1Title: isRo ? "Fundamentul corect" : "The right foundation",
    feature1Body: isRo
      ? "Cum sa construiesti baza online a business-ului tau, fara sa pierzi timp sau bani pe lucruri inutile."
      : "How to build your online foundation without wasting time or budget on low-impact tasks.",
    feature2Title: isRo ? "Atragere clienti locali" : "Attract local clients",
    feature2Body: isRo
      ? "Cum sa fii gasit de clienti in Google si online, chiar daca nu ai inca un brand cunoscut."
      : "How local prospects can find you in Google and online, even if your brand is still growing.",
    feature3Title: isRo ? "Programari directe" : "Direct bookings",
    feature3Body: isRo
      ? "Cum sa transformi interesul in programari, fara comisioane mari si fara dependenta de platforme."
      : "How to turn interest into direct bookings without platform fees and dependency.",
    clarityCta: isRo ? "Vrei claritate aplicata situatiei tale?" : "Want clear next steps for your exact situation?",
    callBtn: isRo ? "Programeaza Apel Gratuit" : "Book a Free Call",
    noPressure: isRo ? "Fara obligatii" : "No pressure",

    comparisonTitle: isRo ? "De ce business-urile beauty se blocheaza?" : "Why beauty businesses get stuck",
    comparisonSubtitle: isRo
      ? "Diferenta dintre o afacere care creste constant si una care depinde de noroc."
      : "The difference between stable growth and results that depend on luck.",
    healthyTitle: isRo ? "Crestere sanatoasa" : "Healthy growth",
    healthyItems: isRo
      ? [
          "Website propriu, simplu",
          "Vizibilitate locala in Google",
          "Programari directe",
          "Control asupra clientilor",
          "Costuri predictibile",
        ]
      : [
          "Simple, owned website",
          "Local Google visibility",
          "Direct bookings",
          "Control over customer data",
          "Predictable costs",
        ],
    unstableTitle: isRo ? "Crestere instabila" : "Unstable growth",
    unstableItems: isRo
      ? [
          "Dependenta de o singura platforma",
          "Comisioane mari",
          "Lipsa de control",
          "Social media fara strategie",
          "Mult efort, putine rezultate",
        ]
      : [
          "Dependency on one platform",
          "High commissions",
          "Lack of control",
          "Social media without strategy",
          "High effort, low return",
        ],

    supportTitle: isRo ? "Suport Total Pentru Prezenta Ta Online" : "Full Support For Your Online Presence",
    supportSubtitle: isRo
      ? "O gama de servicii pentru a-ti imbunatati website-ul, SEO-ul si campaniile."
      : "A complete service stack to improve your website, SEO, and campaigns.",
    supportItems: isRo
      ? [
          {
            title: "Dezvoltare Web & Design",
            body: "Website-uri personalizate, construite de la zero folosind cele mai noi tehnologii si bune practici.",
          },
          {
            title: "Landing Pages",
            body: "Pagini mini cu obiectiv clar pentru cod email, reclame sau recomandari.",
          },
          {
            title: "Optimizare SEO",
            body: "SEO practic integrat pentru a urca site-ul tau in rezultatele Google.",
          },
          {
            title: "AI Agentic & Automatizare",
            body: "Agenti AI si fluxuri de automatizare care raspund rapid, filtreaza lead-uri si reduc munca repetitiva.",
          },
          {
            title: "Marketing & Integrari",
            body: "Conecteaza website-ul cu postari automate, tracking si retargeting pentru crestere constanta.",
          },
        ]
      : [
          {
            title: "Web Development & Design",
            body: "Custom websites built from scratch using modern technologies and conversion-focused structure.",
          },
          {
            title: "Landing Pages",
            body: "Focused pages for guide downloads, ads, or referral traffic with clean conversion paths.",
          },
          {
            title: "SEO Optimization",
            body: "Practical SEO setup so your business is discoverable for local intent and high-value services.",
          },
          {
            title: "AI Agentic & Automation",
            body: "AI agents and automation flows that respond faster, qualify leads, and reduce repetitive manual tasks.",
          },
          {
            title: "Marketing & Integrations",
            body: "Connect your website with automation, tracking, and retargeting for predictable growth.",
          },
        ],

    testimonialsTitle: isRo ? "Ce spun clientii nostri" : "What our clients say",
    testimonialsSubtitle: isRo ? "Rezultate reale de la business-uri reale." : "Real outcomes from real businesses.",
    testimonials: isRo
      ? [
          {
            name: "Mika Roberts",
            quote: "Sistemul ne-a oferit claritate imediata si programari mai bune.",
            image: "/clients/client1.png",
          },
          {
            name: "David Evans",
            quote: "Lead-urile sunt mai calitative si pierdem mai putin timp pe apeluri inutile.",
            image: "/clients/client2.png",
          },
          {
            name: "Sarah Taylor",
            quote: "Website-ul nou si automarile ne-au ajutat sa crestem constant, fara haos.",
            image: "/clients/client3.png",
          },
        ]
      : [
          {
            name: "Mika Roberts",
            quote: "The system gave us immediate clarity and better bookings.",
            image: "/clients/client1.png",
          },
          {
            name: "David Evans",
            quote: "Lead quality improved and we waste far less time on low-intent calls.",
            image: "/clients/client2.png",
          },
          {
            name: "Sarah Taylor",
            quote: "The new website and automations helped us grow steadily without chaos.",
            image: "/clients/client3.png",
          },
        ],

    finalTitle: isRo
      ? "Esti gata sa atragi mai multi clienti in fiecare luna?"
      : "Ready to attract more clients every month?",
    finalBody: isRo
      ? "Alatura-te business-urilor care isi construiesc o prezenta online solida si atrag clienti constant."
      : "Join service businesses building a stronger online presence and attracting clients consistently.",

    faqEzwTitle: isRo ? "Intrebari Generale" : "General FAQs",
    faqEzwSubtitle: isRo
      ? "Intrebari frecvente despre website-uri, automatizari si implementare."
      : "Common questions about websites, automation, and implementation.",
    faqBeautyTitle: isRo ? "FAQ Pentru Beauty" : "Beauty FAQs",
    faqBeautySubtitle: isRo
      ? "Intrebari dedicate saloanelor si business-urilor de beauty."
      : "Questions tailored for salons and beauty businesses.",

    modalTitle: isRo ? "Ghidul este gata" : "Your guide is ready",
    modalBody: isRo
      ? "Spune-ne unde sa il trimitem."
      : "Tell us where to send it.",
    firstName: isRo ? "Prenume" : "First name",
    email: "Email",
    cancel: isRo ? "Anuleaza" : "Cancel",
    sendGuide: isRo ? "Trimite ghidul" : "Send Guide",
    sending: isRo ? "Trimitem..." : "Sending...",
    invalidCode: isRo
      ? "Cod invalid. Verifica si incearca din nou."
      : "Invalid code. Please check and try again.",
    codeNotFound: isRo
      ? "Codul nu a fost gasit. Verifica si incearca din nou."
      : "Code not found. Please check and try again.",
    networkError: isRo ? "Eroare de retea. Incearca din nou." : "Network error. Please try again.",
    firstNameError: isRo ? "Te rugam sa introduci prenumele." : "Please enter your first name.",
    emailError: isRo ? "Te rugam sa introduci un email valid." : "Please enter a valid email.",
    claimError: isRo
      ? "Nu am putut trimite datele. Incearca din nou."
      : "Could not submit your details. Please try again.",
  };

  const [code, setCode] = React.useState("");
  const [isChecking, setIsChecking] = React.useState(false);
  const [checkError, setCheckError] = React.useState<string | null>(null);
  const [resolvedCompany, setResolvedCompany] = React.useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const localizeDestination = React.useCallback(
    (destination: string) => {
      if (typeof window === "undefined" || !destination) {
        return destination;
      }

      try {
        const url = new URL(destination, window.location.origin);
        if (url.origin !== window.location.origin) {
          return destination;
        }

        if (!getLocaleFromPathname(url.pathname)) {
          url.pathname = localizePath(locale, url.pathname);
        }

        return `${url.pathname}${url.search}${url.hash}`;
      } catch {
        return destination;
      }
    },
    [locale]
  );

  const getTrackingPayload = React.useCallback(() => {
    if (typeof window === "undefined") {
      return {
        landingUrl: "",
        trackingParams: {} as Record<string, string>,
      };
    }

    const url = new URL(window.location.href);
    const trackingParams = Object.fromEntries(url.searchParams.entries());

    return {
      landingUrl: url.toString(),
      trackingParams,
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    // Check for 'sent=1' parameter
    if (params.get("sent") === "1") {
      setIsSubmitted(true);
    }

    const queryCode = params.get("code");
    if (queryCode) {
      setCode(queryCode.toUpperCase());
    }

    const companyNumber =
      params.get("company_number") ??
      params.get("companyNumber") ??
      params.get("cn");

    const sourceHint =
      params.get("source") ??
      params.get("is_ro") ??
      params.get("ro") ??
      params.get("nationality");

    if (!companyNumber) return;

    void fetch("/api/guides/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyNumber,
        source: sourceHint,
      }),
    });
  }, []);

  async function handleCodeCheck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsChecking(true);
    setCheckError(null);
    setResolvedCompany(null);

    try {
      const response = await fetch("/api/guides/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const payload = (await response.json()) as ResolveResponse;
      if (!response.ok || !payload.ok) {
        if (response.status === 404) {
          setCheckError(copy.codeNotFound);
        } else if (response.status === 400) {
          setCheckError(copy.invalidCode);
        } else {
          setCheckError(payload.error ?? copy.networkError);
        }
        return;
      }

      setResolvedCompany(payload.companyName ?? null);
      setIsLeadModalOpen(true);
    } catch {
      setCheckError(copy.networkError);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleLeadCapture(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const tracking = getTrackingPayload();
      const response = await fetch("/api/guides/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          firstName,
          email,
          landingUrl: tracking.landingUrl,
          trackingParams: tracking.trackingParams,
        }),
      });

      const payload = (await response.json()) as ClaimResponse;
      if (!response.ok || !payload.ok) {
        if (response.status === 404) {
          setSubmitError(copy.codeNotFound);
        } else if (response.status === 400) {
          if (!firstName || firstName.trim().length < 2) {
            setSubmitError(copy.firstNameError);
          } else {
            setSubmitError(copy.emailError);
          }
        } else {
          setSubmitError(payload.error ?? copy.claimError);
        }
        return;
      }

      const destination = payload.guideUrl ?? "/guides?sent=1";
      window.location.assign(localizeDestination(destination));
    } catch {
      setSubmitError(copy.networkError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[color:var(--background)]">
      {isSubmitted ? (
        <SuccessSection />
      ) : (
        <section className="section-shell relative overflow-hidden bg-[linear-gradient(180deg,rgba(124,58,237,0.22)_0%,rgba(124,58,237,0.10)_60%,transparent_100%)] pb-28 pt-20 md:pb-36 md:pt-24">
          {/* Radial glow top-centre */}
          <div className="pointer-events-none absolute -top-16 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
          {/* Fade-out mask — clear visual end of section */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
          {/* 1px divider line */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-border)]" />

          <div className="relative mx-auto max-w-5xl px-4 text-center md:px-6">
            <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[color:var(--color-text-secondary)] md:text-lg">
              {copy.subtitle}
            </p>

            <div className="mx-auto mt-6 grid max-w-3xl gap-2 text-left sm:grid-cols-2">
              {copy.bullets.map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-[color:var(--color-text-primary)]">
                  <Check className="mt-0.5 h-4 w-4 text-[color:var(--color-primary)]" />
                  <span>{item}</span>
                </p>
              ))}
            </div>

            <form onSubmit={handleCodeCheck} className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder={copy.codePlaceholder}
                data-track-label="stampuser:guides-code-input"
                className="min-h-12 rounded-xl border border-[color:var(--color-border)] bg-white px-4 text-center text-base font-medium tracking-[0.12em] text-[#1C2A44] placeholder:text-[#1C2A44]/65 outline-none focus:border-orange-400/60"
              />
              <button
                type="submit"
                disabled={isChecking || code.trim().length === 0}
                data-track-label="stampuser:guides-code-submit"
                className="min-h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(249,115,22,0.32)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChecking ? copy.checkButtonLoading : copy.checkButtonIdle}
              </button>
              <p className="text-xs text-[color:var(--color-text-secondary)]">{copy.helper}</p>
            </form>

            {checkError ? <p className="mt-4 text-sm text-rose-600">{checkError}</p> : null}
            {resolvedCompany ? (
              <p className="mt-4 text-sm text-emerald-700">
                {copy.validPrefix} <span className="font-semibold">{resolvedCompany}</span>.
              </p>
            ) : null}
          </div>
        </section>
      )}

      <section className="section-shell py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {copy.learnTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {copy.learnSubtitle}
          </p>
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              { title: copy.feature1Title, body: copy.feature1Body, icon: Search },
              { title: copy.feature2Title, body: copy.feature2Body, icon: Mail },
              { title: copy.feature3Title, body: copy.feature3Body, icon: CalendarCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_14px_36px_rgba(28,42,68,0.08)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[color:var(--color-text-primary)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">{item.body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">{copy.clarityCta}</p>
            <a
              href={CALENDLY_BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              data-track-label="stampuser:guides-clarity-cta"
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-light)]"
            >
              {copy.callBtn}
            </a>
            <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">{copy.noPressure}</p>
          </div>
        </div>
      </section>

      <section className="section-shell border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-dark)] py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {copy.comparisonTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {copy.comparisonSubtitle}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_14px_36px_rgba(28,42,68,0.10)]">
              <h3 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">{copy.healthyTitle}</h3>
              <ul className="mt-4 space-y-2">
                {copy.healthyItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[color:var(--color-text-secondary)]">
                    <Check className="mt-0.5 h-4 w-4 text-[#F97316]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_14px_36px_rgba(28,42,68,0.10)]">
              <h3 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">{copy.unstableTitle}</h3>
              <ul className="mt-4 space-y-2">
                {copy.unstableItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[color:var(--color-text-secondary)]">
                    <CircleAlert className="mt-0.5 h-4 w-4 text-rose-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell bg-[linear-gradient(180deg,rgba(124,58,237,0.12),rgba(6,182,212,0.08))] py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {copy.supportTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {copy.supportSubtitle}
          </p>

          <article className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] md:grid-cols-[1fr_1fr]">
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {copy.supportItems.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-72 border-t border-[color:var(--color-border)] md:min-h-full md:border-l md:border-t-0">
              <Image
                src="/sections/workstation.jpeg"
                alt="Workstation setup"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {copy.testimonialsTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {copy.testimonialsSubtitle}
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(copy.testimonials as Testimonial[]).map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 shadow-[0_12px_30px_rgba(28,42,68,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <Image src={item.image} alt={item.name} width={42} height={42} className="rounded-full" />
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{item.name}</p>
                </div>
                <p className="mt-3 tracking-[0.08em] text-[#f59e0b] drop-shadow-[0_1px_8px_rgba(245,158,11,0.35)]">
                  ★★★★★
                </p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell border-y border-[color:var(--color-border)] bg-[linear-gradient(130deg,rgba(124,58,237,0.35),rgba(59,130,246,0.35))] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {copy.finalTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {copy.finalBody}
          </p>
          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            data-track-label="stampuser:guides-final-cta"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-5 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-light)]"
          >
            {copy.callBtn}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <FaqSection
        audience="ezwebone"
        locale={locale}
        title={copy.faqEzwTitle}
        subtitle={copy.faqEzwSubtitle}
      />
      <FaqSection
        audience="beauty"
        locale={locale}
        title={copy.faqBeautyTitle}
        subtitle={copy.faqBeautySubtitle}
      />

      {isLeadModalOpen ? (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(8,10,18,0.56)] px-4">
          <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6 shadow-[0_30px_90px_rgba(12,18,34,0.35)]">
            <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
              <span className="inline-flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                {copy.modalTitle}
              </span>
            </h3>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{copy.modalBody}</p>

            <form onSubmit={handleLeadCapture} className="mt-5 space-y-3">
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder={copy.firstName}
                className="min-h-11 w-full rounded-xl border border-[color:var(--color-border)] bg-white px-3.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-primary)]/60"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.email}
                type="email"
                className="min-h-11 w-full rounded-xl border border-[color:var(--color-border)] bg-white px-3.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-primary)]/60"
              />

              {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  data-track-label="stampuser:guides-modal-cancel"
                  className="min-h-11 flex-1 rounded-xl border border-[color:var(--color-border)] text-sm font-medium text-[color:var(--color-text-secondary)]"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-track-label="stampuser:guides-modal-submit"
                  className="min-h-11 flex-1 rounded-xl bg-[color:var(--color-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? copy.sending : copy.sendGuide}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

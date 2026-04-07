import {
  Bot,
  BriefcaseBusiness,
  Megaphone,
  Monitor,
  Rocket,
  Search,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export type ServiceItem = {
  title: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
};

type BusinessStage = {
  title: string;
  bundle: string;
  tagline: string;
  icon: LucideIcon;
};

type StatItem = {
  value: number;
  suffix: string;
  label: string;
};

type TestimonialItem = {
  name: string;
  business: string;
  quote: string;
  image: string;
};

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

const serviceIcons = [Monitor, Workflow, Bot, Megaphone, Search, Target] as const;
const businessStageIcons = [Rocket, BriefcaseBusiness, Bot] as const;

const siteContent = {
  en: {
    services: [
      {
        title: "Websites",
        description:
          "Custom-built websites that load fast, look premium, and convert visitors into paying customers. No templates. No WordPress. Tailored to your business.",
        shortDescription:
          "Custom websites that load fast, look premium, and turn visitors into paying customers.",
      },
      {
        title: "Automations",
        description:
          "We connect your tools and automate repetitive tasks - lead follow-ups, booking confirmations, invoicing - so you stop doing work a machine should do.",
        shortDescription:
          "We automate repetitive tasks like follow-ups, bookings, and admin so your team can move faster.",
      },
      {
        title: "AI Agents",
        description:
          "AI-powered assistants that answer calls, handle bookings, and respond to enquiries 24/7. Your business never sleeps, even when you do.",
        shortDescription:
          "AI assistants that answer faster, handle bookings, and stay available around the clock.",
      },
      {
        title: "Marketing",
        description:
          "Google Ads, Meta Ads, retargeting pixels, and analytics setup. We build the system that brings traffic to your door and tracks every click.",
        shortDescription:
          "Paid traffic systems built to bring in attention, track performance, and support real growth.",
      },
      {
        title: "SEO",
        description:
          "Technical SEO, on-page optimisation, and content structure that gets your business ranking on Google. Not promises - measurable results.",
        shortDescription:
          "SEO foundations and content structure designed to improve rankings and bring in better-fit traffic.",
      },
      {
        title: "Lead Generation",
        description:
          "Landing pages, lead capture forms, CRM integration, and follow-up automations. We build the full pipeline from stranger to customer.",
        shortDescription:
          "Landing pages, capture flows, and follow-up systems that help turn interest into enquiries.",
      },
    ],
    businessStages: [
      {
        title: "Starting Out",
        bundle: "Website + SEO setup",
        tagline: "Get found online",
      },
      {
        title: "Established",
        bundle: "Automations + CRM",
        tagline: "Work smarter",
      },
      {
        title: "Scaling Up",
        bundle: "AI agents + lead gen",
        tagline: "Grow without limits",
      },
    ],
    stats: [
      { value: 5, suffix: "", label: "Years Experience" },
      { value: 115, suffix: "+", label: "Business Partners" },
      { value: 154, suffix: "", label: "Websites Live" },
      { value: 6, suffix: "", label: "Countries" },
    ],
    testimonials: [
      {
        name: "Sophia Bennet",
        business: "Wedding Business",
        quote: "300% increase in online bookings in the first month.",
        image: "/clients/client2.png",
      },
      {
        name: "James Whitmore",
        business: "Corporate Events",
        quote: "Professional, fast, reliable. Perfectly represents our brand.",
        image: "/clients/client1.png",
      },
      {
        name: "Emily Turner",
        business: "Birthday Parties",
        quote: "Transformed our online presence. Drives real business results.",
        image: "/clients/client3.png",
      },
    ],
    processSteps: [
      {
        step: "1",
        title: "Discovery Call",
        description: "We learn your goals.",
      },
      {
        step: "2",
        title: "Design & Build",
        description: "We build your site.",
      },
      {
        step: "3",
        title: "Review & Refine",
        description: "You give feedback.",
      },
      {
        step: "4",
        title: "Launch & Grow",
        description: "You go live.",
      },
    ],
  },
  ro: {
    services: [
      {
        title: "Website-uri",
        description:
          "Website-uri construite custom, care se incarca rapid, arata premium si transforma vizitatorii in clienti platitori. Fara template-uri. Fara WordPress. Adaptate afacerii tale.",
        shortDescription:
          "Website-uri custom care se incarca rapid, arata premium si transforma vizitatorii in clienti.",
      },
      {
        title: "Automatizari",
        description:
          "Conectam uneltele tale si automatizam taskurile repetitive - follow-up pentru lead-uri, confirmari de programari, facturare - ca sa nu mai faci manual munca pe care ar trebui sa o faca un sistem.",
        shortDescription:
          "Automatizam taskurile repetitive precum follow-up-uri, programari si administrare ca echipa ta sa se miste mai repede.",
      },
      {
        title: "Agenti AI",
        description:
          "Asistenti alimentati de AI care raspund la apeluri, gestioneaza programari si raspund la cereri 24/7. Afacerea ta nu doarme, nici cand tu dormi.",
        shortDescription:
          "Asistenti AI care raspund mai repede, gestioneaza programari si raman disponibili non-stop.",
      },
      {
        title: "Marketing",
        description:
          "Google Ads, Meta Ads, pixeli de retargetare si setare de analytics. Construim sistemul care iti aduce trafic si urmareste fiecare click.",
        shortDescription:
          "Sisteme de trafic platit construite sa aduca atentie, sa masoare performanta si sa sustina cresterea reala.",
      },
      {
        title: "SEO",
        description:
          "SEO tehnic, optimizare on-page si structurare de continut care iti ajuta afacerea sa urce pe Google. Fara promisiuni goale - doar rezultate masurabile.",
        shortDescription:
          "Fundatii SEO si structurare de continut gandite sa imbunatateasca pozitionarea si sa aduca trafic mai potrivit.",
      },
      {
        title: "Generare de lead-uri",
        description:
          "Landing page-uri, formulare de captare, integrare CRM si automatizari de follow-up. Construim intregul pipeline de la necunoscut la client.",
        shortDescription:
          "Landing page-uri, fluxuri de captare si sisteme de follow-up care transforma interesul in cereri.",
      },
    ],
    businessStages: [
      {
        title: "La inceput",
        bundle: "Website + setup SEO",
        tagline: "Fii gasit online",
      },
      {
        title: "Deja stabilit",
        bundle: "Automatizari + CRM",
        tagline: "Lucreaza mai inteligent",
      },
      {
        title: "In crestere",
        bundle: "Agenti AI + lead gen",
        tagline: "Creste fara limite",
      },
    ],
    stats: [
      { value: 5, suffix: "", label: "Ani de experienta" },
      { value: 115, suffix: "+", label: "Parteneri de business" },
      { value: 154, suffix: "", label: "Website-uri lansate" },
      { value: 6, suffix: "", label: "Tari" },
    ],
    testimonials: [
      {
        name: "Sophia Bennet",
        business: "Business de nunti",
        quote: "O crestere de 300% a programarilor online in prima luna.",
        image: "/clients/client2.png",
      },
      {
        name: "James Whitmore",
        business: "Evenimente corporate",
        quote: "Profesional, rapid, de incredere. Reprezinta perfect brandul nostru.",
        image: "/clients/client1.png",
      },
      {
        name: "Emily Turner",
        business: "Petreceri aniversare",
        quote: "Ne-a transformat prezenta online. Aduce rezultate reale pentru afacere.",
        image: "/clients/client3.png",
      },
    ],
    processSteps: [
      {
        step: "1",
        title: "Apel de descoperire",
        description: "Iti intelegem obiectivele.",
      },
      {
        step: "2",
        title: "Design si build",
        description: "Construim website-ul tau.",
      },
      {
        step: "3",
        title: "Revizuire si rafinare",
        description: "Ne oferi feedback.",
      },
      {
        step: "4",
        title: "Lansare si crestere",
        description: "Intri live.",
      },
    ],
  },
} as const;

export function getServices(locale: Locale): ServiceItem[] {
  return siteContent[locale].services.map((item, index) => ({
    ...item,
    icon: serviceIcons[index],
  }));
}

export function getBusinessStages(locale: Locale): BusinessStage[] {
  return siteContent[locale].businessStages.map((item, index) => ({
    ...item,
    icon: businessStageIcons[index],
  }));
}

export function getStats(locale: Locale): StatItem[] {
  return siteContent[locale].stats.map((item) => ({ ...item }));
}

export function getTestimonials(locale: Locale): TestimonialItem[] {
  return siteContent[locale].testimonials.map((item) => ({ ...item }));
}

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return siteContent[locale].processSteps.map((item) => ({ ...item }));
}

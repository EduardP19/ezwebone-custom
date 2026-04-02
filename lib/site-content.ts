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

export type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const SERVICES: ServiceItem[] = [
  {
    title: "Websites",
    description:
      "Custom-built websites that load fast, look premium, and convert visitors into paying customers. No templates. No WordPress. Tailored to your business.",
    icon: Monitor,
  },
  {
    title: "Automations",
    description:
      "We connect your tools and automate repetitive tasks - lead follow-ups, booking confirmations, invoicing - so you stop doing work a machine should do.",
    icon: Workflow,
  },
  {
    title: "AI Agents",
    description:
      "AI-powered assistants that answer calls, handle bookings, and respond to enquiries 24/7. Your business never sleeps, even when you do.",
    icon: Bot,
  },
  {
    title: "Marketing",
    description:
      "Google Ads, Meta Ads, retargeting pixels, and analytics setup. We build the system that brings traffic to your door and tracks every click.",
    icon: Megaphone,
  },
  {
    title: "SEO",
    description:
      "Technical SEO, on-page optimisation, and content structure that gets your business ranking on Google. Not promises - measurable results.",
    icon: Search,
  },
  {
    title: "Lead Generation",
    description:
      "Landing pages, lead capture forms, CRM integration, and follow-up automations. We build the full pipeline from stranger to customer.",
    icon: Target,
  },
];

export const BUSINESS_STAGES = [
  {
    title: "Starting Out",
    bundle: "Website + SEO setup",
    tagline: "Get found online",
    icon: Rocket,
  },
  {
    title: "Established",
    bundle: "Automations + CRM",
    tagline: "Work smarter",
    icon: BriefcaseBusiness,
  },
  {
    title: "Scaling Up",
    bundle: "AI agents + lead gen",
    tagline: "Grow without limits",
    icon: Bot,
  },
];

export const STATS = [
  { value: 5, suffix: "", label: "Years Experience" },
  { value: 115, suffix: "+", label: "Business Partners" },
  { value: 154, suffix: "", label: "Websites Live" },
  { value: 6, suffix: "", label: "Countries" },
];

export const TESTIMONIALS = [
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
];

export const PROCESS_STEPS = [
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
];

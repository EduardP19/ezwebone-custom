"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";

const SERVICES_DETAIL = [
  {
    title: "Landing Pages",
    description: "Perfect mini-project for your big campaigns, whether it's cold emails, ads or referrals.",
    includes: [
      "High-conversion design focused on a single action",
      "Lightning-fast load times (< 1s)",
      "Mobile-first responsive layout",
      "Integrated lead capture form",
      "A/B testing ready structure",
      "Pixel and tracking integration",
    ],
  },
  {
    title: "SEO Optimization",
    description: "Built-in SEO best practices to help your site rank higher in search results.",
    includes: [
      "Comprehensive on-page SEO setup",
      "Semantic HTML5 structure",
      "Optimised meta titles and descriptions",
      "Image alt-text and compression",
      "XML Sitemap and robots.txt generation",
      "Google Search Console integration",
    ],
  },
  {
    title: "Marketing & Integrations",
    description: "Connect your website with automated social posting, pixel tracking, and ad retargeting to grow consistently.",
    includes: [
      "Meta Pixel and Google Tag Manager setup",
      "Automated social media posting hooks",
      "Email marketing (Mailchimp/Klaviyo) integration",
      "Ad campaign tracking and attribution",
      "CRM syncing (HubSpot/Salesforce)",
    ],
  },
  {
    title: "Leads Generation",
    description: "Boost website traffic and turn it into qualified leads and real opportunities.",
    includes: [
      "Strategic CTA placement for max conversion",
      "Interactive lead magnets and pop-ups",
      "Automated follow-up sequences",
      "Lead qualification logic",
      "Detailed traffic and conversion analytics",
    ],
  },
  {
    title: "Automations",
    description: "Streamline your business processes by automating repetitive tasks and workflows.",
    includes: [
      "Workflow mapping and bottleneck identification",
      "Zapier / Make.com integration",
      "Automated booking and scheduling (Calendly)",
      "Internal notification systems (Slack/Email)",
      "Custom business logic and API connections",
    ],
  },
  {
    title: "AI Agents",
    badge: "Powered by Resevia",
    description: "Put your enquiries on autopilot. Our AI agents answer questions and handle bookings 24/7.",
    includes: [
      "Custom-trained AI receptionist",
      "Multichannel support (Web, WhatsApp, Voice)",
      "Calendar and booking system sync",
      "Continuous learning and optimization",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-20 bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": SERVICES_DETAIL.map((service, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Service",
              "name": service.title,
              "description": service.description,
              "provider": {
                "@type": "Organization",
                "name": "EZWebOne"
              }
            }
          }))
        }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4">Our Services</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-black mb-6">
            What We Build
          </h1>
          <p className="text-xl text-brand-gray leading-relaxed">
            Every service we offer is designed to help your business get found, look credible, and convert more visitors into customers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SERVICES_DETAIL.map((service) => (
            <Card key={service.title} padding="sm" className="flex flex-col h-full border-2 hover:border-brand-purple/30 transition-all group">
              <div className="mb-6">
                {service.badge && <Badge className="mb-3">{service.badge}</Badge>}
                <h2 className="text-xl font-display font-bold text-brand-black mb-2 group-hover:text-brand-purple transition-colors">{service.title}</h2>
                {service.description && <p className="text-brand-gray text-xs leading-relaxed">{service.description}</p>}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-brand-black/80">
                    <Check className="text-brand-purple flex-shrink-0" size={16} />
                    <span className="text-xs">{item}</span>
                  </li>
                ))}
              </ul>

              <Button size="sm" className="w-full">Enquire Now</Button>
            </Card>
          ))}
        </div>

      </div>

      <FinalCTA variant="orange" />
    </div>
  );
}

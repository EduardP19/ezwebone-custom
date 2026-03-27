"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";

const STATS = [
  { label: "Projects Delivered", value: "110+" },
  { label: "Client Rating", value: "5.0" },
  { label: "Average Delivery", value: "5 Days" },
  { label: "Client Ownership", value: "100%" },
];

export default function AboutPage() {
  return (
    <div className="py-20 bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "EZWebOne",
          "image": "https://ezwebone.co.uk/logo.png",
          "@id": "https://ezwebone.co.uk",
          "url": "https://ezwebone.co.uk",
          "telephone": "", 
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "Hemel Hempstead",
            "addressRegion": "Hertfordshire",
            "postalCode": "",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 51.7527,
            "longitude": -0.4694
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          },
          "founder": {
            "@type": "Person",
            "name": "Eduard"
          }
        }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
          <div>
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-black mb-8">
              Small team. Big results.
            </h1>
            <div className="space-y-6 text-lg text-brand-gray leading-relaxed">
              <p>
                EZWebOne is a UK-based digital agency run by Eduard — a web designer and developer with a background in STEM and a focus on building fast, practical websites for small businesses.
              </p>
              <p>
                We started EZWebOne to solve a simple problem: most small businesses either can't afford a decent website or get locked into expensive contracts with agencies that don't deliver.
              </p>
              <p>
                We do things differently. You get a custom-built site, delivered in 5 days, with no contracts and full ownership from day one.
              </p>
              <p className="italic text-brand-black font-medium">
                We're based in Hemel Hempstead and work with clients across the UK. Currently expanding into AI automation via Resevia.
              </p>
            </div>
          </div>
          <div className="aspect-square bg-brand-warm rounded-3xl flex items-center justify-center p-12">
             <div className="text-center">
                <span className="font-display font-black text-9xl text-brand-purple opacity-20 italic">5</span>
                <p className="font-display font-bold text-3xl text-brand-black -mt-6">Days to live.</p>
             </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-y border-brand-border mb-20">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-display font-extrabold text-brand-black mb-2">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest font-bold text-brand-gray">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>

      <FinalCTA variant="purple" />
    </div>
  );
}

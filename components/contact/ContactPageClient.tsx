"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";

const FIELD_CLASS_NAME =
  "w-full rounded-2xl border border-brand-purple/20 bg-brand-purple/6 px-4 py-3 text-brand-purple-deep placeholder:text-brand-purple-deep/55 outline-none transition-colors focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15";

export function ContactPageClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      businessName: formData.get("businessName"),
      serviceInterest: formData.get("serviceInterest"),
      message: formData.get("message"),
      sourcePage: "Contact Page",
    };

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok) throw new Error("Failed to send message");

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div>
            <Badge className="mb-5">Contact</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-brand-black leading-[0.95] text-balance">
              Let&apos;s see what your brand should feel like at a higher level.
            </h1>
            <p className="mt-6 text-xl text-brand-gray leading-relaxed">
              Tell us about the business, the quality of clients you want more of, and where your current website is underselling you. We&apos;ll come back with a clearer direction.
            </p>

            <div className="mt-10 space-y-6">
              <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm p-7">
                <h2 className="font-display font-semibold text-3xl text-brand-black mb-3">Prefer a direct conversation?</h2>
                <p className="text-brand-gray mb-5 leading-relaxed">
                  If you already know you want a sharper website and clearer growth system, book a strategy call and skip the back-and-forth.
                </p>
                <Link href="#project-enquiry">
                  <Button className="bg-brand-black text-white hover:bg-black">Book strategy call</Button>
                </Link>
              </div>

              <div className="rounded-[1.75rem] border border-brand-border bg-white p-7">
                <p className="text-[11px] uppercase tracking-[0.24em] text-brand-gray mb-3">Best fit</p>
                <p className="text-brand-black leading-relaxed">
                  Founder-led service businesses, consultants, clinics, agencies, studios, and premium local brands that want better positioning and better-fit enquiries.
                </p>
              </div>
            </div>
          </div>

          <div id="project-enquiry">
          <Card padding="lg" className="border border-brand-border bg-white/95">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-warm text-brand-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-semibold text-brand-black mb-4">Message sent</h3>
                <p className="text-brand-gray mb-8">Thanks for reaching out. We&apos;ll review the details and reply within 24 hours.</p>
                <Button onClick={() => setSuccess(false)} variant="secondary">Send another message</Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <h2 className="text-3xl font-display font-semibold text-brand-black">Project enquiry</h2>
                  <p className="mt-2 text-brand-gray">
                    The more context you share, the more useful our response will be.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">First name *</label>
                    <input name="firstName" type="text" className={FIELD_CLASS_NAME} placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">Last name</label>
                    <input name="lastName" type="text" className={FIELD_CLASS_NAME} placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">Email address *</label>
                  <input name="email" type="email" className={FIELD_CLASS_NAME} placeholder="john@example.com" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">Phone number</label>
                    <input name="phone" type="tel" className={FIELD_CLASS_NAME} placeholder="07123 456789" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">Business name</label>
                    <input name="businessName" type="text" className={FIELD_CLASS_NAME} placeholder="Your business" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">What do you need most?</label>
                  <select name="serviceInterest" className={`${FIELD_CLASS_NAME} appearance-none`}>
                    <option>Premium website redesign</option>
                    <option>SEO and content growth</option>
                    <option>Automation and follow-up systems</option>
                    <option>AI reception / booking support</option>
                    <option>Not sure yet</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">Tell us about the business and the shift you want</label>
                  <textarea name="message" rows={5} className={FIELD_CLASS_NAME} placeholder="What is working, what is not, and what should feel different after the project?" />
                </div>

                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Sending..." : "Send enquiry"}
                </Button>
                <p className="text-center text-xs text-brand-gray">We only use your details to respond to your enquiry.</p>
              </form>
            )}
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

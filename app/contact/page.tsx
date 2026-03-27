"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export default function ContactPage() {
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
        body: JSON.stringify(data),
      });

      if (!resp.ok) throw new Error("Failed to send message");
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <Badge className="mb-4">Contact</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-black mb-6">
              Let's talk.
            </h1>
            <p className="text-xl text-brand-gray mb-12 leading-relaxed">
              Book a free 20-minute call or send us a message. We'll get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div className="p-8 bg-brand-warm rounded-2xl">
                 <h3 className="font-bold text-brand-black mb-2">Prefer to talk now?</h3>
                 <p className="text-brand-gray mb-6 text-sm">Book a call directly via Calendly to skip the form.</p>
                 <Button className="bg-brand-orange border-brand-orange text-white w-full sm:w-auto">Book a Call — Calendly</Button>
              </div>
            </div>
          </div>

          <div>
             <Card padding="lg" className="border-2">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-brand-black mb-4">Message Sent!</h3>
                    <p className="text-brand-gray mb-8">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                    <Button onClick={() => setSuccess(false)} variant="secondary">Send another message</Button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black uppercase tracking-wider">First Name *</label>
                        <input name="firstName" type="text" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Last Name</label>
                        <input name="lastName" type="text" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Email Address *</label>
                      <input name="email" type="email" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors" placeholder="john@example.com" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Phone Number</label>
                        <input name="phone" type="tel" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors" placeholder="07123 456789" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Business Name</label>
                        <input name="businessName" type="text" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors" placeholder="Your Business" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-black uppercase tracking-wider">I'm interested in</label>
                      <select name="serviceInterest" className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors bg-white">
                        <option>Website Build</option>
                        <option>SEO</option>
                        <option>Automation</option>
                        <option>AI Agent</option>
                        <option>Not sure yet</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Tell us about your project</label>
                      <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-brand-border focus:border-brand-blue outline-none transition-colors" placeholder="What can we help you with?"></textarea>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-center text-xs text-brand-gray">No spam. We'll only use your details to respond to your enquiry.</p>
                  </form>
                )}
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

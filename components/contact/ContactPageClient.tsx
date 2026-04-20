"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { CALENDLY_BOOKING_URL } from "@/lib/links";

const FIELD_CLASS_NAME =
  "w-full rounded-2xl border border-brand-purple/20 bg-brand-purple/6 px-4 py-3 text-brand-purple-deep placeholder:text-brand-purple-deep/55 outline-none transition-colors focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15";

export function ContactPageClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { dictionary } = useI18n();
  const copy = dictionary.pages.contact;

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
      const message = err instanceof Error ? err.message : copy.submitError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-[#F5F2ED]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div>
            <Badge className="mb-5">{copy.badge}</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-brand-black leading-[0.95] text-balance">
              {copy.title}
            </h1>
            <p className="mt-6 text-xl text-brand-gray leading-relaxed">
              {copy.body}
            </p>

            <div className="mt-10 space-y-6">
              <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm p-7">
                <h2 className="font-display font-semibold text-3xl text-brand-black mb-3">
                  {copy.directConversationTitle}
                </h2>
                <p className="text-brand-gray mb-5 leading-relaxed">
                  {copy.directConversationBody}
                </p>
                <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer">
                  <Button className="bg-brand-black text-white hover:bg-black">
                    {copy.directConversationCta}
                  </Button>
                </a>
              </div>

              <div className="rounded-[1.75rem] border border-brand-border bg-[#F5F2ED] p-7">
                <p className="text-[11px] uppercase tracking-[0.24em] text-brand-gray mb-3">
                  {copy.bestFitLabel}
                </p>
                <p className="text-brand-black leading-relaxed">
                  {copy.bestFitBody}
                </p>
              </div>
            </div>
          </div>

          <div id="project-enquiry">
            <Card padding="lg" className="border border-brand-border bg-[#F5F2ED]/95">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-brand-warm text-brand-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-brand-black mb-4">
                    {copy.successTitle}
                  </h3>
                  <p className="text-brand-gray mb-8">{copy.successBody}</p>
                  <Button onClick={() => setSuccess(false)} variant="secondary">
                    {copy.sendAnother}
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <h2 className="text-3xl font-display font-semibold text-brand-black">
                      {copy.enquiryTitle}
                    </h2>
                    <p className="mt-2 text-brand-gray">
                      {copy.enquiryBody}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                        {copy.fields.firstName}
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        className={FIELD_CLASS_NAME}
                        placeholder={copy.placeholders.firstName}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                        {copy.fields.lastName}
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        className={FIELD_CLASS_NAME}
                        placeholder={copy.placeholders.lastName}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                      {copy.fields.email}
                    </label>
                    <input
                      name="email"
                      type="email"
                      className={FIELD_CLASS_NAME}
                      placeholder={copy.placeholders.email}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                        {copy.fields.phone}
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        className={FIELD_CLASS_NAME}
                        placeholder={copy.placeholders.phone}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                        {copy.fields.businessName}
                      </label>
                      <input
                        name="businessName"
                        type="text"
                        className={FIELD_CLASS_NAME}
                        placeholder={copy.placeholders.businessName}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                      {copy.fields.serviceInterest}
                    </label>
                    <select name="serviceInterest" className={`${FIELD_CLASS_NAME} appearance-none`}>
                      {copy.serviceOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-black uppercase tracking-[0.16em]">
                      {copy.fields.message}
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      className={FIELD_CLASS_NAME}
                      placeholder={copy.placeholders.message}
                    />
                  </div>

                  {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? copy.sending : copy.sendEnquiry}
                  </Button>
                  <p className="text-center text-xs text-brand-gray">{copy.privacyNote}</p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

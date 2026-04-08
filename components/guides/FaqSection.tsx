"use client";

import * as React from "react";
import type { Locale } from "@/lib/i18n/config";

type Audience = "ezwebone" | "beauty";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqResponse = {
  ok: boolean;
  error?: string;
  items?: FaqItem[];
};

interface FaqSectionProps {
  audience: Audience;
  locale: Locale;
  title: string;
  subtitle: string;
}

export function FaqSection({ audience, locale, title, subtitle }: FaqSectionProps) {
  const [items, setItems] = React.useState<FaqItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    async function loadFaqs() {
      setError(null);
      try {
        const response = await fetch(`/api/faqs?audience=${audience}&locale=${locale}`);
        const payload = (await response.json()) as FaqResponse;

        if (!response.ok || !payload.ok) {
          if (!active) return;
          setError(payload.error ?? "Failed to load FAQs.");
          return;
        }

        if (!active) return;
        const nextItems = payload.items ?? [];
        setItems(nextItems);
        setOpenId(nextItems[0]?.id ?? null);
      } catch {
        if (!active) return;
        setError("Failed to load FAQs.");
      }
    }

    void loadFaqs();

    return () => {
      active = false;
    };
  }, [audience, locale]);

  return (
    <section className="section-shell py-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
          {subtitle}
        </p>

        <div className="mt-8 space-y-3">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_12px_30px_rgba(28,42,68,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-base font-semibold text-[color:var(--color-text-primary)]">
                    {item.question}
                  </span>
                  <span className="text-lg font-semibold text-[color:var(--color-primary)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <p className="border-t border-[color:var(--color-border)] px-5 py-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                    {item.answer}
                  </p>
                ) : null}
              </article>
            );
          })}

          {error ? <p className="text-center text-sm text-rose-600">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

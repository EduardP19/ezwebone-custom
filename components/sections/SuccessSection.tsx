"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CALENDLY_BOOKING_URL } from "@/lib/links";

export function SuccessSection() {
  return (
    <section className="section-shell relative min-h-[100svh] bg-[color:var(--color-bg-dark)] pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_srgb,var(--color-accent)_10%,transparent),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pb-20 md:px-6">
        <div className="grid w-full grid-cols-1 items-center gap-12 text-center">
          <Check className="mx-auto h-16 w-16 text-[color:var(--color-accent)]" />
          <h1 className="text-4xl font-bold text-white">Email on the way!</h1>
          <p className="text-lg text-[color:var(--color-text-secondary)]">
            Please check your spam folder if you don’t see it in your inbox.
          </p>
          <Button
            href={CALENDLY_BOOKING_URL}
            className="mt-6 bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-light)]"
          >
            Book a Call
          </Button>
        </div>
      </div>
    </section>
  );
}
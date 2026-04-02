import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: "Read the EZWebOne terms of service.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Badge className="mb-5">Terms</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-brand-black mb-6">Terms of Service</h1>
        <div className="space-y-5 text-brand-gray leading-relaxed">
          <p>Project scope, deliverables, timelines, and payment terms are agreed before any engagement begins.</p>
          <p>Unless otherwise agreed in writing, website content, assets, and access provided by the client remain the client&apos;s responsibility to review and approve.</p>
          <p>We aim to deliver high-quality work and clear communication throughout the engagement. Final timelines may vary if project scope changes or approvals are delayed.</p>
          <p>By using this website or engaging our services, you agree to these terms and any project-specific agreements shared during the engagement.</p>
        </div>
      </div>
    </div>
  );
}

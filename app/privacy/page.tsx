import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Read the EZWebOne privacy policy.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Badge className="mb-5">Privacy</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-brand-black mb-6">Privacy Policy</h1>
        <div className="space-y-5 text-brand-gray leading-relaxed">
          <p>We only collect the information needed to respond to enquiries, deliver services, and improve our website experience.</p>
          <p>Submitted contact details may be stored securely in our systems so we can reply, follow up on active enquiries, and maintain service records.</p>
          <p>Analytics and website event tracking may be used to understand page performance, traffic sources, and user interactions on the site.</p>
          <p>If you would like us to update or remove your personal data, contact us directly and we will handle the request promptly.</p>
        </div>
      </div>
    </div>
  );
}

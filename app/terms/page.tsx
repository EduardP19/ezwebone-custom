import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import {
  LEGAL_BUSINESS_NAME,
  LEGAL_COMPANY_STATEMENT,
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
} from "@/lib/legal";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms and Conditions of Use",
  description: "Read the EZWebOne terms and conditions of use for this website and our services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageShell
      badge="Terms"
      title={`Terms and Conditions of Use for ${LEGAL_BUSINESS_NAME}`}
      updatedOn={LEGAL_LAST_UPDATED}
      intro="Please read these terms carefully before using this website or engaging our services. By using our website or receiving services from us, you accept these terms."
    >
      <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm/60 p-6 leading-8 text-brand-gray">
        <p className="font-semibold text-brand-black">Important notice</p>
        <p className="mt-2">
          If you do not agree to these terms, please do not use this website or any
          services provided by {LEGAL_BUSINESS_NAME}. These terms work alongside any
          proposal, statement of work, or written service agreement we issue for a
          specific project. If there is a conflict, the service-specific agreement
          will take priority for that project.
        </p>
      </div>

      <LegalSection title="1. General">
        <p>
          These Terms and Conditions govern your use of the website and services
          provided by {LEGAL_BUSINESS_NAME}. {LEGAL_COMPANY_STATEMENT}
        </p>
        <p>
          By accessing or using the website or services, you agree to these terms
          and enter into a legally binding arrangement with us. If you do not agree,
          you must not use the website or services.
        </p>
      </LegalSection>

      <LegalSection title="2. What we do">
        <p>Our website and services may include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>free information and resources about websites, digital growth, and automation;</li>
          <li>paid services such as website design, website management, hosting coordination, maintenance, and custom digital solutions;</li>
          <li>automation, AI, lead-generation, and related implementation support for service businesses.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. What we do not do">
        <p>
          Content on this website is provided for general information only and should
          not be treated as legal, financial, regulatory, or other professional
          advice. You are responsible for your own decisions and should take
          independent advice where appropriate.
        </p>
        <p>
          We do not guarantee the completeness, availability, or suitability of any
          third-party tools, platforms, integrations, or information mentioned on the
          website. If our services involve AI-assisted workflows, automations, or
          generated outputs, you remain responsible for reviewing and approving the
          final result before relying on it.
        </p>
      </LegalSection>

      <LegalSection title="4. Privacy and cookies">
        <p>
          Please review our{" "}
          <Link href="/privacy" className="text-brand-purple underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookies" className="text-brand-purple underline underline-offset-4">
            Cookie Policy
          </Link>{" "}
          to understand how we collect, use, store, and protect your information, and
          how consent choices work on this website.
        </p>
      </LegalSection>

      <LegalSection title="5. External links and third-party platforms">
        <p>
          Our website may contain links to third-party websites, products, or
          services. We are not responsible for their content, security, terms, or
          privacy practices. If you use them, you do so on their terms.
        </p>
        <p>
          Some links may be affiliate links, which means we may receive a commission
          if you click through and make a purchase. This does not change the core
          content we publish or the services we recommend.
        </p>
        <p>
          If you link to our website, you must do so fairly and lawfully. You must
          not suggest any endorsement, approval, or association that does not exist,
          and you must not link from unlawful, misleading, offensive, or harmful
          content.
        </p>
      </LegalSection>

      <LegalSection title="6. Our content">
        <p>
          All content on this website, including text, graphics, branding, layouts,
          downloads, and other materials, is owned by us or licensed to us and is
          protected by intellectual property laws.
        </p>
        <p>
          You may not copy, distribute, adapt, republish, scrape, or reuse any part
          of the website without our prior written permission, except where the law
          allows this.
        </p>
      </LegalSection>

      <LegalSection title="7. Materials you submit to us">
        <p>
          You retain ownership of materials you send to us, such as enquiry
          information, project content, feedback, testimonials, or files. However, by
          sending materials to us, you confirm that you have the right to do so and
          grant us the rights we reasonably need to use, store, process, adapt, and
          share them for the purpose of responding to your enquiry, delivering
          services, operating the website, or showcasing approved work.
        </p>
        <p>
          You must not submit anything unlawful, infringing, abusive, misleading, or
          otherwise harmful. We may refuse to use or publish any material that we
          reasonably believe breaches these terms or applicable law.
        </p>
        <p>
          If you are under 16, you must have permission from a parent or guardian
          before submitting personal information or other content through this
          website.
        </p>
      </LegalSection>

      <LegalSection title="8. Paid services">
        <p>
          The scope of any paid service, including deliverables, timelines,
          responsibilities, and dependencies, will normally be set out in a proposal,
          quote, invoice, onboarding message, or separate service agreement.
        </p>
        <p>
          Fees are payable as stated in the relevant proposal or invoice. Unless we
          agree otherwise in writing, work may begin only after the required payment
          or deposit has been received.
        </p>
        <p>
          If you are a business customer and cancel within 24 hours of purchase, we
          will usually offer a full refund unless substantial work has already begun
          at your request. If you cancel after work has started, we may retain or
          charge a reasonable amount to reflect work completed, time reserved, or
          non-recoverable third-party costs.
        </p>
        <p>
          If you are a consumer purchasing services at a distance, nothing in these
          terms removes any cancellation or other rights you may have under
          applicable consumer law. Where you ask us to begin work during any cooling
          off period, you agree we may charge for the proportion of services supplied
          up to cancellation where the law allows.
        </p>
        <p>
          If we fail to deliver a paid service materially in line with the agreed
          scope, you may contact us within 30 days so we can investigate and offer a
          suitable remedy, which may include corrections, a replacement service, or a
          refund where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="9. Acceptance of terms">
        <p>
          By using this website or our services, you confirm that you are legally
          capable of entering into binding contracts under applicable law and that you
          agree to these terms.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to these terms">
        <p>
          We may update these terms from time to time. If we make material changes, we
          may notify you by email, through the website, or both. Your continued use
          of the website or services after updated terms are published constitutes
          acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Disclaimer of warranties">
        <p>
          We provide the website and services on an &quot;as is&quot; and &quot;as available&quot;
          basis. To the fullest extent permitted by law, we do not guarantee that the
          website, content, or services will always be available, uninterrupted,
          secure, accurate, or error-free.
        </p>
      </LegalSection>

      <LegalSection title="12. Limitation of liability">
        <p>
          To the fullest extent permitted by law, we will not be liable for indirect,
          incidental, special, or consequential loss, including loss of profits,
          revenue, business opportunities, goodwill, or data, arising from use of the
          website or services.
        </p>
        <p>
          We are also not responsible for delays, interruptions, or failures caused by
          third-party platforms, hosting providers, software suppliers, internet
          outages, malicious code, or events outside our reasonable control.
        </p>
        <p>
          Nothing in these terms excludes or limits liability that cannot lawfully be
          excluded, including liability for fraud, fraudulent misrepresentation, or
          death or personal injury caused by negligence.
        </p>
      </LegalSection>

      <LegalSection title="13. Prohibited conduct">
        <p>When using our website or services, you must not:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>engage in unlawful, fraudulent, or abusive activity;</li>
          <li>infringe our intellectual property rights or those of others;</li>
          <li>upload, submit, or distribute harmful, offensive, or harassing material;</li>
          <li>attempt to gain unauthorised access to our systems or interfere with our operations;</li>
          <li>use the website in a way that could impair its availability, performance, or security.</li>
        </ul>
      </LegalSection>

      <LegalSection title="14. Termination">
        <p>
          We may suspend or terminate access to the website or services at any time if
          we reasonably believe these terms have been breached, if payment obligations
          are not met, or if continuing the service would create legal, technical, or
          commercial risk.
        </p>
      </LegalSection>

      <LegalSection title="15. Governing law">
        <p>
          These terms are governed by the laws of England and Wales. Any dispute
          arising from these terms or your use of the website or services will be
          subject to the jurisdiction of the courts of England and Wales, unless
          mandatory law says otherwise.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact information">
        <p>If you have questions about these terms, contact us at:</p>
        <p className="text-brand-black">
          {LEGAL_BUSINESS_NAME}
          <br />
          {LEGAL_CONTACT_EMAIL}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

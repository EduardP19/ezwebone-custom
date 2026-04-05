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
  title: "Privacy Policy",
  description: "Read the EZWebOne privacy policy and learn how we handle enquiry, client, and analytics data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageShell
      badge="Privacy"
      title={`Privacy Policy for ${LEGAL_BUSINESS_NAME}`}
      updatedOn={LEGAL_LAST_UPDATED}
      intro="At EZWebONE, we aim to reduce the stress of managing your digital presence while protecting the information you share with us. This policy explains where personal information comes from, what we collect, how we use it, who we share it with, and the rights and choices available to you."
    >
      <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm/60 p-6 leading-8 text-brand-gray">
        <p className="font-semibold text-brand-black">What this policy explains</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>where we collect your personal information from;</li>
          <li>what personal information we collect;</li>
          <li>how and why we use it;</li>
          <li>who it may be shared with; and</li>
          <li>the rights and choices you have in relation to that information.</li>
        </ul>
      </div>

      <LegalSection title="1. What this policy covers">
        <p>
          This Privacy Policy applies to the EZWebONE website, our enquiry forms, our
          related digital tools, and the services we provide through our website and
          client workflows. In this policy, {LEGAL_BUSINESS_NAME}, &quot;we&quot;, &quot;us&quot;, and
          &quot;our&quot; refer to the business operating these services.
        </p>
        <p>
          {LEGAL_COMPANY_STATEMENT} We act as the data controller for personal
          information processed under this policy, which means we are responsible for
          deciding how and why it is used.
        </p>
        <p>
          When we refer to personal information, we mean information that identifies
          you directly, such as your name or email address, or indirectly, such as
          technical identifiers, device information, or records linked to your use of
          our services.
        </p>
      </LegalSection>

      <LegalSection title="2. Where we collect your personal information from">
        <p>
          The information we collect depends on how you interact with us. We may
          collect it:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>directly from you when you contact us, fill out a form, request a service, or send us project information;</li>
          <li>from your use of the website when you interact with pages, forms, or other features;</li>
          <li>from cookies, local storage, session storage, and similar technologies where these are used lawfully and, where required, with your consent;</li>
          <li>from client systems, platforms, or third-party tools you ask us to work with as part of website, automation, or AI-related services.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. What personal information we collect">
        <p>Depending on the service and your interaction with the site, we may collect:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>identity and contact details, such as your name, email address, phone number, and business name;</li>
          <li>enquiry and project details, such as your message, service interest, website details, domain information, and business requirements;</li>
          <li>communications and support records, including emails, call notes, and service history;</li>
          <li>content, files, credentials, integration details, or access permissions you choose to share during project delivery;</li>
          <li>technical and analytics data, such as page URLs, referrer data, campaign parameters, device and browser information, viewport details, language, timezone, and interaction events, where tracking has been accepted;</li>
          <li>administrative records relating to proposals, invoices, support, delivery, and compliance.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. How we use your personal information">
        <p>We use personal information to help us operate the site and deliver services effectively, including to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>respond to enquiries and discuss potential services;</li>
          <li>deliver website design, website management, hosting coordination, automation, AI, and related digital services;</li>
          <li>manage projects, support requests, onboarding, invoices, and service communications;</li>
          <li>maintain records, protect our systems, troubleshoot issues, and improve service delivery;</li>
          <li>measure website performance, campaign effectiveness, and on-site interactions where analytics consent has been given;</li>
          <li>comply with legal, tax, accounting, and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Why we process your personal information">
        <p>We process personal information only where we have a lawful basis to do so, including:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>contract, where processing is needed to provide the services you have requested or purchased;</li>
          <li>steps before contract, where you ask us for a quote, proposal, or consultation;</li>
          <li>legitimate interests, such as improving our services, keeping records, securing our systems, and understanding how the site performs;</li>
          <li>consent, where required for analytics, similar technologies, or optional communications;</li>
          <li>legal obligation, where we must retain or disclose information to comply with the law.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Use of children&apos;s information">
        <p>
          We do not knowingly collect or store personal information from children
          under 16 through this website. If you believe a child has provided personal
          information to us without appropriate consent, please contact us and we will
          investigate.
        </p>
      </LegalSection>

      <LegalSection title="7. Sharing your personal information">
        <p>
          We do not sell your personal information. We may share it where reasonably
          necessary with trusted suppliers and professional advisers who help us run
          the business and deliver services.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>technical providers that support hosting, databases, forms, email, domains, automations, analytics, or related infrastructure;</li>
          <li>contractors or collaborators working with us on a project where access is needed to deliver the agreed work;</li>
          <li>legal, regulatory, accounting, insurance, or other professional advisers where needed for compliance or protection of our business;</li>
          <li>a buyer, successor, or replacement operator if the business or its assets are sold or transferred, provided the information continues to be used consistently with this policy;</li>
          <li>courts, regulators, law enforcement, or other authorities where disclosure is required by law or reasonably necessary to establish, exercise, or defend legal claims.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Cookies and tracking technologies">
        <p>
          We use cookies and similar technologies, including local storage and session
          storage, to support the functionality and measurement of the site.
        </p>
        <p>
          Non-essential analytics features are not enabled unless you choose to accept
          them. If you accept analytics, we may store a session identifier, retain
          campaign attribution values, and record page views and click events to help
          us understand traffic sources and user journeys.
        </p>
        <p>
          For more information, including how to manage your preferences, please read
          our{" "}
          <Link href="/cookies" className="text-brand-purple underline underline-offset-4">
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. International transfers, retention, and security">
        <p>
          Some service providers we use may process personal information outside the
          UK. Where this happens, we aim to use appropriate safeguards required by
          applicable data protection law.
        </p>
        <p>
          We keep personal information only for as long as it is reasonably necessary
          for the purposes described in this policy, including handling enquiries,
          delivering services, maintaining records, resolving disputes, and meeting
          legal obligations.
        </p>
        <p>
          We take reasonable technical and organisational measures to protect personal
          information from unauthorised access, misuse, loss, alteration, or
          disclosure. However, no online system can be guaranteed to be completely
          secure.
        </p>
      </LegalSection>

      <LegalSection title="10. Your rights and choices">
        <p>Subject to applicable law, you may have rights to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>request access to the personal information we hold about you;</li>
          <li>ask us to correct inaccurate or incomplete information;</li>
          <li>ask us to erase your personal information in certain circumstances;</li>
          <li>ask us to restrict how we use your information;</li>
          <li>object to processing carried out on certain lawful bases, including some marketing-related processing;</li>
          <li>request portability of information where that right applies;</li>
          <li>withdraw consent at any time where we rely on consent, including for analytics preferences;</li>
          <li>complain to the Information Commissioner&apos;s Office if you believe your information has been handled unlawfully.</li>
        </ul>
        <p>
          To exercise your rights, please contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="11. How to contact us">
        <p>
          If you have questions about this Privacy Policy or want to make a privacy
          request, contact us at <span className="text-brand-black">{LEGAL_CONTACT_EMAIL}</span>.
        </p>
        <p className="text-brand-black">
          {LEGAL_BUSINESS_NAME}
          <br />
          {LEGAL_CONTACT_EMAIL}
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in
          our services, data practices, or legal requirements. The latest version
          will always be published on this page and the date at the top will show
          when it was last updated.
        </p>
        <p>
          If we make material changes, we may also notify you by email or through the
          website where appropriate.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

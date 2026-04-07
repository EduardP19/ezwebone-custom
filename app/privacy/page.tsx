import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import {
  LEGAL_BUSINESS_NAME,
  LEGAL_COMPANY_STATEMENT,
  LEGAL_CONTACT_EMAIL,
  getLegalLastUpdated,
} from "@/lib/legal";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.legal;

  return createMetadata({
    title: copy.privacyTitle,
    description: copy.privacyDescription,
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const isRo = locale === "ro";
  const updatedOn = getLegalLastUpdated(locale);

  return (
    <LegalPageShell
      badge={isRo ? "Confidentialitate" : "Privacy"}
      title={
        isRo
          ? `Politica de confidentialitate pentru ${LEGAL_BUSINESS_NAME}`
          : `Privacy Policy for ${LEGAL_BUSINESS_NAME}`
      }
      updatedOn={updatedOn}
      updatedLabel={isRo ? "Ultima actualizare" : "Last updated"}
      intro={
        isRo
          ? "La EZWebONE, vrem sa reducem stresul gestionarii prezentei tale digitale si sa protejam informatiile pe care ni le incredintezi. Aceasta politica explica de unde provin datele personale, ce colectam, cum le folosim, cu cine le putem partaja si ce drepturi si alegeri ai."
          : "At EZWebONE, we aim to reduce the stress of managing your digital presence while protecting the information you share with us. This policy explains where personal information comes from, what we collect, how we use it, who we share it with, and the rights and choices available to you."
      }
    >
      <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm/60 p-6 leading-8 text-brand-gray">
        <p className="font-semibold text-brand-black">
          {isRo ? "Ce explica aceasta politica" : "What this policy explains"}
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            {isRo
              ? "de unde colectam informatiile tale personale;"
              : "where we collect your personal information from;"}
          </li>
          <li>
            {isRo ? "ce informatii personale colectam;" : "what personal information we collect;"}
          </li>
          <li>{isRo ? "cum si de ce le folosim;" : "how and why we use it;"}</li>
          <li>
            {isRo ? "cu cine pot fi partajate; si" : "who it may be shared with; and"}
          </li>
          <li>
            {isRo
              ? "ce drepturi si alegeri ai in legatura cu aceste informatii."
              : "the rights and choices you have in relation to that information."}
          </li>
        </ul>
      </div>

      <LegalSection title={isRo ? "1. Ce acopera aceasta politica" : "1. What this policy covers"}>
        <p>
          {isRo
            ? `Aceasta Politica de confidentialitate se aplica website-ului EZWebONE, formularelor noastre de contact, uneltelor digitale asociate si serviciilor pe care le oferim prin website si fluxurile noastre de lucru cu clientii. In aceasta politica, ${LEGAL_BUSINESS_NAME}, "noi" si "nostru/noastra" se refera la afacerea care opereaza aceste servicii.`
            : `This Privacy Policy applies to the EZWebONE website, our enquiry forms, our related digital tools, and the services we provide through our website and client workflows. In this policy, ${LEGAL_BUSINESS_NAME}, "we", "us", and "our" refer to the business operating these services.`}
        </p>
        <p>
          {isRo
            ? `${LEGAL_COMPANY_STATEMENT} Actionam ca operator de date pentru informatiile personale prelucrate in baza acestei politici, ceea ce inseamna ca suntem responsabili sa decidem cum si de ce sunt folosite.`
            : `${LEGAL_COMPANY_STATEMENT} We act as the data controller for personal information processed under this policy, which means we are responsible for deciding how and why it is used.`}
        </p>
        <p>
          {isRo
            ? "Cand ne referim la informatii personale, ne referim la date care te identifica direct, precum numele sau adresa de email, ori indirect, precum identificatori tehnici, informatii despre dispozitiv sau inregistrari legate de utilizarea serviciilor noastre."
            : "When we refer to personal information, we mean information that identifies you directly, such as your name or email address, or indirectly, such as technical identifiers, device information, or records linked to your use of our services."}
        </p>
      </LegalSection>

      <LegalSection
        title={isRo ? "2. De unde colectam informatiile tale personale" : "2. Where we collect your personal information from"}
      >
        <p>
          {isRo
            ? "Informatiile pe care le colectam depind de modul in care interactionezi cu noi. Le putem colecta:"
            : "The information we collect depends on how you interact with us. We may collect it:"}
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            {isRo
              ? "direct de la tine atunci cand ne contactezi, completezi un formular, soliciti un serviciu sau ne trimiti informatii de proiect;"
              : "directly from you when you contact us, fill out a form, request a service, or send us project information;"}
          </li>
          <li>
            {isRo
              ? "din utilizarea website-ului atunci cand interactionezi cu pagini, formulare sau alte functionalitati;"
              : "from your use of the website when you interact with pages, forms, or other features;"}
          </li>
          <li>
            {isRo
              ? "din cookies, local storage, session storage si tehnologii similare atunci cand acestea sunt folosite legal si, unde este necesar, cu consimtamantul tau;"
              : "from cookies, local storage, session storage, and similar technologies where these are used lawfully and, where required, with your consent;"}
          </li>
          <li>
            {isRo
              ? "din sisteme ale clientilor, platforme sau unelte third-party cu care ne ceri sa lucram ca parte din servicii de website, automatizare sau AI."
              : "from client systems, platforms, or third-party tools you ask us to work with as part of website, automation, or AI-related services."}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={isRo ? "3. Ce informatii personale colectam" : "3. What personal information we collect"}>
        <p>
          {isRo
            ? "In functie de serviciu si de interactiunea ta cu site-ul, putem colecta:"
            : "Depending on the service and your interaction with the site, we may collect:"}
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            {isRo
              ? "date de identificare si contact, precum numele, adresa de email, numarul de telefon si numele afacerii;"
              : "identity and contact details, such as your name, email address, phone number, and business name;"}
          </li>
          <li>
            {isRo
              ? "detalii despre cerere si proiect, precum mesajul tau, interesul pentru servicii, detalii despre website, informatii de domeniu si cerinte de business;"
              : "enquiry and project details, such as your message, service interest, website details, domain information, and business requirements;"}
          </li>
          <li>
            {isRo
              ? "comunicari si inregistrari de suport, inclusiv emailuri, notite de apel si istoric de servicii;"
              : "communications and support records, including emails, call notes, and service history;"}
          </li>
          <li>
            {isRo
              ? "continut, fisiere, credentiale, detalii de integrare sau permisiuni de acces pe care alegi sa ni le oferi in timpul livrarii proiectului;"
              : "content, files, credentials, integration details, or access permissions you choose to share during project delivery;"}
          </li>
          <li>
            {isRo
              ? "date tehnice si de analytics, precum URL-uri de pagina, date despre referrer, parametri de campanie, informatii despre dispozitiv si browser, detalii despre viewport, limba, fus orar si evenimente de interactiune, acolo unde tracking-ul a fost acceptat;"
              : "technical and analytics data, such as page URLs, referrer data, campaign parameters, device and browser information, viewport details, language, timezone, and interaction events, where tracking has been accepted;"}
          </li>
          <li>
            {isRo
              ? "inregistrari administrative legate de propuneri, facturi, suport, livrare si conformitate."
              : "administrative records relating to proposals, invoices, support, delivery, and compliance."}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={isRo ? "4. Cum folosim informatiile tale personale" : "4. How we use your personal information"}>
        <p>
          {isRo
            ? "Folosim informatiile personale pentru a opera site-ul si a livra serviciile eficient, inclusiv pentru a:"
            : "We use personal information to help us operate the site and deliver services effectively, including to:"}
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>{isRo ? "raspunde cererilor si discuta servicii potentiale;" : "respond to enquiries and discuss potential services;"}</li>
          <li>
            {isRo
              ? "livra servicii de web design, management de website, coordonare hosting, automatizare, AI si alte servicii digitale asociate;"
              : "deliver website design, website management, hosting coordination, automation, AI, and related digital services;"}
          </li>
          <li>
            {isRo
              ? "gestiona proiecte, solicitari de suport, onboarding, facturi si comunicari de serviciu;"
              : "manage projects, support requests, onboarding, invoices, and service communications;"}
          </li>
          <li>
            {isRo
              ? "mentine evidenta, proteja sistemele noastre, investiga probleme si imbunatati livrarea serviciilor;"
              : "maintain records, protect our systems, troubleshoot issues, and improve service delivery;"}
          </li>
          <li>
            {isRo
              ? "masura performanta website-ului, eficienta campaniilor si interactiunile din site atunci cand consimtamantul pentru analytics a fost acordat;"
              : "measure website performance, campaign effectiveness, and on-site interactions where analytics consent has been given;"}
          </li>
          <li>
            {isRo
              ? "respecta obligatii legale, fiscale, contabile si de reglementare."
              : "comply with legal, tax, accounting, and regulatory obligations."}
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        title={isRo ? "5. De ce prelucram informatiile tale personale" : "5. Why we process your personal information"}
      >
        <p>
          {isRo
            ? "Prelucram informatiile personale doar atunci cand avem un temei legal pentru asta, inclusiv:"
            : "We process personal information only where we have a lawful basis to do so, including:"}
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            {isRo
              ? "contract, atunci cand prelucrarea este necesara pentru a oferi serviciile pe care le-ai solicitat sau cumparat;"
              : "contract, where processing is needed to provide the services you have requested or purchased;"}
          </li>
          <li>
            {isRo
              ? "demersuri precontractuale, atunci cand ne ceri o oferta, o propunere sau o consultatie;"
              : "steps before contract, where you ask us for a quote, proposal, or consultation;"}
          </li>
          <li>
            {isRo
              ? "interese legitime, precum imbunatatirea serviciilor, pastrarea evidentelor, securizarea sistemelor si intelegerea modului in care performeaza site-ul;"
              : "legitimate interests, such as improving our services, keeping records, securing our systems, and understanding how the site performs;"}
          </li>
          <li>
            {isRo
              ? "consimtamant, atunci cand este necesar pentru analytics, tehnologii similare sau comunicari optionale;"
              : "consent, where required for analytics, similar technologies, or optional communications;"}
          </li>
          <li>
            {isRo
              ? "obligatie legala, atunci cand trebuie sa pastram sau sa divulgam informatii pentru a respecta legea."
              : "legal obligation, where we must retain or disclose information to comply with the law."}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={isRo ? "6. Utilizarea informatiilor despre copii" : "6. Use of children's information"}>
        <p>
          {isRo
            ? "Nu colectam si nu stocam intentionat informatii personale de la copii sub 16 ani prin acest website. Daca crezi ca un copil ne-a furnizat informatii personale fara consimtamantul corespunzator, te rugam sa ne contactezi si vom investiga."
            : "We do not knowingly collect or store personal information from children under 16 through this website. If you believe a child has provided personal information to us without appropriate consent, please contact us and we will investigate."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "7. Partajarea informatiilor tale personale" : "7. Sharing your personal information"}>
        <p>
          {isRo
            ? "Nu vindem informatiile tale personale. Le putem partaja, acolo unde este rezonabil necesar, cu furnizori de incredere si consilieri profesionisti care ne ajuta sa operam afacerea si sa livram servicii."
            : "We do not sell your personal information. We may share it where reasonably necessary with trusted suppliers and professional advisers who help us run the business and deliver services."}
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            {isRo
              ? "furnizori tehnici care sustin hostingul, bazele de date, formularele, emailul, domeniile, automatizarile, analytics-ul sau infrastructura asociata;"
              : "technical providers that support hosting, databases, forms, email, domains, automations, analytics, or related infrastructure;"}
          </li>
          <li>
            {isRo
              ? "contractori sau colaboratori care lucreaza cu noi la un proiect atunci cand accesul este necesar pentru livrarea muncii convenite;"
              : "contractors or collaborators working with us on a project where access is needed to deliver the agreed work;"}
          </li>
          <li>
            {isRo
              ? "consilieri juridici, de reglementare, contabili, de asigurari sau alti profesionisti atunci cand este necesar pentru conformitate sau pentru protectia afacerii noastre;"
              : "legal, regulatory, accounting, insurance, or other professional advisers where needed for compliance or protection of our business;"}
          </li>
          <li>
            {isRo
              ? "un cumparator, succesor sau operator inlocuitor daca afacerea sau activele sale sunt vandute ori transferate, cu conditia ca informatiile sa continue sa fie folosite in mod consecvent cu aceasta politica;"
              : "a buyer, successor, or replacement operator if the business or its assets are sold or transferred, provided the information continues to be used consistently with this policy;"}
          </li>
          <li>
            {isRo
              ? "instante, autoritati de reglementare, forte de ordine sau alte autoritati atunci cand divulgarea este ceruta de lege sau este rezonabil necesara pentru a formula, exercita sau apara pretentii legale."
              : "courts, regulators, law enforcement, or other authorities where disclosure is required by law or reasonably necessary to establish, exercise, or defend legal claims."}
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        title={isRo ? "8. Cookies si tehnologii de tracking" : "8. Cookies and tracking technologies"}
      >
        <p>
          {isRo
            ? "Folosim cookies si tehnologii similare, inclusiv local storage si session storage, pentru a sustine functionalitatea si masurarea site-ului."
            : "We use cookies and similar technologies, including local storage and session storage, to support the functionality and measurement of the site."}
        </p>
        <p>
          {isRo
            ? "Functiile de analytics neesentiale nu sunt activate decat daca alegi sa le accepti. Daca accepti analytics, putem stoca un identificator de sesiune, retine valori de atribuire a campaniilor si inregistra page view-uri si evenimente de click pentru a intelege sursele de trafic si parcursurile utilizatorilor."
            : "Non-essential analytics features are not enabled unless you choose to accept them. If you accept analytics, we may store a session identifier, retain campaign attribution values, and record page views and click events to help us understand traffic sources and user journeys."}
        </p>
        <p>
          {isRo
            ? "Pentru mai multe informatii, inclusiv despre cum iti poti gestiona preferintele, citeste "
            : "For more information, including how to manage your preferences, please read our "}
          <Link
            href={localizePath(locale, "/cookies")}
            className="text-brand-purple underline underline-offset-4"
          >
            {isRo ? "Politica de cookie-uri" : "Cookie Policy"}
          </Link>
          {isRo ? "." : "."}
        </p>
      </LegalSection>

      <LegalSection
        title={
          isRo
            ? "9. Transferuri internationale, pastrare si securitate"
            : "9. International transfers, retention, and security"
        }
      >
        <p>
          {isRo
            ? "Unii furnizori de servicii pe care ii folosim pot prelucra informatii personale in afara UK-ului. Cand se intampla asta, incercam sa folosim garantiile adecvate cerute de legislatia aplicabila privind protectia datelor."
            : "Some service providers we use may process personal information outside the UK. Where this happens, we aim to use appropriate safeguards required by applicable data protection law."}
        </p>
        <p>
          {isRo
            ? "Pastram informatiile personale doar atat timp cat este rezonabil necesar pentru scopurile descrise in aceasta politica, inclusiv gestionarea cererilor, livrarea serviciilor, mentinerea evidentelor, rezolvarea disputelor si respectarea obligatiilor legale."
            : "We keep personal information only for as long as it is reasonably necessary for the purposes described in this policy, including handling enquiries, delivering services, maintaining records, resolving disputes, and meeting legal obligations."}
        </p>
        <p>
          {isRo
            ? "Luam masuri tehnice si organizatorice rezonabile pentru a proteja informatiile personale impotriva accesului neautorizat, utilizarii abuzive, pierderii, modificarii sau divulgarii. Totusi, niciun sistem online nu poate fi garantat ca fiind complet sigur."
            : "We take reasonable technical and organisational measures to protect personal information from unauthorised access, misuse, loss, alteration, or disclosure. However, no online system can be guaranteed to be completely secure."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "10. Drepturile si alegerile tale" : "10. Your rights and choices"}>
        <p>{isRo ? "In functie de legislatia aplicabila, poti avea dreptul sa:" : "Subject to applicable law, you may have rights to:"}</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>{isRo ? "soliciti acces la informatiile personale pe care le detinem despre tine;" : "request access to the personal information we hold about you;"}</li>
          <li>{isRo ? "ne ceri sa corectam informatii inexacte sau incomplete;" : "ask us to correct inaccurate or incomplete information;"}</li>
          <li>{isRo ? "ne ceri sa stergem informatiile tale personale in anumite circumstante;" : "ask us to erase your personal information in certain circumstances;"}</li>
          <li>{isRo ? "ne ceri sa restrictionam modul in care folosim informatiile tale;" : "ask us to restrict how we use your information;"}</li>
          <li>{isRo ? "te opui prelucrarii efectuate pe anumite temeiuri legale, inclusiv unor prelucrari legate de marketing;" : "object to processing carried out on certain lawful bases, including some marketing-related processing;"}</li>
          <li>{isRo ? "soliciti portabilitatea informatiilor acolo unde acest drept se aplica;" : "request portability of information where that right applies;"}</li>
          <li>{isRo ? "retragi consimtamantul in orice moment atunci cand ne bazam pe consimtamant, inclusiv pentru preferintele de analytics;" : "withdraw consent at any time where we rely on consent, including for analytics preferences;"}</li>
          <li>{isRo ? "depui o plangere la Information Commissioner's Office daca consideri ca informatiile tale au fost gestionate ilegal." : "complain to the Information Commissioner's Office if you believe your information has been handled unlawfully."}</li>
        </ul>
        <p>
          {isRo
            ? "Pentru a-ti exercita drepturile, te rugam sa ne contactezi folosind detaliile de mai jos."
            : "To exercise your rights, please contact us using the details below."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "11. Cum ne poti contacta" : "11. How to contact us"}>
        <p>
          {isRo ? "Daca ai intrebari despre aceasta Politica de confidentialitate sau vrei sa faci o solicitare privind confidentialitatea, contacteaza-ne la " : "If you have questions about this Privacy Policy or want to make a privacy request, contact us at "}
          <span className="text-brand-black">{LEGAL_CONTACT_EMAIL}</span>.
        </p>
        <p className="text-brand-black">
          {LEGAL_BUSINESS_NAME}
          <br />
          {LEGAL_CONTACT_EMAIL}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "12. Modificari ale acestei politici" : "12. Changes to this policy"}>
        <p>
          {isRo
            ? "Putem actualiza aceasta Politica de confidentialitate din cand in cand pentru a reflecta schimbari in servicii, practicile noastre privind datele sau cerintele legale. Cea mai recenta versiune va fi publicata intotdeauna pe aceasta pagina, iar data din partea de sus va arata cand a fost actualizata ultima data."
            : "We may update this Privacy Policy from time to time to reflect changes in our services, data practices, or legal requirements. The latest version will always be published on this page and the date at the top will show when it was last updated."}
        </p>
        <p>
          {isRo
            ? "Daca facem schimbari semnificative, te putem notifica si prin email sau prin website, acolo unde este potrivit."
            : "If we make material changes, we may also notify you by email or through the website where appropriate."}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

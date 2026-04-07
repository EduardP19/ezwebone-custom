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
    title: copy.termsTitle,
    description: copy.termsDescription,
    path: "/terms",
    locale,
  });
}

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const isRo = locale === "ro";
  const updatedOn = getLegalLastUpdated(locale);

  return (
    <LegalPageShell
      badge={isRo ? "Termeni" : "Terms"}
      title={
        isRo
          ? `Termeni si conditii de utilizare pentru ${LEGAL_BUSINESS_NAME}`
          : `Terms and Conditions of Use for ${LEGAL_BUSINESS_NAME}`
      }
      updatedOn={updatedOn}
      updatedLabel={isRo ? "Ultima actualizare" : "Last updated"}
      intro={
        isRo
          ? "Te rugam sa citesti cu atentie acesti termeni inainte sa folosesti acest website sau sa colaborezi cu noi. Prin utilizarea website-ului sau prin primirea de servicii din partea noastra, accepti acesti termeni."
          : "Please read these terms carefully before using this website or engaging our services. By using our website or receiving services from us, you accept these terms."
      }
    >
      <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm/60 p-6 leading-8 text-brand-gray">
        <p className="font-semibold text-brand-black">
          {isRo ? "Notificare importanta" : "Important notice"}
        </p>
        <p className="mt-2">
          {isRo
            ? `Daca nu esti de acord cu acesti termeni, te rugam sa nu folosesti acest website sau serviciile oferite de ${LEGAL_BUSINESS_NAME}. Acesti termeni functioneaza impreuna cu orice propunere, statement of work sau acord scris de servicii pe care il emitem pentru un proiect specific. Daca apare un conflict, acordul specific acelui serviciu va avea prioritate pentru acel proiect.`
            : `If you do not agree to these terms, please do not use this website or any services provided by ${LEGAL_BUSINESS_NAME}. These terms work alongside any proposal, statement of work, or written service agreement we issue for a specific project. If there is a conflict, the service-specific agreement will take priority for that project.`}
        </p>
      </div>

      <LegalSection title={isRo ? "1. General" : "1. General"}>
        <p>
          {isRo
            ? `Acesti Termeni si Conditii guverneaza utilizarea website-ului si a serviciilor oferite de ${LEGAL_BUSINESS_NAME}. ${LEGAL_COMPANY_STATEMENT}`
            : `These Terms and Conditions govern your use of the website and services provided by ${LEGAL_BUSINESS_NAME}. ${LEGAL_COMPANY_STATEMENT}`}
        </p>
        <p>
          {isRo
            ? "Prin accesarea sau utilizarea website-ului ori a serviciilor, esti de acord cu acesti termeni si intri intr-o relatie cu caracter obligatoriu din punct de vedere legal cu noi. Daca nu esti de acord, nu trebuie sa folosesti website-ul sau serviciile."
            : "By accessing or using the website or services, you agree to these terms and enter into a legally binding arrangement with us. If you do not agree, you must not use the website or services."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "2. Ce facem" : "2. What we do"}>
        <p>{isRo ? "Website-ul si serviciile noastre pot include:" : "Our website and services may include:"}</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>{isRo ? "informatii si resurse gratuite despre website-uri, crestere digitala si automatizare;" : "free information and resources about websites, digital growth, and automation;"}</li>
          <li>{isRo ? "servicii platite precum web design, management de website, coordonare hosting, mentenanta si solutii digitale custom;" : "paid services such as website design, website management, hosting coordination, maintenance, and custom digital solutions;"}</li>
          <li>{isRo ? "automatizare, AI, lead generation si suport de implementare asociat pentru afaceri de servicii." : "automation, AI, lead-generation, and related implementation support for service businesses."}</li>
        </ul>
      </LegalSection>

      <LegalSection title={isRo ? "3. Ce nu facem" : "3. What we do not do"}>
        <p>
          {isRo
            ? "Continutul de pe acest website este oferit doar pentru informare generala si nu trebuie tratat ca sfat juridic, financiar, de reglementare sau alt tip de consultanta profesionala. Esti responsabil pentru propriile decizii si ar trebui sa soliciti consultanta independenta acolo unde este necesar."
            : "Content on this website is provided for general information only and should not be treated as legal, financial, regulatory, or other professional advice. You are responsible for your own decisions and should take independent advice where appropriate."}
        </p>
        <p>
          {isRo
            ? "Nu garantam completitudinea, disponibilitatea sau potrivirea oricaror unelte third-party, platforme, integrari sau informatii mentionate pe website. Daca serviciile noastre implica workflow-uri asistate de AI, automatizari sau output-uri generate, ramai responsabil sa revizuiesti si sa aprobi rezultatul final inainte sa te bazezi pe el."
            : "We do not guarantee the completeness, availability, or suitability of any third-party tools, platforms, integrations, or information mentioned on the website. If our services involve AI-assisted workflows, automations, or generated outputs, you remain responsible for reviewing and approving the final result before relying on it."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "4. Confidentialitate si cookies" : "4. Privacy and cookies"}>
        <p>
          {isRo ? "Te rugam sa consulti " : "Please review our "}
          <Link
            href={localizePath(locale, "/privacy")}
            className="text-brand-purple underline underline-offset-4"
          >
            {isRo ? "Politica de confidentialitate" : "Privacy Policy"}
          </Link>{" "}
          {isRo ? "si " : "and "}
          <Link
            href={localizePath(locale, "/cookies")}
            className="text-brand-purple underline underline-offset-4"
          >
            {isRo ? "Politica de cookie-uri" : "Cookie Policy"}
          </Link>{" "}
          {isRo
            ? "pentru a intelege cum colectam, folosim, stocam si protejam informatiile tale si cum functioneaza optiunile de consimtamant pe acest website."
            : "to understand how we collect, use, store, and protect your information, and how consent choices work on this website."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "5. Linkuri externe si platforme third-party" : "5. External links and third-party platforms"}>
        <p>
          {isRo
            ? "Website-ul nostru poate contine linkuri catre website-uri, produse sau servicii third-party. Nu suntem responsabili pentru continutul, securitatea, termenii sau practicile lor de confidentialitate. Daca le folosesti, o faci in baza termenilor lor."
            : "Our website may contain links to third-party websites, products, or services. We are not responsible for their content, security, terms, or privacy practices. If you use them, you do so on their terms."}
        </p>
        <p>
          {isRo
            ? "Unele linkuri pot fi linkuri de afiliere, ceea ce inseamna ca putem primi un comision daca dai click si faci o achizitie. Acest lucru nu schimba continutul de baza pe care il publicam sau serviciile pe care le recomandam."
            : "Some links may be affiliate links, which means we may receive a commission if you click through and make a purchase. This does not change the core content we publish or the services we recommend."}
        </p>
        <p>
          {isRo
            ? "Daca faci link catre website-ul nostru, trebuie sa o faci corect si legal. Nu trebuie sa sugerezi nicio sustinere, aprobare sau asociere care nu exista si nu trebuie sa faci link din continut ilegal, inselator, ofensator sau daunator."
            : "If you link to our website, you must do so fairly and lawfully. You must not suggest any endorsement, approval, or association that does not exist, and you must not link from unlawful, misleading, offensive, or harmful content."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "6. Continutul nostru" : "6. Our content"}>
        <p>
          {isRo
            ? "Tot continutul de pe acest website, inclusiv text, grafica, branding, layout-uri, materiale descarcabile si alte materiale, ne apartine noua sau este licentiat catre noi si este protejat de legile privind proprietatea intelectuala."
            : "All content on this website, including text, graphics, branding, layouts, downloads, and other materials, is owned by us or licensed to us and is protected by intellectual property laws."}
        </p>
        <p>
          {isRo
            ? "Nu poti copia, distribui, adapta, republica, extrage sau refolosi nicio parte a website-ului fara permisiunea noastra prealabila in scris, cu exceptia cazurilor in care legea permite acest lucru."
            : "You may not copy, distribute, adapt, republish, scrape, or reuse any part of the website without our prior written permission, except where the law allows this."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "7. Materiale pe care ni le trimiti" : "7. Materials you submit to us"}>
        <p>
          {isRo
            ? "Pastrezi proprietatea asupra materialelor pe care ni le trimiti, precum informatii de cerere, continut de proiect, feedback, testimoniale sau fisiere. Totusi, trimitandu-ne materiale, confirmi ca ai dreptul sa faci asta si ne acorzi drepturile de care avem nevoie in mod rezonabil pentru a le folosi, stoca, prelucra, adapta si partaja in scopul raspunderii la cererea ta, livrarii serviciilor, operarii website-ului sau prezentarii lucrarilor aprobate."
            : "You retain ownership of materials you send to us, such as enquiry information, project content, feedback, testimonials, or files. However, by sending materials to us, you confirm that you have the right to do so and grant us the rights we reasonably need to use, store, process, adapt, and share them for the purpose of responding to your enquiry, delivering services, operating the website, or showcasing approved work."}
        </p>
        <p>
          {isRo
            ? "Nu trebuie sa ne trimiti nimic ilegal, care incalca drepturi, abuziv, inselator sau daunator in alt mod. Putem refuza sa folosim sau sa publicam orice material despre care credem in mod rezonabil ca incalca acesti termeni sau legea aplicabila."
            : "You must not submit anything unlawful, infringing, abusive, misleading, or otherwise harmful. We may refuse to use or publish any material that we reasonably believe breaches these terms or applicable law."}
        </p>
        <p>
          {isRo
            ? "Daca ai sub 16 ani, trebuie sa ai permisiunea unui parinte sau tutore inainte sa trimiti informatii personale sau alt continut prin acest website."
            : "If you are under 16, you must have permission from a parent or guardian before submitting personal information or other content through this website."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "8. Servicii platite" : "8. Paid services"}>
        <p>
          {isRo
            ? "Aria oricarui serviciu platit, inclusiv livrabilele, termenele, responsabilitatile si dependintele, va fi de regula stabilita intr-o propunere, oferta, factura, mesaj de onboarding sau acord separat de servicii."
            : "The scope of any paid service, including deliverables, timelines, responsibilities, and dependencies, will normally be set out in a proposal, quote, invoice, onboarding message, or separate service agreement."}
        </p>
        <p>
          {isRo
            ? "Taxele sunt platibile asa cum este precizat in propunerea sau factura relevanta. Cu exceptia cazului in care convenim altfel in scris, munca poate incepe doar dupa ce plata sau avansul cerut au fost primite."
            : "Fees are payable as stated in the relevant proposal or invoice. Unless we agree otherwise in writing, work may begin only after the required payment or deposit has been received."}
        </p>
        <p>
          {isRo
            ? "Daca esti client business si anulezi in termen de 24 de ore de la achizitie, de regula vom oferi rambursare integrala, cu exceptia cazului in care munca substantiala a inceput deja la cererea ta. Daca anulezi dupa ce munca a inceput, putem retine sau percepe o suma rezonabila care sa reflecte munca efectuata, timpul rezervat sau costurile third-party nerecuperabile."
            : "If you are a business customer and cancel within 24 hours of purchase, we will usually offer a full refund unless substantial work has already begun at your request. If you cancel after work has started, we may retain or charge a reasonable amount to reflect work completed, time reserved, or non-recoverable third-party costs."}
        </p>
        <p>
          {isRo
            ? "Daca esti consumator care achizitioneaza servicii la distanta, nimic din acesti termeni nu elimina vreun drept de anulare sau alte drepturi pe care le poti avea in baza legislatiei aplicabile privind consumatorii. Daca ne ceri sa incepem munca in perioada de retragere, esti de acord ca putem percepe contravaloarea proportionala a serviciilor furnizate pana la anulare, acolo unde legea permite."
            : "If you are a consumer purchasing services at a distance, nothing in these terms removes any cancellation or other rights you may have under applicable consumer law. Where you ask us to begin work during any cooling off period, you agree we may charge for the proportion of services supplied up to cancellation where the law allows."}
        </p>
        <p>
          {isRo
            ? "Daca nu reusim sa livram un serviciu platit in mod substantial conform ariei convenite, ne poti contacta in termen de 30 de zile pentru a investiga si a oferi o remediere potrivita, care poate include corectii, un serviciu de inlocuire sau rambursare, dupa caz."
            : "If we fail to deliver a paid service materially in line with the agreed scope, you may contact us within 30 days so we can investigate and offer a suitable remedy, which may include corrections, a replacement service, or a refund where appropriate."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "9. Acceptarea termenilor" : "9. Acceptance of terms"}>
        <p>
          {isRo
            ? "Prin utilizarea acestui website sau a serviciilor noastre, confirmi ca ai capacitatea legala de a incheia contracte obligatorii conform legii aplicabile si ca esti de acord cu acesti termeni."
            : "By using this website or our services, you confirm that you are legally capable of entering into binding contracts under applicable law and that you agree to these terms."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "10. Modificari ale acestor termeni" : "10. Changes to these terms"}>
        <p>
          {isRo
            ? "Putem actualiza acesti termeni din cand in cand. Daca facem schimbari semnificative, te putem notifica prin email, prin website sau prin ambele. Continuarea utilizarii website-ului sau a serviciilor dupa publicarea termenilor actualizati constituie acceptarea versiunii revizuite."
            : "We may update these terms from time to time. If we make material changes, we may notify you by email, through the website, or both. Your continued use of the website or services after updated terms are published constitutes acceptance of the revised terms."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "11. Excluderea garantiilor" : "11. Disclaimer of warranties"}>
        <p>
          {isRo
            ? 'Furnizam website-ul si serviciile pe baza "as is" si "as available". In masura maxima permisa de lege, nu garantam ca website-ul, continutul sau serviciile vor fi intotdeauna disponibile, neintrerupte, sigure, exacte sau fara erori.'
            : 'We provide the website and services on an "as is" and "as available" basis. To the fullest extent permitted by law, we do not guarantee that the website, content, or services will always be available, uninterrupted, secure, accurate, or error-free.'}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "12. Limitarea raspunderii" : "12. Limitation of liability"}>
        <p>
          {isRo
            ? "In masura maxima permisa de lege, nu vom fi raspunzatori pentru pierderi indirecte, incidentale, speciale sau consecvente, inclusiv pierderi de profit, venituri, oportunitati de afaceri, goodwill sau date, rezultate din utilizarea website-ului sau a serviciilor."
            : "To the fullest extent permitted by law, we will not be liable for indirect, incidental, special, or consequential loss, including loss of profits, revenue, business opportunities, goodwill, or data, arising from use of the website or services."}
        </p>
        <p>
          {isRo
            ? "De asemenea, nu suntem responsabili pentru intarzieri, intreruperi sau esecuri cauzate de platforme third-party, furnizori de hosting, furnizori software, intreruperi de internet, cod malitios sau evenimente aflate in afara controlului nostru rezonabil."
            : "We are also not responsible for delays, interruptions, or failures caused by third-party platforms, hosting providers, software suppliers, internet outages, malicious code, or events outside our reasonable control."}
        </p>
        <p>
          {isRo
            ? "Nimic din acesti termeni nu exclude sau limiteaza raspunderea care nu poate fi exclusa in mod legal, inclusiv raspunderea pentru frauda, denaturare frauduloasa sau deces ori vatamare corporala cauzata de neglijenta."
            : "Nothing in these terms excludes or limits liability that cannot lawfully be excluded, including liability for fraud, fraudulent misrepresentation, or death or personal injury caused by negligence."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "13. Conduita interzisa" : "13. Prohibited conduct"}>
        <p>{isRo ? "Cand folosesti website-ul sau serviciile noastre, nu trebuie sa:" : "When using our website or services, you must not:"}</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>{isRo ? "te implici in activitati ilegale, frauduloase sau abuzive;" : "engage in unlawful, fraudulent, or abusive activity;"}</li>
          <li>{isRo ? "incalci drepturile noastre de proprietate intelectuala sau pe cele ale altora;" : "infringe our intellectual property rights or those of others;"}</li>
          <li>{isRo ? "incarci, trimiti sau distribui materiale daunatoare, ofensatoare sau hartuitoare;" : "upload, submit, or distribute harmful, offensive, or harassing material;"}</li>
          <li>{isRo ? "incerci sa obtii acces neautorizat la sistemele noastre sau sa interferezi cu operatiunile noastre;" : "attempt to gain unauthorised access to our systems or interfere with our operations;"}</li>
          <li>{isRo ? "folosesti website-ul intr-un mod care i-ar putea afecta disponibilitatea, performanta sau securitatea." : "use the website in a way that could impair its availability, performance, or security."}</li>
        </ul>
      </LegalSection>

      <LegalSection title={isRo ? "14. Incetare" : "14. Termination"}>
        <p>
          {isRo
            ? "Putem suspenda sau inceta accesul la website sau servicii in orice moment daca credem in mod rezonabil ca acesti termeni au fost incalcati, daca obligatiile de plata nu sunt respectate sau daca continuarea serviciului ar crea risc legal, tehnic sau comercial."
            : "We may suspend or terminate access to the website or services at any time if we reasonably believe these terms have been breached, if payment obligations are not met, or if continuing the service would create legal, technical, or commercial risk."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "15. Legea aplicabila" : "15. Governing law"}>
        <p>
          {isRo
            ? "Acesti termeni sunt guvernati de legile din Anglia si Tara Galilor. Orice disputa rezultata din acesti termeni sau din utilizarea website-ului ori a serviciilor va intra sub jurisdictia instantelor din Anglia si Tara Galilor, cu exceptia cazului in care legea obligatorie prevede altfel."
            : "These terms are governed by the laws of England and Wales. Any dispute arising from these terms or your use of the website or services will be subject to the jurisdiction of the courts of England and Wales, unless mandatory law says otherwise."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "16. Informatii de contact" : "16. Contact information"}>
        <p>
          {isRo
            ? "Daca ai intrebari despre acesti termeni, contacteaza-ne la:"
            : "If you have questions about these terms, contact us at:"}
        </p>
        <p className="text-brand-black">
          {LEGAL_BUSINESS_NAME}
          <br />
          {LEGAL_CONTACT_EMAIL}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

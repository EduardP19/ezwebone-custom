import type { Locale } from "@/lib/i18n/config";

type ProjectTranslation = {
  title?: string;
  category?: string;
  industry?: string;
  description?: string;
  summary?: string;
  highlights?: string[];
  caseStudy?: string | null;
};

const roProjectTranslations: Record<string, ProjectTranslation> = {
  "the-bus-stop": {
    category: "Ospitalitate · Website custom",
    industry: "Glamping si turism",
    description:
      "Un website construit custom pentru o afacere de glamping din East Lothian recunoscuta prin premii, care combina design bespoke, un flux personalizat pentru vouchere cadou si o structura de continut ghidata de cautare pentru a sustine vizibilitatea si rezervarile.",
    summary:
      "Build custom cu vouchere cadou, design bespoke si structura SEO profunda pentru un brand de glamping distinctiv.",
    highlights: ["Cod custom", "Flux vouchere cadou", "Cercetare SEO"],
    caseStudy:
      "Am dus proiectul mult dincolo de un template standard, proiectand custom fiecare sectiune, construind cod personalizat in jurul parcursului de voucher cadou si modeland arhitectura site-ului si continutul in jurul cererii reale din cautare, astfel incat afacerea sa poata fi gasita mai usor si sa converteasca mai sigur.",
  },
  "aura-pro-cosmetics": {
    category: "Beauty · E-commerce",
    industry: "Ingrijire piele si par",
    description:
      "O experienta ecommerce mai rafinata pentru Aura Pro Cosmetics, construita pentru a prezenta produse de skincare, haircare si anti-aging cu o poveste de produs mai clara si mai multa incredere vizuala.",
    summary:
      "Prezentare premium de ecommerce beauty, cu pozitionare mai clara a produselor si un storefront digital mai credibil.",
    highlights: ["E-commerce", "Branding premium", "Povestea produsului"],
    caseStudy:
      "Proiectul s-a concentrat pe a face brandul sa para mai premium online, pe a prezenta mai clar beneficiile produselor si pe a crea o experienta de storefront care sustine increderea si conversia.",
  },
  txengo: {
    category: "Creativ · Portofoliu",
    industry: "Consultant creativ",
    description:
      "Un portofoliu creativ indraznet, cu vizualuri puternice, storytelling structurat si miscare fluida care mentine munca in centrul atentiei.",
    summary:
      "Storytelling editorial si ritm premium pentru ca portofoliul sa para mai distinct si mai valoros.",
    highlights: ["Vizualuri indraznete", "Motion-led", "Layout grid"],
    caseStudy:
      "Am mers spre un ritm editorial si o structurare mai buna a povestii astfel incat lucrarile sa para mai clare, mai intentionate si mai usor de valorizat.",
  },
  "the-memory-corners": {
    category: "Evenimente · Site de programari",
    industry: "Photo booth",
    description:
      "Un site rafinat pentru o companie de photo booth, cu fluxuri de rezervare online, galerii de eveniment si o structura gandita sa converteasca rapid vizitatorii ocupati.",
    summary:
      "Mai multa incredere vizuala si o prezentare mai clara a ofertei pentru un parcurs de cumparare mai rafinat.",
    highlights: ["Rezervare online", "Pregatit pentru galerie", "Axat pe evenimente"],
    caseStudy:
      "Proiectul s-a concentrat pe a face oferta mai usor de inteles rapid, pastrand in acelasi timp experienta calda, vizuala si orientata spre evenimente.",
  },
  proveit: {
    category: "Comunitate · Platforma",
    industry: "Platforma comunitara",
    description:
      "O platforma axata pe incredere pentru comunitatea romaneasca din UK, cu o structura de continut mai puternica, integrare de blog si un parcurs de membership mai clar.",
    summary:
      "Structura mai clara si un design informational mai bun pentru o experienta digitala mai demna de incredere.",
    highlights: ["Axat pe incredere", "Blog integrat", "Comunitatea pe primul loc"],
    caseStudy:
      "Redesignul a clarificat arhitectura informatiei astfel incat vizitatorii sa poata intelege platforma mai repede si sa aiba incredere in ea mai usor.",
  },
  "study-and-succeed": {
    category: "Educatie · Agentie",
    industry: "Brand educational",
    description:
      "Un site bilingv pentru calatorii de studiu, cu filtrare mai clara a programelor, navigatie gandita pentru studenti si un parcurs mai curat de la descoperire la cerere.",
    summary:
      "Ierarhie mai buna si flux de conversie mai clar pentru ca vizitatorii sa inteleaga oferta mai repede si sa actioneze mai usor.",
    highlights: ["Bilingv", "Filtre de programe", "Student first"],
    caseStudy:
      "Munca principala aici a fost simplificarea alegerii, imbunatatirea ierarhiei paginilor si facerea pasului urmator mai evident pentru studentii interesati.",
  },
};

export function getLocalizedProjectFields(slug: string, locale: Locale): ProjectTranslation | null {
  if (locale !== "ro") {
    return null;
  }

  return roProjectTranslations[slug] ?? null;
}

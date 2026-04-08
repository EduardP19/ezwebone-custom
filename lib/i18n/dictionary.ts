import type { Locale } from "@/lib/i18n/config";

const dictionaries = {
  en: {
    languageName: "English",
    languageLabel: "Language",
    common: {
      bookFreeCall: "Book a Free Call",
      seeProjects: "See Projects",
      learnMore: "Learn More",
      learnMoreAboutResevia: "Learn More About Resevia ->",
      closeDetails: "Close details",
      openLiveSite: "Open live site",
      viewDetails: "View Details",
      overview: "Overview",
      caseStudy: "Case Study",
      whatWeFocusedOn: "What We Focused On",
      discussSimilarProject: "Discuss a Similar Project",
      ratedGoogle: "Rated 5.0 on Google",
      minRead: "min read",
      backToBlog: "Back to Blog",
      growthAndDigitalStrategy: "Growth & Digital Strategy",
      bookStrategyCall: "Book a Strategy Call",
      readyToTurnIdeas: "Ready to turn ideas into booked calls?",
      turnIdeasBody:
        "We design and build conversion-focused websites that help service businesses win more work.",
      bookFreeCallToday: "Book a Free Call Today",
      noPublishedProjects:
        "No published projects yet. Add rows to the projects table to populate this page.",
      noPublishedPosts: "No published posts yet.",
      noPublishedColumns: "No published columns yet.",
      founder: "Founder",
    },
    nav: {
      links: {
        home: "Home",
        services: "Services",
        portfolio: "Projects",
        blog: "Blog",
        about: "About",
      },
      openMenu: "Open menu",
      closeMenu: "Close menu",
      mobileTagline: "Websites, Automations, AI Agents",
    },
    footer: {
      strapline: "Websites, automations, and AI agents for businesses that want to grow.",
      quickLinksTitle: "Quick Links",
      usefulLinksTitle: "Useful Links",
      contactTitle: "Contact",
      quickLinks: {
        home: "Home",
        services: "Services",
        portfolio: "Projects",
        blog: "Blog",
        about: "About",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        terms: "Terms & Conditions",
      },
      contact: {
        phone: "+44 7448 929894",
        email: "support@ezwebone.co.uk",
        location: "United Kingdom",
      },
      companyStatement:
        "EZWebOne. is a trading name for EMAGF LTD, registered in England and Wales. All rights reserved.",
    },
    home: {
      trust: {
        happyClients: "110+ Happy Clients",
        googleRating: "5.0 on Google",
        liveNow: "Live Now",
      },
      hero: {
        heading: ["Websites. Automations.", "AI Agents. Growth."],
        body:
          "Tell us what your business needs and we'll guide you toward the right website, automation, AI, or growth solution.",
        servicePills: ["Websites", "Automations", "AI Agents", "Marketing", "SEO", "Lead Gen"],
        typewriterPrompts: [
          "Missed calls are costing us bookings.",
          "We need a website that brings leads in.",
          "Can you automate our follow-ups?",
          "How do we rank higher on Google?",
          "What can AI do for our business?",
        ],
        emailCapturePrompt:
          "I've got a clear picture of what your business needs. I can put together a personalised recommendation with the right service mix and realistic next steps. What's the best email to send it to?",
        emailConfirmationPrompt:
          "You're all set. Check your inbox within 24 hours and we'll send over a personalised recommendation. Is there anything else you'd like this preview to reflect later?",
        emailError: "That doesn't look like an email - try again?",
        startTyping: "Your messages will appear here. Start typing to begin the conversation.",
        remainingMessages: {
          singular: "message remaining",
          plural: "messages remaining",
        },
        captured: "Recommendation on its way",
        reportSentWarmMessage:
          "Thank you, we've got enough to build your recommendation and we'll send the report shortly.",
        reportSentEta: "It can take 1-2 minutes for your recommendation to arrive.",
        reportSentOnEmail: "Report sent to",
        reportSentSpamHint: "If you don't see it soon, please check your spam or junk folder.",
        trialUsedTitle: "Your ran out of tasting messages.",
        trialUsedBody:
          "If you want deeper recommendations and a custom plan, book a strategy call and we will walk through your business in detail.",
        trialUsedCta: "Book a call",
        placeholderChat: "Tell us about your business...",
        placeholderEmail: "Your email address...",
        assistantResponses: {
          salon:
            "For salons and service businesses, we'd usually start with Resevia so missed calls turn into booked conversations instead of lost revenue. We can pair that with a stronger website or automations once the enquiry flow is under control. Is missed-call recovery or booking admin the bigger issue for you right now?",
          seo:
            "SEO usually works best when the website structure, service pages, and local intent all line up around what people actually search for. We'd tighten the technical foundation first, then build content that supports rankings and leads. Are you trying to rank for your town, a specific service, or both?",
          leadGen:
            "Lead generation gets stronger when the offer, landing page, and follow-up system are built as one flow instead of separate pieces. We can help with the ads side, the page itself, and the automation that keeps warm leads moving. Are you mainly trying to lower your cost per lead or increase lead quality?",
          automation:
            "Automation is usually the fastest win when leads, bookings, or admin tasks are still being handled manually. We'd map the repetitive steps first, then connect the tools so follow-ups happen consistently without adding more work to your team. Which process feels the most repetitive at the moment?",
          ai:
            "AI agents are most useful when they solve one high-value bottleneck like missed calls, first-response speed, or repetitive customer questions. We'd normally shape the workflow around your business first, then decide where an AI layer makes the biggest difference. What job would you want the AI handling every day?",
          fallback:
            "We'd usually start by understanding how people find you today and where the biggest drop-off happens between interest and enquiry. From there, we can recommend the right mix of website, automation, AI, SEO, or lead gen support. What kind of business are you running at the moment?",
        },
      },
      services: {
        badge: "Services",
        title: "What We Actually Do",
        body: "Six services. No fluff. Each one designed to move your business forward.",
      },
      aiTeaser: {
        badge: "Featured Product",
        title: "Meet Resevia",
        subtitle: "The AI Receptionist Built for UK Salons & Service Businesses",
        body:
          "Resevia answers missed calls, books appointments via SMS, and manages your diary - all powered by AI. No app downloads for your clients. No staff needed on the phone.",
        features: [
          "Answers missed calls automatically",
          "Books appointments via SMS conversation",
          "Syncs with Google Calendar",
          "Works 24/7 - no breaks, no sick days",
          "Built specifically for UK salons",
        ],
      },
      portfolio: {
        badge: "Projects",
        title: "Work That Speaks for Itself",
        body: "Real businesses. Real results. Every project is built to perform.",
      },
      whoWeAre: {
        badge: "Who We Are",
        title: "A small UK team focused on real business outcomes.",
        body:
          "We build websites, automations, and AI systems that help service businesses look sharper, respond faster, and convert more enquiries into booked work.",
        bodyLight:
          "We design clean websites, practical automations, and AI systems that help service businesses look professional, respond faster, and turn more enquiries into booked work.",
      },
      testimonials: {
        badge: "Testimonials",
        title: "Don't Take Our Word For It",
      },
      process: {
        badge: "Process",
        title: "From Idea to Live in 5 Days",
      },
      finalCta: {
        title: "Ready to Build Something That Actually Works?",
        body:
          "Book a free 20-minute call. No pitch. No pressure. Just a conversation about what your business needs.",
      },
    },
    pages: {
      services: {
        badge: "Services",
        title: "Websites, automations, AI agents, and the systems that make them useful.",
        body:
          "We build for small businesses that want more leads, less admin, and digital systems that keep working after launch.",
      },
      about: {
        badge: "About EZWebOne",
        title: "Built for small businesses that need real systems, not more noise.",
        paragraphs: [
          "EZWebOne started as a web design service and grew into something more useful: a digital agency that builds the full system around growth.",
          "That means the website, the automation behind it, the AI tools that answer faster, and the lead generation flow that turns interest into paying customers.",
          "We are based in the United Kingdom and work with small businesses across the UK that want to look sharper, move faster, and stop losing opportunities to slow processes.",
        ],
        valuesTitle: "What we care about",
        principles: [
          {
            title: "Specific beats generic",
            description:
              "We do not write fluffy agency copy or hide weak offers behind nice visuals. Everything has to be clear, direct, and useful to the buyer.",
          },
          {
            title: "Automation should remove work",
            description:
              "If a system adds friction, it is not automation. We build flows that save time, answer faster, and keep leads moving without more admin.",
          },
          {
            title: "AI should feel practical",
            description:
              "The goal is not to say your business uses AI. The goal is to use it where it makes money or saves time - calls, follow-up, booking, and lead qualification.",
          },
        ],
      },
      contact: {
        badge: "Contact",
        title: "Let's see what your brand should feel like at a higher level.",
        body:
          "Tell us about the business, the quality of clients you want more of, and where your current website is underselling you. We'll come back with a clearer direction.",
        directConversationTitle: "Prefer a direct conversation?",
        directConversationBody:
          "If you already know you want a sharper website and clearer growth system, book a strategy call and skip the back-and-forth.",
        directConversationCta: "Book strategy call",
        bestFitLabel: "Best fit",
        bestFitBody:
          "Founder-led service businesses, consultants, clinics, agencies, studios, and premium local brands that want better positioning and better-fit enquiries.",
        successTitle: "Message sent",
        successBody: "Thanks for reaching out. We'll review the details and reply within 24 hours.",
        sendAnother: "Send another message",
        enquiryTitle: "Project enquiry",
        enquiryBody: "The more context you share, the more useful our response will be.",
        fields: {
          firstName: "First name *",
          lastName: "Last name",
          email: "Email address *",
          phone: "Phone number",
          businessName: "Business name",
          serviceInterest: "What do you need most?",
          message: "Tell us about the business and the shift you want",
        },
        placeholders: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "07123 456789",
          businessName: "Your business",
          message: "What is working, what is not, and what should feel different after the project?",
        },
        serviceOptions: [
          "Premium website redesign",
          "SEO and content growth",
          "Automation and follow-up systems",
          "AI reception / booking support",
          "Not sure yet",
        ],
        sendEnquiry: "Send enquiry",
        sending: "Sending...",
        privacyNote: "We only use your details to respond to your enquiry.",
        submitError: "Something went wrong. Please try again.",
      },
      portfolio: {
        badge: "Selected Work",
        title: "A look at the kind of clarity and confidence we build into every project.",
        body:
          "These projects vary by sector, but they share the same goal: make the brand feel more trusted, more valuable, and easier to buy from.",
      },
      blog: {
        badge: "Journal",
        title: "Strategy notes for service brands that want to look sharper and grow with intent.",
        body:
          "Essays on positioning, search visibility, paid growth, automation, and the systems behind better-fit enquiries.",
        fallbackExcerpt: "Read this latest update from EZWebOne.",
      },
      columns: {
        badge: "Columns & Insights",
        title: "Expert voices. Hard-won insights.",
        body:
          "A growing collection of deep dives into technology, business growth, and the future of digital products.",
        readEntry: "Read entry",
        backToColumns: "Back to Columns",
        published: "Published",
        author: "Author",
        joinConversation: "Join the conversation",
        loading: "Retrieving column...",
      },
      blogPost: {
        journalEntry: "Journal Entry",
        noContent: "This post has no content yet.",
        onThisPage: "On This Page",
        published: "Published",
        readingTime: "Reading Time",
        topic: "Topic",
        minuteRead: "minute read",
      },
    },
    metadata: {
      siteTitle: "EZWebOne | Websites, Automations, and AI Agents for Small Businesses",
      siteDescription:
        "EZWebOne is a UK digital agency building websites, automations, AI agents, SEO systems, and lead generation funnels for small businesses that want to grow.",
      home: {
        title: "Websites, Automations, and AI Agents for Small Businesses",
        description:
          "EZWebOne is a UK digital agency building websites, automations, AI agents, marketing systems, SEO, and lead generation for small businesses.",
        keywords: [
          "websites for small businesses uk",
          "automation agency uk",
          "ai agents for small business",
          "lead generation systems uk",
        ],
      },
      services: {
        title: "Services | Websites, Automations, AI Agents, SEO and Lead Gen",
        description:
          "Explore EZWebOne services: custom websites, automations, AI agents, marketing, SEO, and lead generation systems for small businesses.",
        keywords: [
          "website agency uk",
          "business automation agency",
          "ai agents for salons and small business",
          "seo and lead generation services",
        ],
      },
      about: {
        title: "About EZWebOne",
        description:
          "Learn about EZWebOne, the UK digital agency building websites, automations, AI agents, and growth systems for small businesses.",
        keywords: ["about ezwebone", "uk digital agency", "web automation ai agency uk"],
      },
      contact: {
        title: "Contact EZWebOne",
        description:
          "Start a project with EZWebOne and discuss positioning, SEO, paid growth, websites, and automation for your business.",
        keywords: ["contact marketing agency", "book strategy call", "service brand marketing enquiry"],
      },
      portfolio: {
        title: "Selected Work and Website Case Studies",
        description:
          "Browse selected EZWebOne projects and see how sharper positioning, better marketing systems, and stronger digital execution improve trust and conversion.",
        keywords: [
          "marketing agency portfolio uk",
          "service brand case studies",
          "digital marketing systems for service brands",
        ],
      },
      blog: {
        title: "Journal",
        description:
          "Read positioning, SEO, paid growth, automation, and digital strategy insights for ambitious UK service businesses.",
        keywords: [
          "marketing strategy blog",
          "service business seo insights",
          "service brand growth articles",
        ],
      },
      columns: {
        title: "Columns and Insights",
        description:
          "Read deeper opinion pieces, strategic notes, and technology insights from EZWebOne.",
        keywords: [
          "digital strategy columns",
          "business growth insights",
          "technology opinion articles",
        ],
      },
      legal: {
        privacyTitle: "Privacy Policy",
        privacyDescription:
          "Read the EZWebOne privacy policy and learn how we handle enquiry, client, and analytics data.",
        termsTitle: "Terms and Conditions of Use",
        termsDescription: "Read the EZWebOne terms and conditions of use for this website and our services.",
        cookiesTitle: "Cookie Policy",
        cookiesDescription: "Read the EZWebOne cookie policy and manage analytics consent preferences.",
      },
    },
    cookies: {
      bannerLabel: "Privacy choices",
      bannerTitle: "We only enable analytics after you say yes.",
      bannerBody:
        "EZWebOne uses local storage and similar technologies to measure page views, traffic sources, and on-site interactions. You can accept or reject non-essential tracking.",
      reject: "Reject analytics",
      accept: "Accept analytics",
      preferencesTitle: "Cookie preferences",
      currentSetting: "Current setting",
      accepted: "Analytics accepted",
      rejected: "Analytics rejected",
      unset: "No choice saved yet",
    },
  },
  ro: {
    languageName: "Romana",
    languageLabel: "Limba",
    common: {
      bookFreeCall: "Programeaza un apel gratuit",
      seeProjects: "Vezi proiectele",
      learnMore: "Afla mai mult",
      learnMoreAboutResevia: "Afla mai multe despre Resevia ->",
      closeDetails: "Inchide detaliile",
      openLiveSite: "Deschide site-ul live",
      viewDetails: "Vezi detalii",
      overview: "Prezentare generala",
      caseStudy: "Studiu de caz",
      whatWeFocusedOn: "Pe ce ne-am concentrat",
      discussSimilarProject: "Discuta un proiect similar",
      ratedGoogle: "Evaluare 5.0 pe Google",
      minRead: "min citire",
      backToBlog: "Inapoi la blog",
      growthAndDigitalStrategy: "Crestere si strategie digitala",
      bookStrategyCall: "Programeaza un apel strategic",
      readyToTurnIdeas: "Esti gata sa transformi ideile in apeluri si lead-uri?",
      turnIdeasBody:
        "Concepem si construim website-uri orientate spre conversie care ajuta afacerile de servicii sa castige mai multa munca.",
      bookFreeCallToday: "Programeaza astazi un apel gratuit",
      noPublishedProjects:
        "Nu exista proiecte publicate inca. Adauga randuri in tabela projects pentru a popula aceasta pagina.",
      noPublishedPosts: "Nu exista articole publicate inca.",
      noPublishedColumns: "Nu exista coloane publicate inca.",
      founder: "Fondator",
    },
    nav: {
      links: {
        home: "Acasa",
        services: "Servicii",
        portfolio: "Proiecte",
        blog: "Blog",
        about: "Despre",
      },
      openMenu: "Deschide meniul",
      closeMenu: "Inchide meniul",
      mobileTagline: "Website-uri, automatizari, agenti AI",
    },
    footer: {
      strapline:
        "Website-uri, automatizari si agenti AI pentru afaceri care vor sa creasca.",
      quickLinksTitle: "Linkuri rapide",
      usefulLinksTitle: "Linkuri utile",
      contactTitle: "Contact",
      quickLinks: {
        home: "Acasa",
        services: "Servicii",
        portfolio: "Proiecte",
        blog: "Blog",
        about: "Despre",
        privacy: "Politica de confidentialitate",
        cookies: "Politica de cookie-uri",
        terms: "Termeni si conditii",
      },
      contact: {
        phone: "+44 7448 929894",
        email: "support@ezwebone.co.uk",
        location: "Regatul Unit",
      },
      companyStatement:
        "EZWebOne. este denumirea comerciala a EMAGF LTD, inregistrata in Anglia si Tara Galilor. Toate drepturile rezervate.",
    },
    home: {
      trust: {
        happyClients: "110+ clienti fericiti",
        googleRating: "5.0 pe Google",
        liveNow: "Activ acum",
      },
      hero: {
        heading: ["Website-uri. Automatizari.", "Agenti AI. Crestere."],
        body:
          "Spune-ne de ce are nevoie afacerea ta si te ghidam catre website-ul, automatizarea, agentul AI sau solutia de crestere potrivita.",
        servicePills: ["Website-uri", "Automatizari", "Agenti AI", "Marketing", "SEO", "Lead Gen"],
        typewriterPrompts: [
          "Apelurile ratate ne costa programari.",
          "Avem nevoie de un website care sa aduca lead-uri.",
          "Puteti automatiza follow-up-urile?",
          "Cum urcam mai sus pe Google?",
          "Ce poate face AI-ul pentru afacerea noastra?",
        ],
        emailCapturePrompt:
          "Acum am o imagine mai clara despre ce are nevoie afacerea ta. Iti pot pregati o recomandare personalizata cu mixul potrivit de servicii si urmatorii pasi realisti. Care este cea mai buna adresa de email unde sa ti-o trimit?",
        emailConfirmationPrompt:
          "Totul este pregatit. Verifica-ti inbox-ul in urmatoarele 24 de ore si iti vom trimite o recomandare personalizata. Mai este ceva ce ai vrea sa luam in calcul mai tarziu?",
        emailError: "Aceasta nu pare sa fie o adresa de email valida.",
        startTyping: "Mesajele tale vor aparea aici. Scrie mai jos ca sa incepi conversatia.",
        remainingMessages: {
          singular: "mesaj ramas",
          plural: "mesaje ramase",
        },
        captured: "Recomandarea este pe drum",
        reportSentWarmMessage:
          "Multumim, avem suficiente detalii pentru recomandare si iti trimitem raportul in curand.",
        reportSentEta: "Poate dura 1-2 minute pana cand recomandarea ajunge pe email.",
        reportSentOnEmail: "Raport trimis pe",
        reportSentSpamHint: "Daca nu il vezi curand, verifica si folderul spam sau junk.",
        trialUsedTitle: "Ai ramas fara mesaje de test disponibile.",
        trialUsedBody:
          "Daca vrei recomandari mai detaliate si un plan personalizat, programeaza un apel si discutam punctual despre afacerea ta.",
        trialUsedCta: "Programeaza un apel",
        placeholderChat: "Spune-ne cate ceva despre afacerea ta...",
        placeholderEmail: "Adresa ta de email...",
        assistantResponses: {
          salon:
            "Pentru saloane si afaceri de servicii, de obicei am incepe cu Resevia ca apelurile ratate sa devina conversatii programate, nu venit pierdut. Putem combina asta cu un website mai puternic sau cu automatizari dupa ce fluxul de lead-uri este sub control. Ce te afecteaza mai mult acum: apelurile ratate sau administrarea programarilor?",
          seo:
            "SEO functioneaza cel mai bine cand structura website-ului, paginile de servicii si intentia locala se aliniaza cu ceea ce cauta oamenii de fapt. Am consolida mai intai baza tehnica, apoi am construi continut care sustine pozitionarea si lead-urile. Vrei sa te pozitionezi pentru orasul tau, pentru un serviciu anume sau pentru ambele?",
          leadGen:
            "Lead generation-ul functioneaza mai bine cand oferta, landing page-ul si sistemul de follow-up sunt construite ca un singur flux, nu ca piese separate. Te putem ajuta cu partea de ads, cu pagina in sine si cu automatizarea care tine lead-urile calde in miscare. Incerci in principal sa scazi costul pe lead sau sa cresti calitatea lead-urilor?",
          automation:
            "Automatizarea este adesea cea mai rapida victorie atunci cand lead-urile, programarile sau task-urile administrative sunt inca gestionate manual. Am mapa mai intai pasii repetitivi, apoi am conecta uneltele astfel incat follow-up-urile sa se intample constant fara sa adauge mai multa munca echipei. Ce proces simti acum ca este cel mai repetitiv?",
          ai:
            "Agentii AI sunt cei mai utili atunci cand rezolva un blocaj valoros, cum ar fi apelurile ratate, viteza primului raspuns sau intrebarile repetitive ale clientilor. De obicei modelam mai intai workflow-ul in jurul afacerii tale si apoi decidem unde AI-ul aduce cel mai mare impact. Ce sarcina ai vrea sa gestioneze AI-ul in fiecare zi?",
          fallback:
            "De obicei incepem prin a intelege cum va gasesc clientii astazi si unde apare cea mai mare pierdere intre interes si cerere. De acolo putem recomanda mixul potrivit de website, automatizare, AI, SEO sau suport pentru lead generation. Ce tip de afacere conduci in acest moment?",
        },
      },
      services: {
        badge: "Servicii",
        title: "Ce facem de fapt",
        body: "Sase servicii. Fara vorbe goale. Fiecare gandit sa impinga afacerea ta inainte.",
      },
      aiTeaser: {
        badge: "Produs recomandat",
        title: "Descopera Resevia",
        subtitle: "Receptionerul AI creat pentru saloane si afaceri de servicii din UK",
        body:
          "Resevia raspunde la apelurile ratate, programeaza prin conversatii SMS si iti gestioneaza agenda - totul cu ajutorul AI-ului. Fara aplicatii pentru clienti. Fara personal permanent la telefon.",
        features: [
          "Raspunde automat la apelurile ratate",
          "Programeaza prin conversatii SMS",
          "Se sincronizeaza cu Google Calendar",
          "Functioneaza 24/7 - fara pauze, fara concedii medicale",
          "Construit special pentru saloanele din UK",
        ],
      },
      portfolio: {
        badge: "Proiecte",
        title: "Proiecte care vorbesc de la sine",
        body: "Afaceri reale. Rezultate reale. Fiecare proiect este construit sa performeze.",
      },
      whoWeAre: {
        badge: "Cine suntem",
        title: "O echipa mica din UK, orientata spre rezultate reale.",
        body:
          "Construim website-uri, automatizari si sisteme AI care ajuta afacerile de servicii sa arate mai bine, sa raspunda mai rapid si sa transforme mai multe cereri in programari.",
        bodyLight:
          "Construim website-uri clare, automatizari practice si sisteme AI care ajuta afacerile de servicii sa arate profesionist, sa raspunda mai rapid si sa transforme mai multe cereri in programari.",
      },
      testimonials: {
        badge: "Testimoniale",
        title: "Nu ne crede doar pe cuvant",
      },
      process: {
        badge: "Proces",
        title: "De la idee la live in 5 zile",
      },
      finalCta: {
        title: "Esti gata sa construim ceva care chiar functioneaza?",
        body:
          "Programeaza un apel gratuit de 20 minute. Fara pitch. Fara presiune. Doar o conversatie despre ce are nevoie afacerea ta.",
      },
    },
    pages: {
      services: {
        badge: "Servicii",
        title: "Website-uri, automatizari, agenti AI si sistemele care le fac utile.",
        body:
          "Construim pentru afaceri mici care vor mai multe lead-uri, mai putina administrare si sisteme digitale care continua sa functioneze dupa lansare.",
      },
      about: {
        badge: "Despre EZWebOne",
        title: "Construit pentru afaceri mici care au nevoie de sisteme reale, nu de mai mult zgomot.",
        paragraphs: [
          "EZWebOne a inceput ca un serviciu de web design si a crescut in ceva mai util: o agentie digitala care construieste sistemul complet din jurul cresterii.",
          "Asta inseamna website-ul, automatizarea din spate, uneltele AI care raspund mai repede si fluxul de lead generation care transforma interesul in clienti platitori.",
          "Suntem bazati in Regatul Unit si lucram cu afaceri mici din tot UK-ul care vor sa arate mai bine, sa se miste mai repede si sa nu mai piarda oportunitati din cauza proceselor lente.",
        ],
        valuesTitle: "Ce conteaza pentru noi",
        principles: [
          {
            title: "Specificul bate generic",
            description:
              "Nu scriem copy de agentie fara substanta si nu ascundem oferte slabe in spatele unor vizualuri frumoase. Totul trebuie sa fie clar, direct si util pentru cumparator.",
          },
          {
            title: "Automatizarea trebuie sa elimine munca",
            description:
              "Daca un sistem adauga frictiune, nu este automatizare. Construim fluxuri care economisesc timp, raspund mai repede si mentin lead-urile in miscare fara mai multa administratie.",
          },
          {
            title: "AI-ul trebuie sa fie practic",
            description:
              "Scopul nu este sa spui ca afacerea ta foloseste AI. Scopul este sa il folosesti acolo unde produce bani sau economiseste timp - apeluri, follow-up, programari si calificarea lead-urilor.",
          },
        ],
      },
      contact: {
        badge: "Contact",
        title: "Hai sa vedem cum ar trebui sa se simta brandul tau la un nivel mai ridicat.",
        body:
          "Spune-ne despre afacere, despre tipul de clienti pe care vrei sa-i atragi mai des si despre locurile unde website-ul tau actual te vinde sub valoarea reala. Venim inapoi cu o directie mai clara.",
        directConversationTitle: "Preferi o discutie directa?",
        directConversationBody:
          "Daca stii deja ca vrei un website mai puternic si un sistem de crestere mai clar, programeaza un apel strategic si sari peste mesajele inutile.",
        directConversationCta: "Programeaza apelul",
        bestFitLabel: "Potrivire ideala",
        bestFitBody:
          "Afaceri de servicii conduse de fondator, consultanti, clinici, agentii, studiouri si branduri locale premium care vor o pozitionare mai buna si cereri mai potrivite.",
        successTitle: "Mesaj trimis",
        successBody: "Multumim pentru mesaj. Vom analiza detaliile si iti vom raspunde in 24 de ore.",
        sendAnother: "Trimite alt mesaj",
        enquiryTitle: "Cerere de proiect",
        enquiryBody: "Cu cat ne dai mai mult context, cu atat raspunsul nostru va fi mai util.",
        fields: {
          firstName: "Prenume *",
          lastName: "Nume",
          email: "Adresa de email *",
          phone: "Numar de telefon",
          businessName: "Numele afacerii",
          serviceInterest: "De ce ai nevoie cel mai mult?",
          message: "Povesteste-ne despre afacere si despre schimbarea pe care o vrei",
        },
        placeholders: {
          firstName: "Ion",
          lastName: "Popescu",
          email: "ion@example.com",
          phone: "07123 456789",
          businessName: "Afacerea ta",
          message: "Ce functioneaza, ce nu functioneaza si ce ar trebui sa se simta diferit dupa proiect?",
        },
        serviceOptions: [
          "Redesign premium de website",
          "SEO si crestere prin continut",
          "Automatizari si sisteme de follow-up",
          "AI reception / suport programari",
          "Nu sunt sigur inca",
        ],
        sendEnquiry: "Trimite cererea",
        sending: "Se trimite...",
        privacyNote: "Folosim detaliile tale doar pentru a raspunde cererii.",
        submitError: "Ceva nu a mers bine. Incearca din nou.",
      },
      portfolio: {
        badge: "Lucrari selectate",
        title: "O privire asupra claritatii si increderii pe care le construim in fiecare proiect.",
        body:
          "Aceste proiecte difera ca industrie, dar urmaresc acelasi scop: sa faca brandul mai de incredere, mai valoros si mai usor de cumparat.",
      },
      blog: {
        badge: "Jurnal",
        title: "Note strategice pentru branduri de servicii care vor sa arate mai bine si sa creasca intentionat.",
        body:
          "Eseuri despre pozitionare, vizibilitate in cautare, paid growth, automatizare si sistemele din spatele unor cereri mai bine potrivite.",
        fallbackExcerpt: "Citeste cea mai noua actualizare de la EZWebOne.",
      },
      columns: {
        badge: "Coloane si insight-uri",
        title: "Voci experimentate. Insight-uri castigate greu.",
        body:
          "O colectie in crestere de materiale aprofundate despre tehnologie, cresterea afacerilor si viitorul produselor digitale.",
        readEntry: "Citeste articolul",
        backToColumns: "Inapoi la coloane",
        published: "Publicat",
        author: "Autor",
        joinConversation: "Intra in conversatie",
        loading: "Se incarca articolul...",
      },
      blogPost: {
        journalEntry: "Articol din jurnal",
        noContent: "Acest articol nu are continut inca.",
        onThisPage: "Pe aceasta pagina",
        published: "Publicat",
        readingTime: "Timp de citire",
        topic: "Subiect",
        minuteRead: "minute de citire",
      },
    },
    metadata: {
      siteTitle: "EZWebOne | Website-uri, automatizari si agenti AI pentru afaceri mici",
      siteDescription:
        "EZWebOne este o agentie digitala din UK care construieste website-uri, automatizari, agenti AI, sisteme SEO si funnel-uri de lead generation pentru afaceri mici care vor sa creasca.",
      home: {
        title: "Website-uri, automatizari si agenti AI pentru afaceri mici",
        description:
          "EZWebOne este o agentie digitala din UK care construieste website-uri, automatizari, agenti AI, sisteme de marketing, SEO si lead generation pentru afaceri mici.",
        keywords: [
          "website-uri pentru afaceri mici uk",
          "agentie de automatizare uk",
          "agenti ai pentru afaceri mici",
          "sisteme de lead generation uk",
        ],
      },
      services: {
        title: "Servicii | Website-uri, automatizari, agenti AI, SEO si lead gen",
        description:
          "Descopera serviciile EZWebOne: website-uri custom, automatizari, agenti AI, marketing, SEO si sisteme de lead generation pentru afaceri mici.",
        keywords: [
          "agentie website uk",
          "agentie automatizare business",
          "agenti ai pentru saloane si afaceri mici",
          "servicii seo si lead generation",
        ],
      },
      about: {
        title: "Despre EZWebOne",
        description:
          "Afla mai multe despre EZWebOne, agentia digitala din UK care construieste website-uri, automatizari, agenti AI si sisteme de crestere pentru afaceri mici.",
        keywords: ["despre ezwebone", "agentie digitala uk", "agentie web automatizare ai uk"],
      },
      contact: {
        title: "Contact EZWebOne",
        description:
          "Porneste un proiect cu EZWebOne si discuta despre pozitionare, SEO, paid growth, website-uri si automatizare pentru afacerea ta.",
        keywords: ["contact agentie marketing", "programare apel strategic", "cerere agentie de brand"],
      },
      portfolio: {
        title: "Lucrari selectate si studii de caz website",
        description:
          "Rasfoieste proiectele selectate EZWebOne si vezi cum pozitionarea mai clara, sistemele de marketing mai bune si executia digitala mai puternica cresc increderea si conversia.",
        keywords: [
          "portofoliu agentie marketing uk",
          "studii de caz brand servicii",
          "sisteme digitale pentru branduri de servicii",
        ],
      },
      blog: {
        title: "Jurnal",
        description:
          "Citeste idei despre pozitionare, SEO, paid growth, automatizare si strategie digitala pentru afaceri de servicii ambitioase din UK.",
        keywords: [
          "blog strategie de marketing",
          "insight seo pentru afaceri de servicii",
          "articole de crestere pentru branduri de servicii",
        ],
      },
      columns: {
        title: "Coloane si insight-uri",
        description:
          "Citeste articole de opinie, note strategice si insight-uri tehnologice de la EZWebOne.",
        keywords: [
          "coloane strategie digitala",
          "insight-uri crestere business",
          "articole de opinie tehnologie",
        ],
      },
      legal: {
        privacyTitle: "Politica de confidentialitate",
        privacyDescription:
          "Citeste politica de confidentialitate EZWebOne si afla cum gestionam datele din cereri, clienti si analytics.",
        termsTitle: "Termeni si conditii de utilizare",
        termsDescription:
          "Citeste termenii si conditiile EZWebOne pentru acest website si serviciile noastre.",
        cookiesTitle: "Politica de cookie-uri",
        cookiesDescription:
          "Citeste politica de cookie-uri EZWebOne si gestioneaza preferintele de analytics.",
      },
    },
    cookies: {
      bannerLabel: "Setari de confidentialitate",
      bannerTitle: "Activam analytics doar dupa acordul tau.",
      bannerBody:
        "EZWebOne foloseste local storage si tehnologii similare pentru a masura paginile vizitate, sursele de trafic si interactiunile din site. Poti accepta sau respinge tracking-ul ne-esential.",
      reject: "Respinge analytics",
      accept: "Accepta analytics",
      preferencesTitle: "Preferinte cookies",
      currentSetting: "Setarea curenta",
      accepted: "Analytics acceptat",
      rejected: "Analytics respins",
      unset: "Nu exista nicio alegere salvata",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

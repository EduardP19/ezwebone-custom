import type { Locale } from "@/lib/i18n/config";
import { getLocalizedProjectFields } from "@/lib/project-content";
import { supabase } from "@/lib/supabase";
import { readdir } from "node:fs/promises";
import path from "node:path";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  image: string;
  beforeImage: string | null;
  description: string;
  summary: string;
  highlights: string[];
  liveUrl: string | null;
  caseStudy: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  summary: string;
  highlights: string[] | null;
  live_url: string | null;
  case_study: string | null;
  featured: boolean | null;
  published: boolean | null;
  sort_order: number | null;
  created_at: string | null;
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "say-i-do-weddings",
    slug: "say-i-do-weddings",
    title: "Say I Do Weddings",
    category: "Wedding · Web Design",
    industry: "Luxury Events",
    image: "/portfolio/SayIDoWeddings - Home.webp",
    beforeImage: null,
    description:
      "A romantic, conversion-focused site for a UK wedding planner. Designed to feel premium quickly and support higher-value enquiries.",
    summary:
      "Designed to feel more refined, reassure quickly, and support higher-value enquiries.",
    highlights: ["Mobile First", "SEO Ready", "Booking Integrated"],
    liveUrl: null,
    caseStudy:
      "We rebuilt the presentation around trust, polish, and enquiry clarity so the brand felt more premium from the first scroll.",
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "the-memory-corners",
    slug: "the-memory-corners",
    title: "The Memory Corners",
    category: "Events · Booking Site",
    industry: "Experiential Brand",
    image: "/portfolio/TheMemoryCorner - Home.webp",
    beforeImage: null,
    description:
      "A polished site for a photo booth company with online booking flows, event galleries, and a layout built to convert busy visitors fast.",
    summary:
      "Upgraded visual confidence and offer presentation for a more polished buyer journey.",
    highlights: ["Online Booking", "Gallery Ready", "Event Focused"],
    liveUrl: null,
    caseStudy:
      "The project focused on making the offer easier to understand at speed while keeping the experience warm, visual, and event-led.",
    featured: false,
    published: true,
    sortOrder: 2,
    createdAt: "2025-01-02T00:00:00.000Z",
  },
  {
    id: "txengo",
    slug: "txengo",
    title: "Txengo",
    category: "Creative · Portfolio",
    industry: "Creative Consultant",
    image: "/portfolio/Txengo - Home.webp",
    beforeImage: null,
    description:
      "A bold creative portfolio with punchy visuals, structured storytelling, and smooth motion that keeps the work front and centre.",
    summary:
      "Editorial storytelling and premium pacing to make the portfolio feel more ownable and valuable.",
    highlights: ["Bold Visuals", "Motion Led", "Grid Layout"],
    liveUrl: null,
    caseStudy:
      "We leaned into editorial rhythm and stronger story framing so the work felt sharper, more intentional, and easier to value.",
    featured: false,
    published: true,
    sortOrder: 3,
    createdAt: "2025-01-03T00:00:00.000Z",
  },
  {
    id: "proveit",
    slug: "proveit",
    title: "ProveIt",
    category: "Community · Platform",
    industry: "Community Platform",
    image: "/portfolio/ProvieIt - CF1.webp",
    beforeImage: "/portfolio/Before - Proveit.webp",
    description:
      "A trust-focused platform for the Romanian community in the UK with stronger content structure, blog integration, and a clearer membership journey.",
    summary:
      "Clearer structure and stronger information design for a more trustworthy digital product experience.",
    highlights: ["Trust Focused", "Blog Integrated", "Community First"],
    liveUrl: null,
    caseStudy:
      "The redesign clarified the information architecture so visitors could understand the platform faster and trust it sooner.",
    featured: false,
    published: true,
    sortOrder: 4,
    createdAt: "2025-01-04T00:00:00.000Z",
  },
  {
    id: "study-and-succeed",
    slug: "study-and-succeed",
    title: "Study and Succeed",
    category: "Education · Agency",
    industry: "Education Brand",
    image: "/portfolio/StudyAndSucceed - Home.webp",
    beforeImage: null,
    description:
      "A bilingual language travel site with clearer programme filtering, student-first navigation, and a cleaner path from discovery to enquiry.",
    summary:
      "Improved hierarchy and conversion flow so visitors understand the offer faster and act sooner.",
    highlights: ["Bilingual", "Programme Filters", "Student First"],
    liveUrl: null,
    caseStudy:
      "The main work here was simplifying choice, improving page hierarchy, and making the next step feel obvious for prospective students.",
    featured: false,
    published: true,
    sortOrder: 5,
    createdAt: "2025-01-05T00:00:00.000Z",
  },
];

const projectSelect =
  "id, slug, title, category, industry, description, summary, highlights, live_url, case_study, featured, published, sort_order, created_at";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const BEFORE_PREFIX = /^before\s*-\s*/i;

type PortfolioImageEntry = {
  src: string;
  kind: "before" | "after";
  key: string;
};

const compactAlphaNumeric = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const singularize = (value: string): string => (value.endsWith("s") ? value.slice(0, -1) : value);

const toKey = (value: string): string => compactAlphaNumeric(value);

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + substitutionCost
      );
    }
    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function extractImageKey(filename: string): { kind: "before" | "after"; key: string } {
  const extension = path.extname(filename).toLowerCase();
  const stem = filename.slice(0, filename.length - extension.length).trim();
  const kind: "before" | "after" = BEFORE_PREFIX.test(stem) ? "before" : "after";
  const withoutPrefix = kind === "before" ? stem.replace(BEFORE_PREFIX, "") : stem;
  
  // Use regex to only split if there is whitespace around the dash (e.g. "Project - Home")
  // but keep "resevia-agent" whole.
  const base = withoutPrefix.split(/\s+-\s+/)[0].trim();
  return { kind, key: toKey(base) };
}

async function getPortfolioImageEntries(): Promise<PortfolioImageEntry[]> {
  const portfolioDir = path.join(process.cwd(), "public", "portfolio");
  const files = await readdir(portfolioDir, { withFileTypes: true });

  return files
    .filter((file) => file.isFile())
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file.name).toLowerCase()))
    .map((file) => {
      const { kind, key } = extractImageKey(file.name);
      return {
        src: `/portfolio/${file.name}`,
        kind,
        key,
      };
    });
}

let portfolioImageEntriesPromise: Promise<PortfolioImageEntry[]> | null = null;

function getPortfolioImageEntriesCached(): Promise<PortfolioImageEntry[]> {
  portfolioImageEntriesPromise ??= getPortfolioImageEntries();
  return portfolioImageEntriesPromise;
}

async function resolvePortfolioImagesBySlug(
  projects: Array<Pick<Project, "slug" | "title">>
): Promise<Map<string, { image: string | null; beforeImage: string | null }>> {
  try {
    const entries = await getPortfolioImageEntriesCached();
    const result = new Map<string, { image: string | null; beforeImage: string | null }>();

    for (const { slug, title } of projects) {
      const slugKey = toKey(slug);
      const slugKeySingular = singularize(slugKey);
      const titleKey = toKey(title);
      const titleKeySingular = singularize(titleKey);

      const scoreEntry = (entry: PortfolioImageEntry): number => {
        if (entry.key === titleKey) return -1;
        if (entry.key === titleKeySingular || singularize(entry.key) === titleKey) return 0;
        if (entry.key === slugKey) return 0;
        if (entry.key === slugKeySingular || singularize(entry.key) === slugKey) return 1;
        if (slugKey.includes(entry.key) || entry.key.includes(slugKey)) return 2;

        const distance = levenshtein(entry.key, slugKey);
        if (distance <= 2) return 3 + distance;
        return Number.POSITIVE_INFINITY;
      };

      const pick = (kind: "before" | "after"): string | null => {
        const candidates = entries
          .filter((entry) => entry.kind === kind)
          .map((entry) => ({ entry, score: scoreEntry(entry) }))
          .filter(({ score }) => Number.isFinite(score))
          .sort((a, b) => (a.score === b.score ? a.entry.src.localeCompare(b.entry.src) : a.score - b.score));

        return candidates[0]?.entry.src ?? null;
      };

      result.set(slug, {
        image: pick("after"),
        beforeImage: pick("before"),
      });
    }

    return result;
  } catch {
    return new Map();
  }
}

function normalizeProject(project: ProjectRow): Project {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    industry: project.industry,
    image: "/window.svg",
    beforeImage: null,
    description: project.description,
    summary: project.summary,
    highlights: project.highlights ?? [],
    liveUrl: project.live_url,
    caseStudy: project.case_study,
    featured: Boolean(project.featured),
    published: project.published ?? true,
    sortOrder: project.sort_order ?? 100,
    createdAt: project.created_at ?? new Date(0).toISOString(),
  };
}

function localizeProject(project: Project, locale: Locale): Project {
  const localized = getLocalizedProjectFields(project.slug, locale);

  if (!localized) {
    return project;
  }

  return {
    ...project,
    title: localized.title ?? project.title,
    category: localized.category ?? project.category,
    industry: localized.industry ?? project.industry,
    description: localized.description ?? project.description,
    summary: localized.summary ?? project.summary,
    highlights: localized.highlights ?? project.highlights,
    caseStudy: localized.caseStudy ?? project.caseStudy,
  };
}

export async function getPublishedProjects(locale: Locale = "en"): Promise<Project[]> {
  const applyLocalizedImages = async (source: Project[]): Promise<Project[]> => {
    const imageMap = await resolvePortfolioImagesBySlug(
      source.map((project) => ({ slug: project.slug, title: project.title }))
    );

    return source.map((project) => {
      const resolved = imageMap.get(project.slug);
      
      // Force local paths only to save Supabase quota
      const finalImage = resolved?.image || (project.image.startsWith('http') ? '/window.svg' : project.image);
      const finalBeforeImage = resolved?.beforeImage || (project.beforeImage?.startsWith('http') ? null : project.beforeImage);

      return localizeProject(
        {
          ...project,
          image: finalImage,
          beforeImage: finalBeforeImage,
        },
        locale
      );
    });
  };

  if (!supabase) {
    return applyLocalizedImages(FALLBACK_PROJECTS);
  }

  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Projects query failed, using fallback data:", error.message);
    }
    return applyLocalizedImages(FALLBACK_PROJECTS);
  }

  const projects = ((data ?? []) as ProjectRow[]).map(normalizeProject);
  const result = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  return applyLocalizedImages(result);
}

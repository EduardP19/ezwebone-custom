import { supabase } from "@/lib/supabase";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  image: string;
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
  image: string;
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
    image: "/portfolio/project1.png",
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
    image: "/portfolio/project2.png",
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
    image: "/portfolio/project3.png",
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
    image: "/portfolio/project4.png",
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
    image: "/portfolio/project5.png",
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
  "id, slug, title, category, industry, image, description, summary, highlights, live_url, case_study, featured, published, sort_order, created_at";

function normalizeProject(project: ProjectRow): Project {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    industry: project.industry,
    image: project.image,
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

export async function getPublishedProjects(): Promise<Project[]> {
  if (!supabase) {
    return FALLBACK_PROJECTS;
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
    return FALLBACK_PROJECTS;
  }

  const projects = ((data ?? []) as ProjectRow[]).map(normalizeProject);
  return projects.length > 0 ? projects : FALLBACK_PROJECTS;
}

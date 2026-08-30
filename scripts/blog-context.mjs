import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const DEFAULT_LIMIT = 100;
const TABLE_CANDIDATES = [process.env.BLOG_TABLE, "blog", "posts"].filter(Boolean);
const BLOG_COLUMNS = "id, slug, title, excerpt, content, cover_image, published, created_at";

async function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");

  try {
    const content = await readFile(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

function parseLimit() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const rawLimit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "", 10) : DEFAULT_LIMIT;

  return Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : DEFAULT_LIMIT;
}

function summarizePost(post) {
  const content = typeof post.content === "string" ? post.content : "";
  const excerpt = typeof post.excerpt === "string" ? post.excerpt : "";

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt,
    contentSnippet: content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500),
    coverImage: post.cover_image,
    published: post.published,
    createdAt: post.created_at,
  };
}

function buildAvoidList(posts) {
  return posts
    .map((post) => [post.title, post.slug, post.excerpt].filter(Boolean).join(" | "))
    .filter(Boolean);
}

async function fetchBlogContext(supabase, limit) {
  const errors = [];

  for (const table of [...new Set(TABLE_CANDIDATES)]) {
    const { data, error } = await supabase
      .from(table)
      .select(BLOG_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error) {
      const posts = data ?? [];

      return {
        table,
        count: posts.length,
        posts: posts.map(summarizePost),
        avoid: buildAvoidList(posts),
      };
    }

    errors.push({ table, message: error.message });
  }

  throw new Error(
    `Could not read any blog table. Tried ${errors.map((item) => item.table).join(", ")}. ` +
      errors.map((item) => `${item.table}: ${item.message}`).join(" | ")
  );
}

async function main() {
  await loadEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey ?? anonKey;

  if (!supabaseUrl || !key) {
    throw new Error(
      "Supabase is not configured. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const supabase = createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const context = await fetchBlogContext(supabase, parseLimit());

  process.stdout.write(`${JSON.stringify(context, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

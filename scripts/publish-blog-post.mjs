import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const BLOG_COLUMNS = "id, slug, title, excerpt, cover_image, published, created_at";

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

function resolvePayloadPath() {
  const payloadPath = process.argv[2];

  if (!payloadPath) {
    throw new Error("Usage: node scripts/publish-blog-post.mjs <payload.json>");
  }

  return path.resolve(rootDir, payloadPath);
}

function assertPostPayload(payload) {
  const requiredFields = ["slug", "title", "excerpt", "content", "cover_image"];

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string" || payload[field].trim().length === 0) {
      throw new Error(`Payload field ${field} must be a non-empty string.`);
    }
  }

  return {
    slug: payload.slug.trim(),
    title: payload.title.trim(),
    excerpt: payload.excerpt.trim(),
    content: payload.content.trim(),
    cover_image: payload.cover_image.trim(),
    published: payload.published !== false,
  };
}

async function main() {
  await loadEnvLocal();

  const payloadPath = resolvePayloadPath();
  const payload = assertPostPayload(JSON.parse(await readFile(payloadPath, "utf8")));
  const table = process.env.BLOG_TABLE || "blog";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase admin credentials are required to publish a blog post.");
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: existing, error: existingError } = await supabase
    .from(table)
    .select("id, slug, title")
    .or(`slug.eq.${payload.slug},title.eq.${payload.title}`);

  if (existingError) {
    throw new Error(`Duplicate check failed: ${existingError.message}`);
  }

  if ((existing ?? []).length > 0) {
    throw new Error(`Duplicate detected before insert: ${JSON.stringify(existing)}`);
  }

  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .insert(payload)
    .select(BLOG_COLUMNS)
    .single();

  if (insertError) {
    throw new Error(`Insert failed: ${insertError.message}`);
  }

  const { data: verified, error: verifyError } = await supabase
    .from(table)
    .select(BLOG_COLUMNS)
    .eq("slug", payload.slug)
    .single();

  if (verifyError) {
    throw new Error(`Verification failed: ${verifyError.message}`);
  }

  process.stdout.write(`${JSON.stringify({ table, inserted, verified }, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

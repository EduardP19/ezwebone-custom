# Blog Creation Agent Porting Guide

This note explains how the blog creation agent was set up in this repo and what to move when you want the same workflow in another project.

## What Was Created

The blog creation setup has three practical pieces:

1. A blog data model in Supabase.
2. A pair of local scripts that let an agent inspect existing blog posts and publish a new post.
3. A workflow brief for turning it into a scheduled SEO/content agent later.

In this repo, the agent is not a fully hosted background worker yet. It is a local/operator-driven workflow that can be used by Codex or another automation runner to create a post payload, check for duplicates, and publish into Supabase.

## Current Files

| File | Purpose |
| --- | --- |
| `scripts/blog-context.mjs` | Reads existing blog posts from Supabase and returns JSON context for the agent. |
| `scripts/publish-blog-post.mjs` | Validates a generated blog payload, checks for duplicate slug/title, inserts into Supabase, then verifies the insert. |
| `docs/blog-keyword-agent-side-project.md` | Higher-level plan for making the agent autonomous with keywords, Search Console, updates, and email alerts. |
| `lib/blog.ts` | Frontend data helper that reads published posts from the `blog` table. |
| `app/blog/page.tsx` | Blog index page. |
| `app/blog/[slug]/page.tsx` | Individual blog post page. |
| `app/sitemap.ts` | Includes published blog posts in the sitemap. |
| `package.json` | Adds `npm run blog:context`. |

## Supabase Table

The app currently reads from a table called `blog`. The scripts can also work with another table if you set `BLOG_TABLE`, and `blog-context.mjs` will try `BLOG_TABLE`, then `blog`, then `posts`.

Use this shape in the target repo:

```sql
create table if not exists public.blog (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  published boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_blog_published_created_at
  on public.blog (published, created_at desc);
```

If the new repo already has a `posts` table, either rename the table in the code or set:

```bash
BLOG_TABLE=posts
```

## Environment Variables

The scripts load `.env.local` automatically. The target repo needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BLOG_TABLE=blog
```

`SUPABASE_SERVICE_ROLE_KEY` is required for publishing. The context script can fall back to the anon key if the blog table allows reads.

## Package Script

Add this to `package.json`:

```json
{
  "scripts": {
    "blog:context": "node scripts/blog-context.mjs"
  }
}
```

The publish script is run directly because it needs a payload path:

```bash
node scripts/publish-blog-post.mjs path/to/payload.json
```

## How The Agent Workflow Works

1. Run the context script:

```bash
npm run blog:context -- --limit=100
```

2. Give the returned JSON to the writing agent. It contains:

| Field | Meaning |
| --- | --- |
| `table` | Which Supabase table was read. |
| `count` | Number of existing posts loaded. |
| `posts` | Recent post summaries with slug, title, excerpt, content snippet, image, status, and date. |
| `avoid` | Compact duplicate/cannibalisation list for the agent to avoid. |

3. The agent creates a JSON payload:

```json
{
  "slug": "example-blog-post",
  "title": "Example Blog Post",
  "excerpt": "Short summary used on the blog index and metadata.",
  "content": "<p>Full blog content as HTML or plain text.</p>",
  "cover_image": "/blog/example-blog-post.png",
  "published": true
}
```

4. Publish it:

```bash
node scripts/publish-blog-post.mjs payloads/example-blog-post.json
```

5. The script:

- loads `.env.local`
- validates required fields
- checks duplicate slug/title
- inserts into Supabase
- fetches the post again to verify it exists
- prints the inserted and verified row as JSON

## Agent Prompt Shape

Use this as the portable instruction for the blog-writing agent:

```md
You are a blog creation agent for this website.

Before writing, inspect the existing blog context JSON. Do not reuse existing slugs, titles, or target topics. Avoid keyword cannibalisation.

Create one publish-ready blog post with:
- clear target keyword
- search-friendly title
- unique slug
- concise excerpt
- structured HTML content
- useful headings
- natural internal-link suggestions
- cover image path
- published boolean

Return only valid JSON matching:
{
  "slug": "...",
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "cover_image": "...",
  "published": true
}
```

## Frontend Requirements

The frontend expects:

- `slug` for `/blog/[slug]`
- `title` for page heading and metadata
- `excerpt` for cards and meta description
- `content` as either HTML or plain text
- `cover_image` as a public image path or remote image URL
- `published = true` for posts to appear
- `created_at` for sorting and display

In this repo, `lib/blog.ts` localises Romanian versions through `lib/blog-content.ts`. If the target repo does not need translations, skip that layer and return Supabase rows directly.

## Moving This To Another Repo

Copy these files first:

```text
scripts/blog-context.mjs
scripts/publish-blog-post.mjs
docs/blog-keyword-agent-side-project.md
```

Then recreate or adapt:

```text
lib/blog.ts
app/blog/page.tsx
app/blog/[slug]/page.tsx
app/sitemap.ts
public/blog/
```

After copying:

1. Install Supabase client if needed:

```bash
npm install @supabase/supabase-js
```

2. Add the environment variables.
3. Create the `blog` table.
4. Add `blog:context` to `package.json`.
5. Run `npm run blog:context -- --limit=10`.
6. Create a test payload.
7. Run `node scripts/publish-blog-post.mjs <payload.json>`.
8. Visit `/blog` and `/blog/<slug>`.
9. Check that the sitemap includes the post.

## Future Autonomous Version

The planned full agent is described in `docs/blog-keyword-agent-side-project.md`. The next version should add:

- keyword pool table
- agent run log table
- blog keyword target table
- Google Search Console sync
- scheduled publish every 2-3 days
- automated post update workflow after 14-30 days of data
- email notifications for successful publishes, successful updates, and failures

Recommended architecture:

```text
keyword database -> blog generator -> CMS publish -> sitemap/internal links -> Search Console tracker -> blog updater -> email notification
```

## Important Guardrails

- Always run the context script before creating a post.
- Do not publish duplicate slugs or near-duplicate topics.
- Keep the service role key server-side only.
- Log automated edits once the workflow becomes scheduled.
- Do not update posts too soon after publishing.
- Use Search Console data for improvements, not guesswork.
- Preserve the site's brand voice and avoid generic filler.

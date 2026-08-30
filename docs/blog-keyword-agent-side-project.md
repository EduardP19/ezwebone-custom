# Blog Keyword Agent Side Project

## Goal

Create an automated content agent that publishes a new blog every 2-3 days, tracks the keyword impact of each post, and improves existing posts using real search-performance data. The system should run without manual approval and only email when a publish or update workflow completes, or when it needs attention.

## Core Workflow

1. Generate a blog topic from a managed keyword pool.
2. Check existing posts to avoid duplicates and keyword cannibalisation.
3. Draft the post with SEO metadata, headings, internal links, image alt text, and a clean slug.
4. Publish the post automatically.
5. Record the target keywords, secondary keywords, URL, publish date, and agent run details.
6. Pull Google Search Console data on a schedule.
7. Compare Search Console query/page data against the blog's original targets.
8. Update older posts when new query data shows clear opportunities.
9. Email a short completion summary after each successful publish or update.

## Tracking Keywords And Impact

Google Search Console should be the primary measurement source because it reports actual Google query performance by page. Track:

- target keyword
- secondary keywords
- blog URL
- publish date
- baseline impressions, clicks, CTR, and average position
- 7-day, 14-day, 30-day, and 60-day performance
- new queries the page starts ranking for
- queries with high impressions and low CTR
- queries ranking around positions 8-30
- before/after performance after automated updates

## Google Search Console Integration

Use the Search Console Search Analytics API to pull page/query metrics. Use URL inspection where useful to check whether important URLs are indexed.

The normal Google Indexing API is not a general blog-post submission tool, so the content system should rely on sitemap updates, internal links, and Search Console monitoring rather than trying to submit every blog post directly for indexing.

## Automatic Blog Updates

Only update a published post after it has enough performance data, usually after 14-30 days. Good update triggers:

- relevant query has meaningful impressions
- query ranks between positions 8 and 30
- CTR is below the site or page average
- query reveals a missing subtopic, FAQ, comparison, or service angle
- another post is not already a better match for the same query

Update actions can include:

- adding a short section for a missing subtopic
- improving headings around proven queries
- adding FAQs
- improving meta title or meta description
- strengthening internal links
- refreshing examples or local service copy

Avoid keyword stuffing and constant rewrites based on small ranking movements.

## Suggested Tables

- `keywords`
- `blog_posts`
- `blog_keyword_targets`
- `gsc_daily_metrics`
- `blog_update_log`
- `agent_runs`
- `email_notifications`

## Email Rules

The agent should only email for useful events:

- blog published successfully
- blog update completed successfully
- Search Console sync failed
- publishing failed
- indexing issue detected for an important URL
- major keyword opportunity found but blocked by missing context

Routine metric changes should be stored, not emailed.

## Guardrails

- Keep every automated edit logged.
- Keep the original keyword target attached to each blog.
- Do not update posts too soon after publish.
- Do not rewrite a post for one weak query.
- Preserve brand voice and avoid generic AI-written filler.
- Make the agent compare posts before targeting the same keyword twice.

## Implementation Shape

The likely architecture is:

`keyword database -> blog generator -> CMS publish -> sitemap/internal links -> Search Console tracker -> blog updater -> email notification`

This is a good side project because it combines content automation, SEO analytics, scheduled jobs, safe agentic editing, and measurable feedback loops.

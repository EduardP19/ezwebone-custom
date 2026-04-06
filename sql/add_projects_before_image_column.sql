-- Adds an optional "before" image for project before/after comparisons.
-- Run this once in Supabase SQL Editor for existing databases.

alter table if exists public.projects
add column if not exists before_image text null;

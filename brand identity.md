# EZWebOne Brand Identity

## Typography

### Primary Typefaces (live site)
- **Inter** (`--font-inter`)
  - Usage: core body/UI sans (`--font-sans`)
  - Source: `next/font/google` in `app/layout.tsx`
  - Loaded subsets/weights: `latin` (variable Inter)

- **Space Grotesk** (`--font-space-grotesk`)
  - Usage: display/headings (`--font-display`)
  - Weights: `400, 500, 600, 700`
  - Source: `next/font/google` in `app/layout.tsx`

- **JetBrains Mono** (`--font-jetbrains-mono`)
  - Usage: mono labels/technical UI (`--font-mono`, `.mono-label`)
  - Weights: `400, 500, 600`
  - Source: `next/font/google` in `app/layout.tsx`

### Font Token Mapping (from `app/globals.css`)
- `--font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif`
- `--font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif`
- `--font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace`

---

## Color System

### Core Brand Tokens
- `--color-primary`: `#7c3aed`
- `--color-primary-light`: `#a78bfa` (dark theme token set)
- `--color-primary-dark`: `#5b21b6`
- `--color-accent`: `#f97316`
- `--color-accent-light`: `#fb923c` (dark theme token set)

### Brand Alias Tokens
- `--color-brand-black`: `#1c2a44`
- `--color-brand-blue`: `#7c3aed`
- `--color-brand-purple`: `#a78bfa`
- `--color-brand-purple-deep`: `#5b21b6`
- `--color-brand-cyan`: `#f97316`
- `--color-brand-warm`: `#f3f4f6`
- `--color-brand-border`: `#d4d4d8`
- `--color-brand-gray`: `#71717a`

---

## Theme Palette

### Dark Theme (`:root`, `[data-theme="dark"]`)
- `--background`: `#0a0a0f`
- `--foreground`: `#f5f5f7`
- `--color-bg-dark`: `#0a0a0f`
- `--color-bg-card`: `#111118`
- `--color-bg-elevated`: `#1a1a24`
- `--color-bg-void`: `#08080d`
- `--color-border`: `#2a2a3a`
- `--color-text-primary`: `#f5f5f7`
- `--color-text-secondary`: `#a1a1aa`
- `--color-text-accent`: `#c4b5fd`
- `--color-live`: `#6BAF6B`
- `--color-mesh-teal`: `#7fb4c7`
- `--color-mesh-blue`: `#5d8da5`
- `--color-mesh-gold`: `#d6b86e`
- `--particle-dot`: `245, 245, 247`
- `--particle-line`: `196, 181, 253`
- `--particle-hover-line`: `167, 139, 250`

### Light Theme (`[data-theme="light"]`)
- `--background`: `#F5F2ED`
- `--foreground`: `#1c2a44`
- `--color-primary`: `#7c3aed`
- `--color-primary-light`: `#9333ea`
- `--color-primary-dark`: `#5b21b6`
- `--color-accent`: `#f97316`
- `--color-accent-light`: `#ea580c`
- `--color-bg-dark`: `#F5F2ED`
- `--color-bg-card`: `#F5F2ED`
- `--color-bg-elevated`: `#eef0f5`
- `--color-bg-void`: `#e8eaf0`
- `--color-border`: `#d1d5e0`
- `--color-text-primary`: `#1c2a44`
- `--color-text-secondary`: `#4b5563`
- `--color-text-accent`: `#7c3aed`
- `--color-live`: `#6BAF6B`
- `--color-mesh-teal`: `#1c2a44`
- `--color-mesh-blue`: `#1c2a44`
- `--color-mesh-gold`: `#1c2a44`
- `--particle-dot`: `17, 24, 39`
- `--particle-line`: `30, 41, 59`
- `--particle-hover-line`: `124, 58, 237`

---

## Logo Assets In Use

From `lib/brand.ts`:
- Light mark: `/brand/EZ-Black - Tear.png`
- Dark mark: `/brand/EZ-White - Tear.png`
- Current default mark token (`BRAND_LOGO_MARK_SRC`): dark mark
- Wordmark token: `/logo.svg`

---

## Source of Truth
- `app/globals.css`
- `app/layout.tsx`
- `lib/brand.ts`

# CivicFix design system

CivicFix is a civic-tech product, not a generic SaaS template. The visual language is meant to feel like a trusted public record: paper, ink, and a restrained civic blue.

## Brand

- **Name:** CivicFix
- **Tagline:** Report. Track. Fix.
- **Mark:** a compact `CF` square in civic blue, paired with a Figtree wordmark. The mark is intentionally text-based so a custom logo can replace it later.

## Color

Tokens live in `frontend/src/index.css` (`@theme`) and should be referenced by Tailwind classes, not hardcoded hex values in components.

| Token | Role |
| --- | --- |
| `paper` / `paper-deep` | Page background. Warm, slightly off-white — not cool gray. |
| `surface` | Cards, forms, overlays |
| `ink` / `ink-muted` / `ink-subtle` | Primary, secondary, and tertiary text |
| `line` / `line-strong` | Borders |
| `brand` / `brand-hover` / `brand-soft` / `brand-ink` | Primary actions and civic identity |
| `success` `warning` `error` `info` | Semantic feedback |
| `critical` `high` `medium` `low` | Severity |

Contrast is tuned for body text on paper and white-on-brand buttons. Severity colors are used on soft tints so labels remain readable.

## Typography

| Role | Family | Use |
| --- | --- | --- |
| Display | Newsreader | Headlines, section titles, large statistics |
| UI / body | Figtree | Navigation, forms, supporting copy |
| Mono | IBM Plex Mono | Issue IDs, step numbers, tabular cues |

Headlines stay moderate in size. Landing H1 is the tagline, not a paragraph-length marketing sentence.

Scale (approximate):

- Display H1: `3rem`–`3.75rem`
- Section H2: `1.75rem`–`2rem`
- Page H1: `1.875rem`–`2rem`
- Body: `1rem` / `1.55` line-height
- Small / meta: `0.75rem`–`0.875rem`

Weights: 400 body, 500 UI, 600 wordmark, display 500–700.

## Spacing, radius, shadow

- Page gutters: `1.25rem` → `2rem`
- Content max width: `72rem`; wide: `80rem`
- Radius: `0.25rem` / `0.375rem` / `0.5rem` — small, not pill-shaped cards
- Shadows: hairline (`shadow-sm`) and occasional panel elevation. No glow.

## Motion

Framer Motion is used for section reveal and page presence only. Duration ~420ms, ease `[0.22, 1, 0.36, 1]`. Hover is color, not bounce. `prefers-reduced-motion` disables both CSS and motion variants.

## Breakpoints

`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem.

## Components

Reusable primitives live in `frontend/src/components/ui`. Civic-specific badges, logo, and map preview live in `frontend/src/components/civic`. Empty, loading, error, and success states live in `frontend/src/components/common`.

Do not introduce one-off colors, font sizes, or radii in feature pages.

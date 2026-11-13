# AGENTS.md — 前沿 · AI 笔记

A Simplified-Chinese personal tech blog about frontier AI. Static Markdown content via Content Collections, rendered by TanStack Start (Vite + React 19) on Netlify. No database, auth, or server-side data store — none is needed.

**All user-facing copy must be Simplified Chinese.**

## Layout

- `content/posts/*.md` — articles. Frontmatter: `title`, `summary`, quoted `date` (`YYYY-MM-DD`), `categories` (tags), optional `slug`, `image`, `imageAlt`.
- `content-collections.ts` — collection transform: slug, normalized image, `html`, `wordCount`, `readingMinutes`.
- `src/lib/post-content.ts` — schema, slug rules, Markdown → HTML (marked + marked-highlight/highlight.js, then sanitize-html; `span`/`code` keep `class` for hljs tokens), `countWords` (CJK chars counted individually + Latin words) and `readingMinutes` (~350 chars/min).
- `src/lib/blog.ts` — sorting, tag discovery, `zh-CN` UTC date formatting, `findPost` with `notFound()`.
- `src/lib/site.ts` — site name, author profile, social links, canonical tag list, nav items, `cdnImage()` helper for Netlify Image CDN URLs.
- `src/routes/` — `index.tsx` (hero + latest 3), `blog.tsx` (list, `?tag=` search param filter), `posts.$slug.tsx` (article, progress bar, code-block copy buttons), `about.tsx`, `__root.tsx` (shell, header/footer, 404, theme init script, Google Fonts).
- `src/components/` — `site-header` (desktop + mobile nav), `site-footer`, `theme-toggle`, `post-card`, `post-meta`, `icons`.
- `src/styles.css` — design tokens as CSS variables (light in `:root`, dark in `.dark`) exposed to Tailwind via `@theme inline` (`bg-bg`, `text-muted`, `border-line`, `text-accent`…); `.article` prose overrides; `.code-block` chrome; token-driven highlight.js theme for both modes.
- `public/img/` — AI-generated cover/hero images. Always reference via `cdnImage(src, width)`.

## Conventions & decisions

- **Dark by default**: `<html class="dark">` plus an inline pre-paint script that removes it only if `localStorage.theme === 'light'`. Tailwind's `dark:` variant is class-based (`@custom-variant`).
- Tag filtering uses a URL search param on `/blog` (shareable links) rather than separate routes. The four core tags in `site.ts` always show even if empty; extra tags from posts are appended. Tag names are exact and case-sensitive.
- Syntax highlighting happens at build time; the copy button + language label is injected client-side in a `useEffect` in `posts.$slug.tsx`.
- Browser APIs only in effects/handlers, never during SSR render.
- Don't edit generated `.content-collections/` or `src/routeTree.gen.ts`.
- Netlify Image CDN URLs only resolve under `netlify dev` or on Netlify, not plain `vite dev`.

## Commands

`pnpm dev`, `pnpm test`, `pnpm typecheck` (after a dev/build run generates types), `pnpm format`.

# Roadmap

Scope: `v2/` (Next.js + Notion API blog, deployed on Vercel). `v1/` is the retired Firebase version.

## In Progress
- [ ] Design renovation of v2 (brief pending)

## Planned
- [ ] Dark-mode colors for components still hard-coded for light mode: callouts, ArticleNav cards, blockquote border, passcode gate, comment section
- [ ] Back button returns to the list page the reader came from (currently always `/page/1`)
- [ ] Make the header title look clickable (or replace it as part of the redesign)
- [ ] Render Notion text background colors (`*_background` annotations are currently ignored)
- [ ] Keep a confidential article unlocked across reloads (e.g. keep the article token in sessionStorage)
- [ ] Rate-limit `/api/check-passcode` against passcode brute force
- [ ] Migrate `@notionhq/client` v2 → v5 (v2 still ships `node-fetch`; v5 uses data sources API)
- [ ] Migrate ESLint 8 + airbnb (`.eslintrc.js`) to ESLint 9 flat config
- [ ] Replace `<img>` with `next/image` for Notion images (only remaining lint warning)
- [ ] Rewrite `v2/README.md` (still the upstream template's README)
- [ ] Verify quote rendering on a real post where a paragraph is merged into a quote

## Completed
- [x] Post status rules: Not started hidden, In progress = "Upcoming", Published/Confidential readable, "recent" badge only on readable posts ≤14 days old (2026-11-21)
- [x] Drafts and unknown slugs return a real HTTP 404 (2026-11-21)
- [x] Confidential article content served only after server-side passcode check (2026-11-21)
- [x] Comments on confidential articles require a per-article token issued by the passcode check (2026-11-21)
- [x] Circular icon back button and smooth scroll-to-top button on articles (2026-11-21)
- [x] Notion data fixes: block pagination, full rich_text (no 2000-char truncation), date-ordered prev/next, nested lists, mentions (2026-11-21)
- [x] Inline text formatting (bold/italic/strike/underline/code) and mixed-format quotes (2026-11-21)
- [x] Dark styles follow the site toggle; no theme flash on load (2026-11-21)
- [x] Upgrade to Next 16 + React 19; `npm audit` clean (2026-11-21)

## Deferred / Reconsidered
- HTTP 204 / 401 for missing article pages: rejected in favor of 404 — a 204 has no body (the 404 page could not render) and 401 means "authenticate", which doesn't apply. 401 is used where it fits (wrong passcode, comments without a valid token).

## Decisions
- Article tokens are HMAC-signed with a key derived from `NOTION_TOKEN` (no extra env var). Rotating the Notion token revokes all tokens. Tokens last 24h and are bound to one slug.
- All status → visibility rules live in `v2/lib/postMeta.js`; pages and APIs must use it rather than reading `Status` directly.

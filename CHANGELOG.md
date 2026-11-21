# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions refer to `v2/package.json`.

## [Unreleased]

### Added
- Circular back button (arrow icon, no label) at the top of every article, linking to the post list.
- Scroll-to-top button (equilateral triangle in a circle) that appears after scrolling 400px and scrolls smoothly to the top (instantly if the reader prefers reduced motion).
- Per-article browser tab titles and descriptions (`<title>` was previously never set on articles).
- Article tokens: a correct passcode now also returns a 24-hour token, valid for that article only, which the comments API requires for confidential posts.

### Changed
- Post list tags follow the Notion Status: `Not started` posts are hidden, `In progress` posts show "Upcoming" and are not clickable, and only Published/Confidential posts written in the last 14 days get "RECENT RELEASE".
- Prev/next article navigation follows the Written date of published posts instead of slug number ± 1.
- Status codes: unpublished or unknown articles return 404 (previously 200); wrong passcode returns 401; comments on a confidential post without a valid token return 401; invalid comment input returns 400.
- Upgraded Next.js 15.3 → 16.4 and React 18 → 19. `npm run lint` now runs the ESLint CLI (`next lint` was removed in Next 16).
- The 404 page moved to the app root and now covers any unknown URL.

### Fixed
- Confidential articles leaked their full content in the page source; content is now only sent after the server verifies the passcode.
- Comments on confidential articles could be read and written by anyone through `/api/comments`.
- Unpublished (`Not started`) posts showed "RECENT RELEASE" and were clickable.
- Articles with more than 100 blocks were cut off.
- Long comments, summaries, code blocks and captions were cut off after the first 2000-character chunk; long comments failed to save.
- Nested bulleted/numbered lists were never rendered.
- Text containing @-mentions or equations crashed the renderer.
- Bold, italic, strikethrough, underline and inline-code formatting were ignored.
- Quotes with mixed formatting broke onto a new line at every formatting change.
- Dark mode: list-card dark styles never applied (CSS-module class renaming), and article code/table styles followed the OS setting instead of the site toggle.
- Light theme flashed briefly on load for dark-mode readers.
- Invalid HTML in the post list (`<li>` inside `<a>`, `<p>` inside `<h3>`).
- `url.parse()` deprecation warning (DEP0169) from the Notion SDK's bundled `node-fetch`.
- Security advisories in Next.js and other dependencies (`npm audit`: 0 vulnerabilities).

### Removed
- Upstream template author metadata from `v2/package.json`.

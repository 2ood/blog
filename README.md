# [version 2 up!] blog
I build my own blog space from scratch!

Check out ver2 at [2ood-blog.vercel.app](https://2ood-blog.vercel.app)

## v2 at a glance
- Next.js 16 (App Router) + React 19, content from Notion databases via `@notionhq/client`.
- Post visibility follows the Notion `Status` property (see `v2/lib/postMeta.js`): Not started → hidden, In progress → "Upcoming", Published → public, Confidential → passcode-protected (content and comments).
- Environment variables (`v2/.env`): `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NOTION_DATABASE_COMMENTS_ID`, `NOTION_DATABASE_PASSCODES_ID`, `POSTS_PER_PAGE`.
- `cd v2 && npm install && npm run dev`; `npm run lint` runs ESLint with `--fix`.

See [ROADMAP.md](ROADMAP.md) and [CHANGELOG.md](CHANGELOG.md).

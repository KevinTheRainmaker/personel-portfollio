# RCC public OAuth documents

- Application home page: https://portfolio.kangbeen.my/rcc
- Privacy policy: https://portfolio.kangbeen.my/rcc/privacy
- Publisher/contact: Kangbeen Ko; existing public portfolio contact email.
- Effective date: 2026-11-23 (Asia/Seoul).

Static Next.js pages, publicly accessible without account authorization. No Google
data, workbook IDs, credentials or actual tasks are embedded. Existing portfolio
navigation does not link to them. RCC home and policy may link to each other.
`noindex, nofollow` requests search exclusion; this is not access control and does
not prevent a person who knows the URL from reading or sharing it. No robots crawl
block is added, so Google can inspect the pages for OAuth branding.

LayoutShell renders these routes without portfolio sidebar/mobile nav/chat or chat
session storage. The public portfolio context projection and response-link
allowlist exclude both RCC documents, as explicitly requested by the user.

Privacy facts were checked against RCC Calendar collection, app-created calendar
registration, Sheets relay/context, legacy-mail retirement, encrypted storage and
explicit deletion commands. Revi processing and Google-hosted journals are disclosed
separately from local RCC processing. Publication does not assert Google verification,
legal certification, or recovery of expired Mac credentials.

Validation commands: `npm run test:chat`, `npm run test:publications`, `npm run build`.
Run `scripts/browser-rcc-pages-check.js` with a Playwright page against the built
server; it checks direct URLs, metadata, search exclusion, absence of chat/navigation,
contact/policy sections, mobile overflow and absence of RCC links in portfolio pages.
Final observed results are recorded below after verification.

Local result: chat22/publications10 PASS; production build and typecheck PASS. Browser RCC8 and existing portfolio19 results PASS; desktop intro and mobile policy screenshots reviewed. No console/page errors. Deployment verification pending.

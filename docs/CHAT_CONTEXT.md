# Portfolio chat context

## Public website is the source of truth

The deployed Next.js `/api/chat` uses deterministic full context assembled from
**only the records and text fields displayed on the current website**. It does not
serialize the complete authoring JSON, crawl the site, or retrieve from a separate
biography/index. A normal site build/deployment updates the evidence.

`src/lib/portfolio-context.ts` exposes `buildPublicSiteContent` and
`publicSiteContent`. The explicit field projection covers:

- Home/Research: identity, biography, research descriptions/keywords, background,
  current position, advisor, and displayed public contact links from `siteConfig`.
- CV: displayed education, experience, projects, awards, skills and other experience.
- Papers/CV: the same `selectPublishedPublications` selector used by the pages,
  requiring `status === "published"`. Evidence includes the displayed title,
  authors, venue, date, link, Summary disclosure and Featured marker.

Under-review, accepted, preprint and unspecified-status publication records are
excluded. Raw abstracts, media metadata, unrendered fields and future sections are
not automatically included. Existing source data is preserved for authoring.
`validateResponseLinks` derives its allowlist from this same public projection,
not from hidden source records.

A brief study mention currently shown in a Research description remains public
text. That mention does not authorize the chatbot to retrieve excluded publication
metadata, submission status, authors, abstract or additional findings. The prompt
explicitly separates public research descriptions from the displayed publication list.

Linked PDFs/external websites and media contents are not ingested. A link is only
a reference. Legacy `lib/` and `python/` chatbot implementations do not serve this route.

## Conversation freshness

A SHA-256 revision of the public context is passed by the server layout to the chat
provider. The client stores conversations by revision and sends that revision with
its request. Legacy/stale stored conversations are cleared. The API ignores history
when the revision is absent or does not match current evidence, while still answering
the new message. Only user/assistant text history is accepted; history never replaces
the system evidence. Public content changes invalidate old conversation evidence.
Unpublished-only source edits do not change the public-context revision.
A new client also adopts a changed response revision in an already-open tab,
keeping only the current question and fresh answer. Previously deployed JavaScript
requires one refresh to load this behavior; the server still rejects its stale history.

This prevents old responses based on excluded source records from being automatically
reintroduced after the correction. Visitor claims and any prior answer remain
unverified even within the current version; the model is instructed to ground facts
in the displayed content. This is not a guarantee against all model hallucinations.

## Maintenance

1. Edit the shared data actually displayed by the page. Do not create a second copy
   of a biography or project-specific answers in the behavioral prompt.
2. If a new field is displayed, deliberately add it to the public projection and
   test that it is included. Undisplayed fields must remain excluded by default.
3. If a page's visibility rule changes, update the shared selector and its tests.
   Preserve boundaries between items, roles and findings.
4. These public inputs are sent to the configured model provider. Optional Langfuse
   tracing remains unchanged; this does not change third-party retention policies.

Run `npm run test:chat`, `npm run test:publications` and `npm run build` in `frontend`.
`CHAT_CONTEXT_REPORT=1 npm run test:chat` reports public record counts and a rough
character-count token estimate. Review context growth when adding public content.

## Verification (2026-11-22)

Source-level tests cover exact equality with the public publication selector,
exclusion of hidden manuscripts/abstracts/fields/sections/links, retained displayed
research/CV content, and revision changes only for public content changes. History
and route tests use synthetic requests/provider mocks. Final build and production
results are recorded after completion; no guarantee of all possible LLM answers
is implied by source coverage.

Local verification: chat/context/history/API contract tests 20 PASS; publication
regressions 10 PASS; production build and TypeScript checks PASS. Browser checks
passed legacy/stale storage cleanup, current conversation reload, open-tab response
revision transition, and 19 existing layout/chat/media cases across 1920, 1440,
768 and 390 widths. Primary and fallback model requests were mocked for API contract
tests; live model behavior is checked separately after deployment. Security review
found no blocking issue; its open-tab revision finding was fixed and browser-tested.

Production verification: code commit `118a7c1af5b4a32c19d70df683fefc5debc65ce1`
received Vercel success and served `https://portfolio.kangbeen.my` on 2026-11-22.
Two live `/api/chat` requests returned HTTP 200 with context revision
`cdecc405b16c62c1cb9d175bf4398d85161d4d6eb716bc9c90f29f7f3ffa3656`.
The published-list question returned the six displayed publications. A question
about excluded manuscript metadata with a synthetic stale-history sentinel declined
to supply those details and did not repeat the sentinel. No hidden source record,
credential or private manuscript content was sent as a test question. These are
observed sample responses, not a universal claim about model behavior.

# Portfolio chat context

## Architecture and sources

The deployed Next.js `/api/chat` uses a deterministic full-context prompt, not RAG.
`src/lib/portfolio-context.ts` assembles the context once per server module instance
from the exact sources used by the pages:

- `data/profile-data.json`: education, skills, publications, experience, projects,
  awards and other experience. `frontend/scripts/sync-data.js` copies this source
  into the frontend before development/build. Do not edit the generated copy.
- `frontend/src/lib/profile.ts` / `siteConfig`: home introduction and identity,
  research areas, research background/motivation, detailed current position,
  advisor, and public contact links. Home and Research render these same fields.

Every record and field is included, with section/page labels and intact record
boundaries. New fields are automatically included; no second biography, embedding
index, retrieval tuning or model-generated summary is maintained. Static context
is followed by existing date-aware answer instructions and conversation history.
There is no runtime crawl or additional LLM call. Normal build/deploy is required
for changed content to reach production.

This covers the site's public textual profile content, not literal UI chrome,
external linked pages/PDF contents, images, GIFs, videos or legacy CV markdown.
Those assets are not silently interpreted as evidence. A link is only a reference.
The old `lib/` and `python/` chatbot implementations are not used by this route.

## Maintenance approach

1. Update the field where the information already appears on the site. In particular,
   background belongs in `siteConfig.background`; project roles/outcomes belong in
   that project's existing description; paper implications belong in its summary.
2. Do not copy these facts into the behavioral prompt. It specifies how to answer,
   not a second version of the CV. No hardcoded project-specific answer examples.
3. Keep new substantive page prose in a shared source rather than inline JSX.
   For a new profile section, ensure the page renders it and add its page route to
   `sectionPages` if applicable. All fields are already included in context.
4. Keep a role or finding attached to its own item. If individual contribution or
   evaluation is not documented, leave it unknown rather than infer it from authorship.
5. These are public inputs sent to the model provider. Do not add private notes,
   unpublished confidential details or secrets. Existing optional Langfuse logging
   behavior is unchanged; this change is not a promise about provider retention.

Run `npm run test:chat` and `npm run build` in `frontend` after updates.
`CHAT_CONTEXT_REPORT=1 npm run test:chat` reports counts, characters and a rough
characters/4 token estimate (not a provider tokenizer or measured request usage).
Review growth before adding lengthy documents. Full context avoids retrieval failure,
but input tokens still affect cost/latency; no speed improvement is claimed.

## Coverage and limitations

Tests check every current profile record and all site configuration are included,
that Research reads shared context, that new fields flow through automatically,
and that links supplied by those sources survive the response-link validator.
This is source/contract coverage, not a guarantee of factual LLM output quality.
Production answer tests require configured model access and should probe motivation,
individual contributions, under-review status and unsupported claims separately.

# AffectUI integration

Installed on 2026-11-22 with the official shadcn registry:

```sh
npx shadcn@latest add https://www.affectui.com/r/button.json https://www.affectui.com/r/icon-button.json https://www.affectui.com/r/text-field.json https://www.affectui.com/r/badge.json https://www.affectui.com/r/card.json
```

The vendored files in `frontend/src/components/ui` are official AffectUI sources, not recreated lookalikes. Each of the following official component pages labels its source free and open source under MIT:

- [Button](https://www.affectui.com/components/button): chat controls and publication animation playback
- [Icon Button](https://www.affectui.com/components/icon-button): chat reset/open/close
- [Text Field](https://www.affectui.com/components/text-field): desktop/mobile chat input
- [Badge](https://www.affectui.com/components/badge): research keywords and publication metadata
- [Card](https://www.affectui.com/components/card): research areas and featured publications

Attribution: AffectUI (https://www.affectui.com/). Upstream source comments are retained. The registry responses do not include a separate copyright notice or license file; source licensing is documented by the official pages linked above. No Pro component is included. No runtime dependency was added; these files use the existing React 19 installation. The shadcn CLI was used only to install source files.

`globals.css` maps documented `--aui-*` variables to the existing portfolio palette and scopes layout/typography adjustments to portfolio card/input classes. Native links remain links. Navigation, published-only selection, featured order/media policy, document-style CV, IME-safe chat send, local chat persistence and backend contracts are preserved. No reaction counters or unsupported feedback backend was introduced.

Reinstallation may update upstream source: inspect the diff, repeat the UI/keyboard/reduced-motion checks and preserve the portfolio theme adapter. CV, profile data and RCC are not part of this component migration.

## Verification

Results and production deployment are recorded below after checks complete. Browser checks use mocked chat responses, never send a real message to the public chatbot, and cover desktop/mobile navigation and input behavior.

Local verification (2026-11-22): publication tests 10/10, chat tests 11/11, TypeScript and production build PASS. The browser function in `frontend/scripts/browser-affectui-check.js` can be passed as code to a Playwright page runner. It returns 19 checks covering four pages at 1920, 1440, 768 and 390 pixels, unchanged publication/CV rules, keyboard summary expansion, desktop/mobile chat with mocked responses, IME Enter protection, loading duplicate guard, retained history, reset, internal navigation and reduced-motion playback. Ran against both development and production builds; final production pass had no console/page errors. Screenshots were inspected for desktop research/publications and mobile research/chat. No real chatbot request was sent. An independent read-only security review found no blocking issue. Existing Browserslist stale-data warning remains non-blocking.

Production: commit `fe7f90e3887ffa822b1d3a825ed8976c2814277a` deployed successfully through the existing Vercel integration on 2026-11-22. Live https://portfolio.kangbeen.my checks confirmed Home/Research cards, Papers cards/badges and removed left accent, CV document layout, mobile chat open/close and visible Send label. No real chat message was submitted. The prior user commit `a23aba1` is preserved in history. RCC was not changed.

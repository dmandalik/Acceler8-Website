# Accelr8 Management Consulting — website

A static multi-page site. No build step, no dependencies, no framework.

| File | Page |
|------|------|
| `index.html` | Home — positioning, the adoption gap, four capabilities, contact |
| `ai-strategy.html` | AI Strategy — blockers, and the three-step roadmap process |
| `process-improvement.html` | Process Improvement — workflow re-engineering, governance, sales automation, syndication |
| `ai-marketing.html` | AI Marketing — analytics, competitive intelligence, content, outreach |
| `automation.html` | Automation & RPA — capability, case study, scope, engagement model |
| `cases.html` | Cases — Element Group, Giant Eagle, Goodyear, finance automation |
| `blog.html` | Blog index + newsletter signup |
| `blog-can-we-talk.html` | Post — *Can we Talk?*, Patrick C. Cox, 24 Jun 2025 |
| `blog-marriott-mistake.html` | Post — *The Marriott Mistake*, Patrick Cox, 27 Jun 2024 |
| `styles.css` | Shared design system |
| `script.js` | Mobile nav, enquiry form → `mailto:`, footer year |

## Run locally

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design system

Typographic register is modelled on Francisco Partners and TA Associates: light
display weights, restrained sizes, one muted accent, no uppercase tracked-out
labels.

| Token | Value | Use |
|-------|-------|-----|
| `--crimson` | `#8a0e0e` | The single accent, carried over from accelr8iq.com |
| `--ink` | `#17171a` | Body copy |
| `--night` | `#16161a` | Dark sections and heroes |
| `--wash` / `--wash-2` | `#f6f4f1` / `#efece7` | Warm section grounds |
| `--line` | `#e3e0da` | Hairline rules |

**Newsreader** (serif) carries every statement at weight **300**; **DM Sans**
carries body copy and interface at 400/500. Nothing is set at 700 — weight, not
size, is what reads as institutional. Both load from Google Fonts.

Section headers are a hairline rule with a quiet index and label sitting on it,
then the statement below (`.rule-top` > `.sec-n` + `.sec-label`, then `.d2`).
This deliberately replaces the small tracked-out badge stacked over a headline.

Content patterns are ruled rather than boxed: `.ruled-grid` for capability
columns, `.numbered` for challenge lists, `.stages` for engagement steps,
`.figures` / `.figure` for statistics, `.versus` for the two-column contrast,
`.marks` for bulleted lists. There is no card component.

## Hero video

The homepage hero carries the same looping background footage as
accelr8iq.com, referenced from Pexels at its original URL (~6.8 MB):

    https://videos.pexels.com/video-files/20533695/20533695-hd_1280_720_30fps.mp4

It is `muted`, `loop`, `playsinline`, `preload="metadata"`, and sits at
`z-index: 0` beneath the brand gradient and a left-weighted scrim, so white type
stays legible over any frame. The gradient hero is fully composed on its own —
if the video is slow, blocked or missing, nothing looks broken.

- **Hidden below 900px** so phones never pull ~7 MB.
- **Removed entirely** under `prefers-reduced-motion`.
- A rejected `play()` is **retried on first interaction** rather than treated as
  failure — Safari and data-saver modes defer autoplay rather than refusing it.
  Only a real load `error` removes the element.

To host it yourself instead, save the file into the repo and point the `<video
src>` at it — that removes the third-party dependency.

## Long-form articles

Blog posts set `<body class="doc">`, which switches off the one-section-per-
viewport rule (`min-height: 0; display: block; scroll-snap-align: none`). Prose
must scroll as a document, never be forced into screen-sized blocks. Article
copy lives in `.prose`, capped at 44rem.

## Screen layout## Hero video

The homepage hero carries the same looping background footage as
accelr8iq.com, referenced from Pexels at its original URL (~6.8 MB):

    https://videos.pexels.com/video-files/20533695/20533695-hd_1280_720_30fps.mp4

It is `muted`, `loop`, `playsinline`, `preload="metadata"`, and sits at
`z-index: 0` beneath the brand gradient and a left-weighted scrim, so white type
stays legible over any frame. The gradient hero is fully composed on its own —
if the video is slow, blocked or missing, nothing looks broken.

- **Hidden below 900px** so phones never pull ~7 MB.
- **Removed entirely** under `prefers-reduced-motion`.
- A rejected `play()` is **retried on first interaction** rather than treated as
  failure — Safari and data-saver modes defer autoplay rather than refusing it.
  Only a real load `error` removes the element.

To host it yourself instead, save the file into the repo and point the `<video
src>` at it — that removes the third-party dependency.

## Long-form articles

Blog posts set `<body class="doc">`, which switches off the one-section-per-
viewport rule (`min-height: 0; display: block; scroll-snap-align: none`). Prose
must scroll as a document, never be forced into screen-sized blocks. Article
copy lives in `.prose`, capped at 44rem.

## Screen layout

Every top-level `<section>` occupies at least one viewport, so no section
straddles the fold and nothing bleeds into the next. Three rules make this hold:

- `min-height: calc(100svh - var(--header-h))` — **min**-height, never `height`,
  so a section that genuinely needs more room grows instead of clipping.
- `scroll-snap-type: y proximity` on `<html>` — snaps to section starts without
  trapping the scroll the way `mandatory` does.
- Vertical rhythm scales with viewport **height**, not just width. The
  `--pad-section`, `--gap-head`, `--gap-grid`, `--pad-card` and `--pad-field`
  tokens are `vh`-based clamps, so a section that fits a 900px screen also fits
  a 768px one without re-cutting the copy.

Below 900px wide (or under 620px tall) the whole system switches off and
sections flow naturally — a 100vh section on a phone would guarantee the
overflow it is meant to prevent.

**If you add content to a section, re-check it fits.** Paste this in the console:

```js
(function(){const B=innerHeight-74;return [...document.querySelectorAll('main > section')]
  .map((s,i)=>({n:i+1,over:Math.round(s.getBoundingClientRect().height-B)}))
  .filter(x=>x.over>1);})()
```

An empty array means every section fits. Verified at 1440x900, 1280x800 and
1366x768 across all six pages.

## Moving through the site

All of this is progressive enhancement. `script.js` sets `html.js-tx` before
first paint, and the reveal styles are scoped to that class — **if the script
fails or is blocked, the page renders fully visible and static rather than
blank.**

| | |
|---|---|
| **Scroll reveal** | Content fades and rises as it enters view, staggered up to 350ms within a section. Reveals inner elements, never the `<section>` — transforming a snap target fights the snap it is aligned to. |
| **Section rail** | Dots on the right, one per section, labelled on hover. Click to jump. Active dot tracks scroll. Shown at ≥1100px wide. |
| **Keyboard** | `PageDown` / `PageUp` move a section at a time; `Home` / `End` jump to the ends. Arrow keys are left alone for normal scrolling. Ignored while typing in a field or with the mobile menu open. |
| **Progress bar** | 2px crimson bar under the header, tracking scroll depth. |
| **Between pages** | The View Transitions API cross-fades navigations in Chrome, Edge and Safari 18+. A silent no-op elsewhere. |

Nothing can stay hidden. Three layers guarantee it: the IntersectionObserver
reveals on entry; a sweep on every scroll frame reveals anything whose top is
above the viewport bottom, even if its observer entry never fired; and if
`IntersectionObserver` is missing entirely, everything is revealed immediately.

`prefers-reduced-motion` keeps the rail, bar and paging, and drops all movement.

Rail labels come from each section's `<h1>`/`<h2>`, falling back to its
`.eyebrow`. A section with neither needs an explicit `data-nav-label="…"` — the
stat bands use this.

## Enquiry form

The form has no backend. On submit it opens the visitor's email client with a
message pre-addressed to **iwanttogofast@accelr8iq.com** (`RECIPIENT` at the top
of `script.js`). The same form appears on every page.

To move to in-page submission later:

- **Formspree** — create a form, then replace the handler in `script.js` with
  `fetch("https://formspree.io/f/XXXX", { method: "POST", body: new FormData(form) })`.
- **Netlify Forms** — add `data-netlify="true"` and a hidden `form-name` input to
  each `<form>`, then deploy to Netlify.

## Editing content

All copy lives in the HTML as plain text. The header and footer are duplicated
across the six pages — if you change a nav item, change it in all six.

Reusable building blocks in `styles.css`: `.stat-row` / `.stat` for the number
strips, `.card` (add `.card-num` for the numbered variant), `.rule-list` for the
divided scope lists, `.steps` / `.step` for numbered engagement stages, `.ticks`
for bulleted lists, and `.case` for case studies. Section backgrounds are set
with `.band-haze`, `.band-blush` or `.band-night` on the `<section>`.

## Deploy

Any static host — drag the folder into **Netlify** or **Cloudflare Pages**, or
push to **GitHub Pages** (Settings → Pages → deploy from `main` / root).

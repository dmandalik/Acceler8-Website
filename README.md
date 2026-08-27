# Accelr8 Consulting — website

A single-page static site. Three files, no build step, no dependencies:

| File | Purpose |
|------|---------|
| `index.html` | All content and structure |
| `styles.css` | Editorial light-theme layout, responsive |
| `script.js` | Mobile nav, contact-form → `mailto:`, footer year |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Contact form

The form has no backend. On submit it opens the visitor's email client with a
message pre-addressed to **ksarwal3@gatech.edu**, CC **sganjoo@iu.edu** and
**dhruvm2310@gmail.com**. Recipients are set at the top of `script.js`
(`RECIPIENT` / `CC`).

To move to an in-page submission later, either:

- **Formspree** — create a form, then change the handler in `script.js` to
  `fetch("https://formspree.io/f/XXXX", { method: "POST", body: new FormData(form) })`.
- **Netlify Forms** — add `data-netlify="true"` and a hidden `form-name` input to
  the `<form>` in `index.html`, then deploy to Netlify.

## Deploy

Any static host works — drag the folder into **Netlify** or **Cloudflare Pages**,
or push to **GitHub Pages** (Settings → Pages → deploy from `main` / root).

## Editing content

All copy lives in `index.html` as plain HTML. Section order: hero → method →
what we build → scope → results → selected work → approach → benchmark → team →
contact → footer. Brand colour is `--accent` in `styles.css`.

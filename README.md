# Nevan Vu's personal website

A one-page portfolio built with Next.js and exported as static files.

## Editing content

Everything the site says lives in [`content.ts`](content.ts). Before deploying, replace the fields marked `TODO`:

- `email` and `linkedin` in `profile`
- `resume`: put your PDF at `public/resume.pdf`
- `projects`: swap in real projects and remove `placeholder: true`

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Building

```bash
npm run build
```

The static site is written to `out/`. Deploy that folder to Vercel, Netlify, Cloudflare Pages or GitHub Pages.
If you host it at a sub-path (for example `nevanvu.github.io/personal_web`), set `basePath` in `next.config.ts`.

# Development & Deployment

Single guide for working on the site: local setup, commands, project layout and
how it reaches production. Replaces the old BUILD_SETUP / DEPLOYMENT /
GITHUB_PAGES_SETUP / QUICKSTART / QUICK_START files.

- **Repository**: https://github.com/ivandeinichenko/ivandeinichenko.github.io
- **Live site**: https://ivandeinichenko.github.io/

---

## Prerequisites

- Node.js 20+ and npm
- The site is a static, dependency-free page. There is no backend, no database
  and no API — everything ships as HTML, CSS and a ~5 kB JS bundle.

## Setup

```bash
git clone https://github.com/ivandeinichenko/ivandeinichenko.github.io.git
cd ivandeinichenko.github.io
npm install
cp .env.example .env.local     # then set VITE_ENABLE_LOGS=true to see debug logs
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 (Vite, HMR) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` on http://localhost:4173 |
| `npm run lint` | ESLint over `js/*.js` with `--fix` |
| `npm run format` | Prettier over `js/**/*.js` and `css/**/*.css` |
| `npm run format:check` | Same, but fails instead of writing |

Before pushing, `npm run lint` and `npm run format:check` should both be clean.

## Project layout

```
index.html            all markup + <head>: SEO meta, canonical, OG/Twitter,
                      JSON-LD Person, favicon, fonts, gtag, theme anti-flash
css/
  themes.css          colour tokens (:root = dark, html[data-theme="light"])
  main.css            layout and components
  animations.css      keyframes + prefers-reduced-motion
  responsive.css      760px breakpoint + print styles
js/
  theme-switcher.js   theme state, system preference, `themechange` event
  main.js             smooth scroll, active nav highlighting
  analytics.js        GA4 events on top of gtag
  utils/logger.js     console wrapper gated by VITE_ENABLE_LOGS
public/               copied to the site root verbatim
  assets/             favicon.ico, og-image.png, pdf/CV_*.pdf
  robots.txt, sitemap.xml
specs/                this guide, DESIGN.md, ENVIRONMENT_VARIABLES.md, og-image.html
docs/                 personal notes and drafts; gitignored
.github/workflows/deploy.yml
.claude/launch.json   dev-server config for the Claude Code preview pane
```

Two rules worth remembering:

- **Static files live only in `public/`.** `publicDir` is set to `public`, so a
  duplicate `assets/` at the repo root would never reach the build and would
  silently drift out of sync. There used to be exactly that problem.
- **`base` is `/`**, because the site is served from the domain root
  (`ivandeinichenko.github.io`), not from a project subpath.

## Environment variables

Only one: `VITE_ENABLE_LOGS`, which gates the debug logger. Details, file
precedence and the logger API are in [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md).

CI sets `VITE_ENABLE_LOGS=false` explicitly for production builds.

---

## Deployment

Deployment is automatic. **Pushing to `main` publishes the site** —
there is no manual upload step and no `gh-pages` branch.

`.github/workflows/deploy.yml` runs two jobs:

1. **build** — checkout, Node 20 with npm cache, `npm ci`, `npm run build`,
   then upload `dist/` as a Pages artifact.
2. **deploy** — waits for build, publishes the artifact to the `github-pages`
   environment.

The workflow also accepts `workflow_dispatch`, so it can be re-run by hand from
**Actions → Deploy to GitHub Pages → Run workflow** without a new commit.

### One-time repository settings

**Settings → Pages → Source** must be **GitHub Actions** (not "Deploy from a
branch"). This is already configured; it only matters if the repo is recreated.

### Branch protection

The repository has rules requiring **verified signatures** and **changes through
a pull request**. Accounts with bypass permission can still push to `main`
directly — the push succeeds but prints the violations. Prefer a PR unless you
intend to bypass.

### Verifying a release

After the workflow goes green:

```bash
curl -s https://ivandeinichenko.github.io/ | grep -o '<title>[^<]*</title>'
curl -s -o /dev/null -w '%{http_code}\n' https://ivandeinichenko.github.io/sitemap.xml
```

GitHub Pages caches aggressively; a hard reload may be needed to see changes in
a browser that already has the old page.

### Custom domain

Not currently used. To add one: put a `CNAME` file containing the domain in
`public/`, point DNS at GitHub Pages, and set the domain in **Settings → Pages**.
Then update the absolute URLs in `index.html` (canonical, `og:url`, `og:image`,
JSON-LD `url`/`image`) and in `public/sitemap.xml` and `public/robots.txt`.

---

## Troubleshooting

**Workflow does not start** — check that Pages source is *GitHub Actions* and
that Actions are enabled for the repository.

**Build fails in CI but works locally** — CI runs `npm ci`, which installs
strictly from `package-lock.json`. Commit the lockfile alongside dependency
changes.

**Site deployed but assets 404** — something referenced a path outside
`public/`, or `base` in `vite.config.js` no longer matches where the site is
served from.

**Port 3000 already in use** — `.claude/launch.json` has `autoPort: true`, and
`vite.config.js` honours the `PORT` env var, so the preview picks a free port
automatically. For a plain terminal run: `PORT=3001 npm run dev`.

**Theme flashes on load** — the pre-paint theme script is inline and blocking in
`<head>` by design. Moving it into a module would reintroduce the flash, because
modules are deferred and run after the first paint.

---

## Design and content

The visual system (tokens, typography, grids, the list of things the design
forbids) is documented in [DESIGN.md](DESIGN.md), with a condensed version in
the repository's `AGENTS.md`.

`og-image.html` in this folder is the source for `public/assets/og-image.png`.
To regenerate: open it at a 1200×630 viewport and screenshot the `.card`
element.

> **Where docs live:** shared documentation belongs in `specs/` and is committed.
> `docs/` is gitignored and holds personal notes and drafts — nothing there
> should be treated as project documentation.

# Ivan Deinichenko - Portfolio Website

Portfolio website presenting my work as a Senior Frontend Engineer, designed as an
engineering datasheet ("ID-13"): part number, specification table, field tests, work log.
Built with vanilla HTML, CSS and JavaScript — no framework, no runtime dependencies.

## Features

- **Datasheet design system**: one accent colour, 1px hairlines, square corners, no shadows or gradients
- **Theme Switching**: Light/Dark mode; follows the system preference until an explicit choice is made, then persists to localStorage
- **Expandable work log**: each role collapses to a single table row and expands to achievements and tech stack
- **Fully Responsive**: single 760px breakpoint, plus print styles
- **Accessible**: semantic HTML, ARIA labels, keyboard navigation, `prefers-reduced-motion` support
- **SEO**: canonical, Open Graph + Twitter Card with a generated og-image, JSON-LD `Person`, sitemap and robots
- **Analytics**: GA4 with declarative event tracking (`data-ga-*` attributes)

## Technologies

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, CSS-only animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **Vite**: Build tool for bundling and minification
- **Intersection Observer API**: section-view analytics
- **LocalStorage API**: Theme persistence

## Key Sections

1. **Hero**: name, dimension line, one-paragraph summary
2. **Specifications**: stack and measured output as a spec table
3. **Field Tests**: three featured engagements with metrics
4. **Work Log**: full history; rows expand to details and tech tags
5. **Side Projects**: book, YouTube channel, iOS app
6. **Contact**: CV download and contact links

## Performance

- Single CSS bundle (~9 kB) and a single JS bundle (~5.5 kB), both minified
- No images in the page itself, no canvas, no runtime dependencies
- Non-blocking font loading

## Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Reduced motion support
- High contrast mode compatible

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Environment Variables

One flag, `VITE_ENABLE_LOGS`, gates the debug logger (`js/utils/logger.js`).
Errors are always logged; everything else is suppressed unless it is `true`.

```bash
cp .env.example .env.local
# Edit .env.local and set VITE_ENABLE_LOGS=true
```

`.env.production` keeps it `false`, and CI sets it explicitly for release builds.
Full details in [specs/ENVIRONMENT_VARIABLES.md](specs/ENVIRONMENT_VARIABLES.md).

## Deployment

Pushing to `main` publishes the site: `.github/workflows/deploy.yml` builds the
project and deploys `dist/` to GitHub Pages. There is no manual step and no
`gh-pages` branch. The workflow can also be re-run by hand from the Actions tab.

See [specs/DEVELOPMENT.md](specs/DEVELOPMENT.md) for the full setup, project
layout and troubleshooting guide.

## Documentation

| Document | Contents |
|---|---|
| [specs/DEVELOPMENT.md](specs/DEVELOPMENT.md) | Setup, commands, project layout, deployment, troubleshooting |
| [specs/DESIGN.md](specs/DESIGN.md) | Visual system: tokens, typography, layout, motion, do/don't |
| [specs/ENVIRONMENT_VARIABLES.md](specs/ENVIRONMENT_VARIABLES.md) | `VITE_ENABLE_LOGS` and the logger API |
| [AGENTS.md](AGENTS.md) | Condensed project knowledge base for AI assistants |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## SEO

- Canonical URL
- Open Graph + Twitter Card, with a 1200×630 og-image
- JSON-LD `Person` structured data
- `robots.txt` and `sitemap.xml`
- Semantic HTML structure

## License

© 2025–2026 Ivan Deinichenko. All rights reserved.

The source code of this website is available for viewing purposes only.
No part of this project (including design, content, and code) may be
reused, copied, modified, or distributed without explicit permission.

## Contact

**Ivan Deinichenko**

- Email: ivan.deinichenko@gmail.com
- LinkedIn: [ivan-deinichenko](https://www.linkedin.com/in/ivan-deinichenko/)
- Telegram: [@frostklaat](https://t.me/frostklaat)
- Location: Serbia

## Acknowledgments

- Fonts: [Archivo](https://fonts.google.com/specimen/Archivo),
  [Archivo Black](https://fonts.google.com/specimen/Archivo+Black),
  [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) &
  [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)


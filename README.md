# Gate City IT

Marketing site for Gate City IT, a managed IT provider in Greensboro, NC.

Live at **[gatecityit.com](https://gatecityit.com)** (also reachable at
`gatecityit.dave-563.workers.dev`).

## Stack

- **[Astro](https://astro.build) 6** with the Cloudflare adapter
- Deployed to **Cloudflare Workers** via Wrangler
- No UI framework, no CSS framework, no build-time content layer

## Requirements

Node **22.12.0 or newer** (enforced by `engines` in `package.json`).

## Commands

| Command | What it does |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Build to `./dist` |
| `npm run preview` | Build, then serve through Wrangler (closest to production) |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run generate-types` | Regenerate Wrangler binding types |

`npm run dev` uses Astro's dev server, which is fast but does **not** run the
Cloudflare runtime. Use `npm run preview` when you need to check anything that
depends on Workers behaviour or bindings.

## Layout

```
src/pages/          one .astro file per route, each fully self-contained
public/             static assets served as-is
content/posts/      unused (see "Known cruft")
wrangler.jsonc      Cloudflare Worker config
```

Routes are `/`, `/privacy-policy`, and `/terms-of-service`.

## Conventions

**Pages are standalone.** There is no shared layout or component directory.
Each `.astro` file carries its own `<head>`, nav, footer, and a complete
`<style>` block — including its own copy of the `:root` colour palette. This
keeps any single page easy to read in one sitting, at the cost of real
duplication: **a palette or nav change has to be made in all three files.**
If the site grows much past three pages, extracting a layout is the obvious
next move.

**Icons are inlined Lucide.** The SVGs in `index.astro` come from
[Lucide](https://lucide.dev) (ISC licensed) and were pasted in directly rather
than added as a dependency, so there is no icon package to install and no extra
requests. They use `stroke="currentColor"`, so they inherit colour from CSS and
follow the palette automatically. To add one, copy the path data from the Lucide
site and drop it in alongside the others.

The LinkedIn mark in the contact section is the official brand glyph, not a
Lucide icon — Lucide does not ship brand logos. It is solid rather than stroked,
so it is sized slightly smaller (18px vs 20px) to match optically.

**The favicon must not contain live text.** `public/favicon.svg` is all paths.
It previously used an SVG `<text>` element set in Alameda Script, which meant it
only rendered correctly on machines with that font installed — everyone else saw
fallback sans-serif. If you edit it in Inkscape, run *Path → Object to Path* on
any text before saving.

**Alameda Script is the logo typeface, not a web font.** It appears only inside
the logo image and the favicon, both as baked-in shapes. The site itself renders
in `system-ui`. Using it as live web text would require a webfont licence, which
is sold separately from the desktop licence.

## Contact form

The form on the home page posts to [Web3Forms](https://web3forms.com). The
access key lives in a hidden input in `index.astro`; it is a public submission
key by design, not a secret. Submissions are emailed rather than stored.

The form also carries an SMS consent notice and records consent as a hidden
field — leave both in place, as they exist to satisfy carrier requirements for
A2P messaging.

## Deployment

```sh
npm run deploy
```

Deploys the Worker named `gatecityit`. `wrangler.jsonc` declares two bindings:

- `SESSION` — KV namespace, used by Astro's session support
- `ASSETS` — static files from `./dist`

A third binding, `IMAGES`, shows up in the deploy output but is not in
`wrangler.jsonc` — the Astro Cloudflare adapter enables it automatically for
image processing.

The KV namespace ID is pinned in `wrangler.jsonc` so deploys reuse the existing
namespace instead of provisioning a new one each time.

Deploying does not require a commit, so it is possible to ship something that
isn't in git. Worth committing first.

## SEO

`index.astro` carries a canonical URL, Open Graph tags, and a
`ProfessionalService` JSON-LD block listing the services, the towns served, and
the LinkedIn profile. If you add or rename a service card, update the JSON-LD
`hasOfferCatalog` to match.

## Known cruft

- **`content/posts/hello-world.md`** is placeholder lorem ipsum and is not
  rendered by any route.
- **`public/admin/`** contains an abandoned TinaCMS shell that points at a dev
  server on `localhost:4001`. There is no Tina config or dependency in the
  project, so it does nothing in production. Both it and `content/posts/` can be
  deleted unless a CMS is planned.

# Project 93 for Justice — website mockup

A clickable design mockup for the rebuild of **project93forjustice.co.uk**, built for client review
before anything is committed to WordPress.

**Live preview:** enable GitHub Pages on this repo (Settings → Pages → deploy from `main`, root folder),
or clone and open `index.html` — it runs from a double-clicked file, no server needed.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Home — hero, theme index, recent campaigns |
| `activities.html` | Poster grid in rows of 3, click to enlarge, arrows to cycle, X to close |
| `campaigns.html` | One full-height campaign card per viewport, scroll to the next |
| `campaign-*.html` | The full campaign page each card's CTA opens (3 of them) |
| `resources.html` | All 8 themes, each with a description and a way in |
| `theme-*.html` | **One page per theme** — every resource filed under it, as cards |
| `about.html` | About the project |
| `design-notes.html` | The four background texture options, for choosing between |

## Design

- **Orange-dominant**, per the brief — orange fills most of the field and falls away to near-black
  only in the top-right. A soft scrim darkens the top-left corner where page copy and the orange
  accent colour live; without it, orange-on-orange fails accessible contrast.
- **Contrast is measured, not eyeballed.** Every piece of text sitting directly on the background was
  sampled against the brightest background pixel behind it and checked against WCAG AA
  (4.5:1 body, 3:1 large). All pass.
- **Textured, never flat.** The orange carries a cracked stone surface generated in **SVG filters** —
  `feTurbulence` for the noise, `feDiffuseLighting` for the relief, `feDisplacementMap` to warp the
  cracks so they fracture organically. No image files, nothing to license, scales to any screen, and
  one variable dials it up for a hero or down for a content page.
- `design-notes.html` shows four strengths of that treatment side by side. **Option 4 is the one used
  across the site**; the others are there to argue with.

## Images and copyright

This mirrors the approach agreed for the real site:

- **Book covers are embedded live from the Open Library Covers API** using each item's ISBN. Nothing is
  copied onto our server — the image stays on Open Library's. That distinction is the legal one.
- **Films link out to TMDB** rather than hosting a poster. On the live site the poster is pulled from
  the TMDB API; here they render as text cards so nothing is hosted that shouldn't be.
- If a cover ever fails to load, the card **degrades to a readable text card** rather than a broken
  image. (Open Library redirects covers to archive.org storage nodes, and an individual node can be
  down or serve a bad certificate — so this does happen.)
- Attribution and a takedown notice sit in the footer of every page.

## What's real and what isn't

Nothing here invents the project's own history. There are **no made-up campaigns**, no made-up
activities and no made-up people — those are the client's to supply.

- **Real:** the 8 themes (taken from the current site), every book, every ISBN, every cover, the page
  structure, and all the behaviour.
- **Placeholder:** campaigns, activities, all images, and the "why it's here" note on each resource.
  They read as obvious placeholders on purpose, and the copy doubles as a hint at what belongs in
  each field.

## How this maps to WordPress

- **Campaign** custom post type → cover, title, description, leader, body. Each one generates its own page.
- **Resource** custom post type + **Theme** taxonomy → each theme term generates its own page.
  Resources store an **ISBN / TMDB ID**, not an uploaded image.
- **Activities** → a gallery of posters feeding the lightbox.
- The texture is theme-level CSS, so the client cannot break it while editing content.

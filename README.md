# web-cv

Personal CV / portfolio site. Single page, vanilla HTML/CSS/JS — no build step, no dependencies.

## Repo layout

```
web-cv/
├── README.md             ← project doc (this file, repo root)
├── .gitattributes        ← pins board.svg / board.wires.json to LF line endings
├── scripts/
│   └── build_wires.py    ← regenerate board.wires.json after editing board.svg
└── public/               ← serve this as the web root
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── i18n.js
    ├── board.svg
    ├── board.wires.json  ← prebuilt wire→component map (do not hand-edit)
    └── cv.pdf            ← drop the résumé here (the hero "résumé" link points to it)
```

Everything the browser fetches lives inside `public/`. The repo root only holds project-level files (README, future config, etc.).

## Run it

Serve `public/` over HTTP — `file://` won't work because `script.js` fetches `board.svg` and `board.wires.json`.

- `python3 -m http.server -d public` → open <http://localhost:8000>
- `npx serve public`
- For static hosts (Vercel, Netlify, GitHub Pages, Cloudflare Pages): set the **publish / output directory** to `public`.

No install, no compile.

## Adding the CV PDF

Drop your résumé at `public/cv.pdf`. The hero's "résumé ↗" button links to it via the relative path `cv.pdf`, so it resolves alongside `index.html`. Replace the file (or rename the link in `index.html`) to use a different filename.

## Files inside `public/`

- `index.html` — the page. One `<section>` per part of the CV; sections after the hero carry `data-board-step="0..6"` (about, education, skills, projects, experience, languages, contact) to drive the board animation.
- `styles.css` — all styling. Defines the reveal/glow/draw-on classes (`.comp`, `.glow-comp`, `.trace`, `.trace.from-b`, `.trace.lit`, `.lit`).
- `script.js` — ES module. Wires up i18n, parallax grid, fade-ins, active-nav highlighting, the floating "next section" button, and the SVG board build.
- `i18n.js` — structural data (skills, education, projects, experience items, languages, contact links) + per-locale translations + renderers for the list-shaped sections.
- `board.svg` — Inkscape SVG of a Raspberry Pi 5–style board.

## i18n

- Two locales: `en` (default), `sl`.
- **Structural data** (item ids, hrefs, icons, tags, skill names, education years, language proficiency bars) lives at module scope in `i18n.js` — single source of truth, edited once.
- **Translatable text** (titles, descriptions, category labels) lives inside `messages.{en,sl}` keyed by the same ids. `applyLocale` deep-merges the active locale onto `en`, so anything missing from `sl` falls back to its `en` value rather than rendering blank.
- Markup opts in via `data-i18n="path.to.key"` (textContent), `data-i18n-html="..."` (innerHTML, for `<strong>` etc.), or `data-i18n-attr="attr:path,attr:path"` (any HTML attribute). List-shaped sections use `data-render="skills|education|projects|experience|languages|contact"` and are rebuilt from the shared arrays + active-locale dict on every locale switch.
- Locale resolution: `?lang=` query param → `localStorage` → `navigator.language` → default.
- Toggle button (`[data-i18n-toggle]`) flips between the two and updates the URL.

## Board animation (the interesting bit)

How the SVG progressively builds itself as the user scrolls:

- **Inline injection**: `script.js` fetches `board.svg` and drops it into `#boardBg` via `innerHTML`. Browser-native rendering — every transform / mask / gradient survives intact.
- **Component discovery**: walks every direct child of the `components` layer. Key = `inkscape:label` (preferred) → `id` → synthetic. Each becomes a `.comp`; designated big clean-outline ones also get `.glow-comp`.
- **Reveal ordering** (`REVEAL_CHUNKS`): seven chunks, one per `[data-board-step]` section. Curated for spatial spread (each step lights up something in every part of the board) and visual cadence (USB ports last, GPIO header one step before). Anything discovered but not in the chunks falls into the last step.
- **Scroll → reveal**: a single rAF-throttled handler (one shared scroll listener for parallax, nav highlight, next-button visibility, and the board reveal) maps `scrollY` to a reveal index. Each `chunk[i]` is fully lit by the moment its section's title reaches the top of the viewport — i.e. chunk[i] reveals during the scroll range *leading up to* section[i], not while the user is reading section[i]. (Chunk 0 fills in over the hero; chunk 1 fills in while scrolling out of #about toward #education; and so on through to #contact.)
- **Wires** (`.trace`): the wire→component binding is precomputed offline by `scripts/build_wires.py` (uses `svgelements` to do the hit-test in SVG coordinates) and shipped as `public/board.wires.json`. The client fetches that JSON and binds wires by index. If the JSON is missing or malformed, wires simply don't render — components still light up — and a console warning points at the regenerate command. There's no runtime hit-test fallback. A wire is `.lit` only when both endpoints are lit.
- **Progressive draw**: `stroke-dasharray:100 / stroke-dashoffset:100→0` (path uses `pathLength="100"`). Direction is per-wire: if the path-end endpoint sits on the *earlier*-revealed component, the wire gets `.from-b` (dashoffset −100), so it always draws *from the already-visible component toward the new one*. Removing `.lit` retracts in reverse along the same direction.
- **Inkscape inline-style fix**: the Inkscape exporter dumps `style="...stroke-dasharray:none..."` on most paths, which would beat the CSS rule. JS strips that property at init so every wire animates.
- **CSS-only blending**: chassis stroke removed and `.board-bg svg` opacity dropped to ~0.45 so the green PCB fill fades into the page bg instead of reading as a panel. Edge-fade comes from two layers working together: the parallax `.bg-grid` carries a `radial-gradient` mask (opaque inside ~40%, fading to transparent at 100%) so the grid lines blend out, and `.board-bg` has an inset `box-shadow` vignette so the chassis, chips, and wires darken into the bg without the SVG itself being clipped.
- **No CSS `transform` on `.comp`**: SVG groups already carry `transform="translate(...)"` for positioning, and a CSS transform would override (not stack with) them. The reveal effect uses opacity + filter only, never transform.
- **Rotation at narrow widths**: under 900px the board flips 90° (CSS `transform: rotate(90deg)` with viewport-unit dimensions re-anchored to the rotated orientation), so the landscape PCB fits a portrait layout.

## Tweak points

- After editing `board.svg`: run `python scripts/build_wires.py` to regenerate `public/board.wires.json` (one-time `pip install svgelements`). Required — if you skip it, wires won't render until you do (components will still light up).
- Step composition: `REVEAL_CHUNKS` in `script.js`. (`build_wires.py` parses this same constant so both stay in sync — re-run the script after editing.)
- Glow set: `GLOW` in `script.js`.
- Reveal-cadence boundary: each chunk's range ends at its section's `offsetTop`; adjust by changing the `start` / `end` math in `updatePCBReveal()` if a different timing is wanted.
- Mask softness / chassis opacity: `.board-bg svg` and `.board-bg .pcb-base` in `styles.css`.
- Board rotation breakpoint: the `@media (max-width: 900px)` rule in `styles.css`.
- Reveal/draw timing: the `.comp` and `.trace` transition declarations in `styles.css`.
- Languages proficiency bars: `bars` field in `languageItems` (`i18n.js`) — accepts any 0–4 fractional value (quarters, percentages, anything).

# web-cv

Personal CV / portfolio site. Single page, vanilla HTML/CSS/JS — no build step, no dependencies.

## Run it

- Serve the directory over HTTP (the SVG is fetched, so `file://` won't work):
  - `python3 -m http.server` → open `http://localhost:8000`
  - or any static file server
- No install, no compile.

## Files

- `index.html` — the page. One `<section>` per part of the CV; sections after the hero carry `data-board-step="0..4"` to drive the board animation.
- `styles.css` — all styling. Defines the reveal/glow/draw-on classes (`.comp`, `.glow-comp`, `.trace`, `.trace.from-b`, `.trace.lit`, `.lit`).
- `script.js` — ES module. Wires up i18n, parallax grid, fade-ins, active-nav highlighting, and the SVG board build.
- `i18n.js` — translations dictionary + locale plumbing.
- `board.svg` — Inkscape SVG of a Raspberry Pi 5–style board.

## i18n

- Two locales: `en` (default), `sl`.
- Translations live in `messages` in `i18n.js`.
- Markup opts in via `data-i18n="path.to.key"` (textContent) or `data-i18n-html="..."` (innerHTML, for `<strong>` etc.).
- Locale resolution: `?lang=` query param → `localStorage` → `navigator.language` → default.
- Toggle button (`[data-i18n-toggle]`) flips between the two and updates the URL.

## Board animation (the interesting bit)

How the SVG progressively builds itself as the user scrolls:

- **Inline injection**: `script.js` fetches `board.svg` and drops it into `#boardBg` via `innerHTML`. Browser-native rendering — every transform / mask / gradient survives intact.
- **Component discovery**: walks every direct child of the `components` layer. Key = `inkscape:label` (preferred) → `id` → synthetic. Each becomes a `.comp`; designated big clean-outline ones also get `.glow-comp`.
- **Reveal ordering** (`REVEAL_CHUNKS`): five chunks, one per `[data-board-step]` section. Curated for spatial spread (each step lights up something in every part of the board) and visual cadence (USB ports last, GPIO header one step before). Anything discovered but not in the chunks falls into the last step.
- **Scroll → reveal**: a single rAF-throttled handler maps `scrollY` to a reveal index. Step boundaries are pulled left by ~0.4vh so step 0 starts late in the hero. Each step's range is mapped linearly through its chunk, so cadence is independent of section height.
- **Wires** (`.trace`): bound to two components by transforming each path's start/end through `getScreenCTM()` and hit-testing against component `getBoundingClientRect()`s. A wire is `.lit` only when both endpoints are lit.
- **Progressive draw**: `stroke-dasharray:100 / stroke-dashoffset:100→0` (path uses `pathLength="100"`). Direction is per-wire: if the path-end endpoint sits on the *earlier*-revealed component, the wire gets `.from-b` (dashoffset −100), so it always draws *from the already-visible component toward the new one*. Removing `.lit` retracts in reverse along the same direction.
- **Inkscape inline-style fix**: the Inkscape exporter dumps `style="...stroke-dasharray:none..."` on most paths, which would beat the CSS rule. JS strips that property at init so every wire animates.
- **CSS-only blending**: chassis stroke removed and opacity dropped so the green PCB fill fades into the page bg instead of reading as a panel; outer radial mask softens only the outermost ~10% so edge components keep detail.
- **No CSS `transform` on `.comp`**: SVG groups already carry `transform="translate(...)"` for positioning, and a CSS transform would override (not stack with) them. The reveal effect uses opacity + filter only, never transform.

## Tweak points

- Step composition: `REVEAL_CHUNKS` in `script.js`.
- Glow set: `GLOW` in `script.js`.
- Step lead-in offset: `lead = vh * 0.4` in `update()`.
- Mask softness / chassis opacity: `.board-bg svg` and `.board-bg .pcb-base` in `styles.css`.
- Reveal/draw timing: the `.comp` and `.trace` transition declarations in `styles.css`.

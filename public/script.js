// NOTE: after editing public/board.svg, regenerate public/board.wires.json:
//   python scripts/build_wires.py
// The wire→component mapping comes ONLY from that prebuilt JSON. If its
// data is missing or invalid, the wires don't render (components still
// light up).

import { applyLocale, detectLocale, setLocale, SITE_UPDATED } from './i18n.js';

document.getElementById('year').textContent = new Date().getFullYear();

// Apply current locale immediately
applyLocale(detectLocale());

// Language toggle button
document.querySelector('[data-i18n-toggle]')?.addEventListener('click', () => {
  const cur = document.documentElement.lang || 'en';
  setLocale(cur === 'en' ? 'sl' : 'en');
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 440px)').matches;

// Uptime Kuma badge endpoint — single source of truth, used by the
// terminal's "uptime" command (#4 feedback: defined as a constant rather
// than inlined where it's used). Monitor id 10 = combined/primary
// service per your example; swap the id if a different monitor should
// represent "overall" uptime.
const KUMA_URL = 'https://adela.pokorn.si/api/badge/13/uptime/744';

// Converts the SITE_UPDATED constant (an ISO date string, hand-bumped in
// i18n.js whenever a meaningful change ships) into a relative "X days
// ago" label instead of a literal date. Always English — the terminal's
// content doesn't follow the site's language toggle (#1 feedback).
function daysAgoLabel(isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  const diffMs = Date.now() - d.getTime();
  const days = Math.max(0, Math.round(diffMs / 86400000));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

// Element refs
const bgGrid = document.getElementById('bgGrid');
const navLinks = document.querySelectorAll('.nav-links a');
const inPageLinks = document.querySelectorAll('a[href^="#"]');
const navSections = [...document.querySelectorAll('section[id]')];
const nextBtn = document.getElementById('nextBtn');

// Subscribers added by lazily-loaded modules (e.g. PCB SVG IIFE).
// Iterated by the consolidated scroll listener; empty-array case is the
// implicit null-guard for "fired before the IIFE resolved".
const scrollSubscribers = [];

// Resize-cached layout values — avoids per-frame getBoundingClientRect /
// offsetTop / innerHeight reads that would otherwise force layout flushes
// during scroll. Repopulated on resize (debounced) and after the PCB IIFE.
let pcbFullyLit = false;
const layout = {
  innerHeight: 0,
  maxScroll: 0,
  navOffsets: [],
  pcbStart: 0,
  pcbEnd: 0,
};
function recomputeLayout() {
  layout.innerHeight = window.innerHeight;
  layout.maxScroll = Math.max(0,
    document.documentElement.scrollHeight - layout.innerHeight);
  layout.navOffsets = navSections.map(s => s.offsetTop);
  layout.pcbStart = 0;
  // Reveal runs the length of the page: navSections' last entry is #contact
  // (the last section[id] in the document).
  layout.pcbEnd = layout.navOffsets.length
    ? layout.navOffsets[layout.navOffsets.length - 1]
    : 0;
}

let activeNavId = null;
function updateActiveNav(sy) {
  if (navSections.length === 0) return;
  const trigger = layout.innerHeight * 0.28;
  let active = navSections[0];
  for (let i = 0; i < navSections.length; i++) {
    // Equivalent to original getBoundingClientRect().top - trigger <= 0,
    // since rect.top === offsetTop - scrollY for in-flow sections.
    if (layout.navOffsets[i] - sy - trigger <= 0) active = navSections[i];
  }
  if (active.id === activeNavId) return;
  activeNavId = active.id;
  navLinks.forEach(a => a.classList.toggle('active',
    a.getAttribute('href') === '#' + active.id));
}

// 4px buffer so a section already pinned to the top isn't picked.
function findNextSection(sy) {
  for (let i = 0; i < navSections.length; i++) {
    if (layout.navOffsets[i] > sy + 4) return navSections[i];
  }
  return null;
}

function updateNextBtn(sy) {
  // Sections now flow continuously (no more one-per-viewport paging), so
  // the jump button only makes sense on the home section — hide it as
  // soon as the user scrolls into the second section.
  const homeEnd = navSections.length > 1 ? layout.navOffsets[1] : layout.maxScroll;
  nextBtn.classList.toggle('hidden', sy >= homeEnd - 4);
}

function runAllUpdates(sy) {
  updateActiveNav(sy);
  if (nextBtn) updateNextBtn(sy);
  for (let i = 0; i < scrollSubscribers.length; i++) scrollSubscribers[i](sy);
}

// Single consolidated scroll listener — one rAF, one scrollY read, strict
// read-then-write ordering across all features. The rAF callback is hoisted
// to a named function so the same Function reference is reused every frame
// (passing an inline arrow would allocate a fresh closure per scroll event).
let scrollTicking = false;
function onScrollFrame() {
  runAllUpdates(window.scrollY);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(onScrollFrame);
}, { passive: true });

// Debounced resize — resize fires faster than layout actually settles, so
// rAF-throttling still recomputes far more than needed. 150ms lets the
// drag finish before paying for offsetTop reads. After recompute, read
// scrollY fresh (the user may have scrolled during the debounce window).
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    recomputeLayout();
    pcbFullyLit = false;
    runAllUpdates(window.scrollY);
    resizeTimer = null;
  }, 150);
}, { passive: true });

// Initial paint — recompute layout, then run all updates with current scroll.
// Module scripts run after DOMContentLoaded but BEFORE webfonts swap in and
// before images report their final dimensions, so this first measurement can
// be stale. The follow-up triggers below catch those settle events.
recomputeLayout();
runAllUpdates(window.scrollY);

// Re-measure once layout-affecting resources settle. Resetting `pcbFullyLit`
// lets the PCB reveal resume if `pcbEnd` grew (e.g. webfont swap pushed
// later sections further down the page) — otherwise the early-bail at
// updatePCBReveal would freeze the reveal at the stale, too-low end.
function settleRecompute() {
  recomputeLayout();
  pcbFullyLit = false;
  runAllUpdates(window.scrollY);
}
window.addEventListener('load', settleRecompute);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(settleRecompute).catch(() => {});
}

// Fade-in observer (one-way for text content)
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

// Smooth-scroll on in-page anchor click without mutating the URL hash.
inPageLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

// Floating "↓" button click → scroll to next section's title.
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    findNextSection(window.scrollY)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Hero terminal — typed, multi-line, looping. Types out a fixed command
// sequence (character by character), including two commands that resolve
// real data (site uptime via Kuma, last-updated as a relative "X days
// ago"), then runs `clear`, waits 2s on an empty screen, and restarts the
// whole sequence from the top — forever. Box itself has a fixed height
// (see .hero-term in styles.css) so the loop never changes the hero's
// layout height (#3 feedback). Respects prefers-reduced-motion by
// rendering the sequence once, fully typed, with no loop/clear.
// ─────────────────────────────────────────────────────────────────────────
(function setupHeroTerminal() {
  const el = document.getElementById('heroTerm');
  if (!el) return;

  // Resolved ONCE on page load — not re-fetched/recomputed every time the
  // terminal loop reaches these lines (#2 feedback). The terminal simply
  // reads whatever these resolved to for the rest of the page's lifetime.
  let cachedUptimeText = null;
  let cachedDaysAgoText = null;
  const uptimeReady = fetchUptimeText().then(text => { cachedUptimeText = text; });
  cachedDaysAgoText = daysAgoLabel(SITE_UPDATED);

  // Each row's `text` can be a plain string or a function returning a
  // string — used by the two "live-data" commands, which now just read
  // the cached values resolved once above rather than doing real work
  // per lap.
  function buildRows() {
    return [
      { prompt: '$', text: 'whoami' },
      { out: true, text: 'tilen_pokorn — cs student @ uni-lj' },
      { prompt: '$', text: 'uname -a' },
      { out: true, text: 'homelab-n150 6.x-proxmox x86_64 GNU/Linux' },
      { prompt: '$', text: 'ls ~/projects' },
      { out: true, text: 'barkwatch/  stm32-can-dash/  homelab/  sd-prompt-gen/' },
      { prompt: '$', text: 'uptime --site --month' },
      { out: true, text: () => cachedUptimeText ?? 'unknown' },
      { prompt: '$', text: 'last-updated' },
      { out: true, text: () => cachedDaysAgoText },
      { prompt: '$', text: 'clear' },
    ];
  }

  // Resolves the Kuma badge into plain text ("100.0%" / "unavailable")
  // for the terminal row — same parsing approach as the original
  // status-line implementation, just feeding a typed terminal row
  // instead of a separate status widget. Called once on load only.
  async function fetchUptimeText() {
    try {
      const res = await fetch(KUMA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status');
      const svgText = await res.text();
      const matches = [...svgText.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]);
      const pct = matches.reverse().find(t => /%/.test(t));
      if (!pct) throw new Error('no percentage found');
      return pct;
    } catch {
      return 'unavailable';
    }
  }

  if (reduceMotion) {
    uptimeReady.then(() => {
      const rows = buildRows().filter(r => r.text !== 'clear');
      el.innerHTML = rows.map(r => {
        const text = typeof r.text === 'function' ? r.text() : r.text;
        return r.prompt
          ? `<div class="term-row"><span class="prompt">${r.prompt}</span><span>${text}</span></div>`
          : `<div class="term-row term-out">${text}</div>`;
      }).join('');
    });
    return;
  }

  let cancelled = false;
  el.innerHTML = '';

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function appendRow(out) {
    const rowEl = document.createElement('div');
    rowEl.className = out ? 'term-row term-out' : 'term-row';
    rowEl.innerHTML = out
      ? '<span class="typed"></span><span class="cursor"></span>'
      : '<span class="prompt">$</span><span class="typed"></span><span class="cursor"></span>';
    el.appendChild(rowEl);
    return rowEl;
  }

  async function typeText(rowEl, text) {
    const typedSpan = rowEl.querySelector('.typed');
    for (let i = 1; i <= text.length; i++) {
      if (cancelled) return;
      typedSpan.textContent = text.slice(0, i);
      await wait(24 + Math.random() * 22);
    }
  }

  async function runLoop() {
    while (!cancelled) {
      el.innerHTML = '';
      for (const row of buildRows()) {
        if (cancelled) return;
        const isClear = row.text === 'clear';
        const rowEl = appendRow(row.out);

        if (isClear) {
          await wait(2000); // pause on the fully-populated screen before clearing
          await typeText(rowEl, 'clear');
          rowEl.querySelector('.cursor')?.remove();
          await wait(280); // brief beat after "clear" is typed
          el.innerHTML = '';
          break; // restart outer while-loop
        }

        const text = typeof row.text === 'function' ? row.text() : row.text;
        await typeText(rowEl, text);
        rowEl.querySelector('.cursor')?.remove();
        await wait(row.out ? 360 : 620);
      }
    }
  }
  runLoop();
})();

// Inline board SVG with scroll-driven progressive build.
// Components are identified by direct-child lookup inside the components layer
// using inkscape:label (id falls back to the same string when present).
// Wires (.trace) are bound to two components ahead of time by
// scripts/build_wires.py and shipped as public/board.wires.json — the client
// just looks each one up by index.
//
// REVEAL_ORDER is the curated component reveal order (flat — no longer
// grouped per section). Components light up in this order,
// spread evenly across the whole scroll range, independent of section
// titles/boundaries.
//
// The list is a *preference*, not a gatekeeper: at runtime we discover every
// direct child of the components layer and append any leftover (unlabeled or
// future-added) groups to the end so nothing is ever skipped.
const REVEAL_ORDER = [
  'cpu','chip-1-top-left','chip-2-top-right',
  'ram','chip-3-top-right','capacitor-top-right','gpio-chip-bottom','gpio-bottom','chip-6-bottom-left',
  'power-button-top-left','sd-card-reader','chip-4-bottom-right','gpio-chip-top-2','hdmi-2',
  'gpio-top-big','capacitors-top-left-1','gpio-chip-top-3','usbc-bottom-left','capacitors-bottom-right',
  'hdmi-1','chip-5-bottom-middle','chip-7-bottom-left','gpio-top-small','usb-30',
  'connector-top-right','chip-7-capacitors-bottom-left','gpio-chip-top-1','connector-bottom-middle-1','eth-port',
  'connector-bottom-middle-2','gpio-chip-top-4','connector-bottom-left','capacitors-top-left-2','usb-20','screw-holes'
];

// Big components with clean outlines get a soft glow. Dense pin-clusters
// (gpio headers, connectors, capacitor groups) are deliberately excluded.
const GLOW = new Set([
  'cpu','ram',
  'chip-1-top-left','chip-2-top-right','chip-3-top-right',
  'chip-4-bottom-right','chip-5-bottom-middle',
  'chip-6-bottom-left','chip-7-bottom-left',
  'hdmi-1','hdmi-2','usb-30','usb-20','usbc-bottom-left',
  'eth-port','sd-card-reader',
]);

// Fired in parallel with board.svg so the JSON arrives "for free" while
// the SVG is being parsed and laid out. Returns a Promise that resolves
// to the parsed JSON object (or null on any failure).
function fetchPrebuiltWires() {
  return fetch('board.wires.json')
    .then(res => res.ok ? res.json() : null)
    .catch(() => null);
}

async function loadBoard() {
  const container = document.getElementById('boardBg');
  if (!container) return;

  // Fire the wires JSON fetch immediately, in parallel with board.svg.
  // We await it later, after the SVG has loaded, so the fetch rides along
  // on a separate connection.
  const wiresFetch = fetchPrebuiltWires();

  let svgText;
  try {
    const res = await fetch('board.svg');
    if (!res.ok) return;
    svgText = await res.text();
  } catch { return; }

  // Strip XML prolog so HTML parser is happy.
  svgText = svgText.replace(/^\s*<\?xml[^?]*\?>\s*/, '');
  container.innerHTML = svgText;
  const svg = container.querySelector('svg');
  if (!svg) return;
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Find the SVG element that represents the board background/chassis
  // so we can adjust only its opacity as sections reveal. Prefer a
  // class or id, fall back to an inkscape label if present.
  const pcbBase = svg.querySelector('.pcb-base') || svg.querySelector('#pcb-base') || svg.querySelector('[inkscape\\:label="pcb-base"]');

  // Discover every direct child of the components layer. inkscape:label is
  // preferred (semantic), id is the documented fallback. Any group missing
  // both is still picked up via a synthesised key so it can't be dropped.
  const compLayer =
    svg.querySelector('[inkscape\\:label="components"]') ||
    svg.querySelector('#components');
  const discovered = []; // [{ key, el }] in document order
  const elByKey = new Map();
  if (compLayer) {
    let auto = 0;
    for (const el of compLayer.children) {
      const key =
        el.getAttribute('inkscape:label') ||
        el.id ||
        `__comp_${auto++}`;
      discovered.push({ key, el });
      elByKey.set(key, el);
    }
  }

  // Build the final flat reveal order: curated order first, then any
  // discovered component not in the curation appended to the end.
  const curatedKeys = new Set(REVEAL_ORDER);
  const leftoverKeys = discovered
    .map(d => d.key)
    .filter(k => !curatedKeys.has(k));
  const order = REVEAL_ORDER.concat(leftoverKeys);

  // Resolver: discovered map first, then svg-wide id / inkscape:label fallback
  // (covers components that might live outside the components layer).
  const byKey = key =>
    elByKey.get(key) ||
    svg.querySelector(`#${CSS.escape(key)}`) ||
    svg.querySelector(`[inkscape\\:label="${key}"]`);

  const components = [];
  const usedKeys = new Set();
  for (const key of order) {
    if (usedKeys.has(key)) continue;
    const el = byKey(key);
    if (!el) {
      console.warn('[board] missing component:', key);
      continue;
    }
    el.classList.add('comp');
    if (GLOW.has(key)) el.classList.add('glow-comp');
    components.push({ label: key, el });
    usedKeys.add(key);
  }

  const traceEls = svg.querySelectorAll('.trace');

  // Inkscape exports most paths with inline style="...stroke-dasharray:none..."
  // which beats our CSS rule (.trace { stroke-dasharray:100 }) and turns the
  // wire into a solid line that just fades opacity. Strip the inline dash
  // properties so the CSS draw-on logic applies to every wire. Mutates the
  // freshly-injected DOM, so it must run on every load.
  traceEls.forEach(t => {
    if (t.style) {
      t.style.removeProperty('stroke-dasharray');
      t.style.removeProperty('stroke-dashoffset');
    }
  });
  const wires = [];
  // Built once, used by the per-wire aIdx/bIdx pre-stash below so the
  // per-frame path needs no Map lookups.
  const labelToIdx = new Map(components.map((c, i) => [c.label, i]));

  // Prebuilt wires only — no runtime hit-test fallback. If the JSON is
  // missing or malformed, `wires` stays empty and the .trace paths simply
  // don't animate; components still light up as normal. Re-run
  // `python scripts/build_wires.py` after editing public/board.svg to
  // regenerate the mapping.
  const prebuilt = await wiresFetch;
  if (prebuilt && Array.isArray(prebuilt.wires)) {
    for (const w of prebuilt.wires) {
      const el = traceEls[w.i];
      if (!el) continue;
      if (w.fromB) el.classList.add('from-b');
      wires.push({ el, a: w.a, b: w.b });
    }
  } else {
    console.warn('[board] board.wires.json missing or invalid — wires will not render.');
  }

  // Pre-stash each wire's endpoint indices so updatePCBReveal can do a pure
  // index comparison per frame instead of allocating a Set + label lookups.
  // Unresolved endpoints get Infinity so the wire stays unlit forever
  // (matches original behaviour: lit.has(undefined) === false).
  for (const w of wires) {
    const ai = labelToIdx.get(w.a);
    const bi = labelToIdx.get(w.b);
    w.aIdx = ai != null ? ai : Infinity;
    w.bIdx = bi != null ? bi : Infinity;
  }

  const totalComps = components.length;

  function updatePCBReveal(sy) {
    if (layout.pcbEnd <= 0) return;
    // Once the board is fully lit and we're past the end, skip per-frame
    // work entirely — no toggle loops, no style writes.
    if (sy >= layout.pcbEnd && pcbFullyLit) return;

    // Components reveal in curated order, evenly across the entire scroll
    // range from the top of the page (0) to lastEnd — not bound to any
    // section's title/boundary.
    const firstStart = 0;
    const lastEnd = layout.pcbEnd;

    // Fade the board in over the early portion of the home, so the chassis
    // is present before components start lighting up.
    const fadeEnd = layout.innerHeight * 0.5;
    let fade = sy / Math.max(1, fadeEnd);
    fade = Math.min(1, Math.max(0, fade));
    container.style.opacity = String(fade);

    // Darken/brighten the board background continuously with scroll
    // progress (0 at the top, 1 at lastEnd) — no more discrete per-section
    // steps, since sections no longer page one-at-a-time.
    try {
      const progress = Math.min(1, Math.max(0, sy / lastEnd));
      const baseOpacity = 0.08;
      const maxOpacity = 0.42;
      const bgOpacity = baseOpacity + (maxOpacity - baseOpacity) * progress;
      if (pcbBase) pcbBase.style.opacity = String(bgOpacity);
    } catch (e) {
      // defensive: never throw from rendering logic
    }

    // Components reveal evenly across the whole scroll range (firstStart →
    // lastEnd), independent of section boundaries. idx accumulates: 0 at
    // firstStart, totalComps at lastEnd.
    let idx = 0;
    if (sy <= firstStart) {
      idx = 0;
    } else if (sy >= lastEnd) {
      idx = totalComps;
    } else {
      const local = (sy - firstStart) / Math.max(1, lastEnd - firstStart);
      idx = Math.round(local * totalComps);
    }

    // Index-based litness check — no per-frame Set, no per-frame closures.
    // components are stored in reveal order, so component j is lit iff j < idx.
    // wires carry pre-stashed aIdx/bIdx, so a wire is lit iff both endpoints are.
    for (let i = 0; i < components.length; i++) {
      const c = components[i];
      const should = i < idx;
      if (c.el.classList.contains('lit') !== should) {
        c.el.classList.toggle('lit', should);
      }
    }
    for (let i = 0; i < wires.length; i++) {
      const w = wires[i];
      const should = w.aIdx < idx && w.bIdx < idx;
      if (w.el.classList.contains('lit') !== should) {
        w.el.classList.toggle('lit', should);
      }
    }

    if (idx === totalComps) pcbFullyLit = true;
  }

  // pcbEnd is derived from navSections (already populated at module scope)
  // rather than a separate board-specific attribute — recompute layout to
  // pick up final offsets, register the subscriber, and run a first paint.
  recomputeLayout();
  scrollSubscribers.push(updatePCBReveal);
  updatePCBReveal(window.scrollY);
}

// Only load the SVG board on sufficiently wide viewports to avoid fetching
// and computing heavy SVG data on phones. Match the CSS breakpoint.
if (!window.matchMedia('(max-width: 440px)').matches) {
  loadBoard();
} else {
  // Ensure the container stays empty/hidden when we skip loading.
  const container = document.getElementById('boardBg');
  if (container) container.style.display = 'none';
}
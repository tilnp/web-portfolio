import { applyLocale, detectLocale, setLocale } from './i18n.js';

document.getElementById('year').textContent = new Date().getFullYear();

// Apply current locale immediately
applyLocale(detectLocale());

// Language toggle button
document.querySelector('[data-i18n-toggle]')?.addEventListener('click', () => {
  const cur = document.documentElement.lang || 'en';
  setLocale(cur === 'en' ? 'sl' : 'en');
});

// Parallax background grid
const bgGrid = document.getElementById('bgGrid');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      bgGrid.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Fade-in observer (one-way for text content)
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

// Active nav link — frontier-style: highlight the section whose top
// has crossed a line near the top of the viewport
const navLinks = document.querySelectorAll('.nav-links a');
const navSections = [...document.querySelectorAll('section[id]')];
let navTicking = false;
let activeNavId = null;

function updateActiveNav() {
  const trigger = window.innerHeight * 0.28;
  let active = navSections[0];
  for (const s of navSections) {
    if (s.getBoundingClientRect().top - trigger <= 0) active = s;
  }
  if (active.id === activeNavId) return;
  activeNavId = active.id;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active.id));
}
window.addEventListener('scroll', () => {
  if (!navTicking) {
    requestAnimationFrame(() => { updateActiveNav(); navTicking = false; });
    navTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateActiveNav, { passive: true });
updateActiveNav();

navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

// Floating "↓" button — scroll to the next section's title. Hides itself
// when there's nothing left below (i.e. the user is on the last section).
const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
  const findNext = () => {
    const sy = window.scrollY;
    // 4px buffer so a section already pinned to the top isn't picked.
    for (const s of navSections) {
      if (s.offsetTop > sy + 4) return s;
    }
    return null;
  };
  nextBtn.addEventListener('click', () => {
    findNext()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  let nextTicking = false;
  const updateNextBtn = () => {
    // Hide when there's no further section, or when we're effectively at
    // the bottom of the page (the page's max-scroll can fall a few px
    // short of contact.offsetTop on narrow viewports because the footer
    // padding shrinks — the absolute scroll position is the safer test).
    const maxScroll = Math.max(0,
      document.documentElement.scrollHeight - window.innerHeight);
    const atBottom = window.scrollY >= maxScroll - 16;
    nextBtn.classList.toggle('hidden', findNext() === null || atBottom);
  };
  window.addEventListener('scroll', () => {
    if (nextTicking) return;
    nextTicking = true;
    requestAnimationFrame(() => { updateNextBtn(); nextTicking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateNextBtn, { passive: true });
  updateNextBtn();
}

// Inline board SVG with scroll-driven progressive build.
// Components are identified by direct-child lookup inside the components layer
// using inkscape:label (id falls back to the same string when present).
// Wires (.trace) bind to two components by hit-testing path endpoints in
// screen space against component bounding boxes.
//
// REVEAL_CHUNKS is the curated, semantically-grouped order, split into 5
// chunks that align 1:1 with the [data-board-step] page sections (about →
// contact). Each chunk is fully lit by the moment its section's title
// reaches the top of the viewport — so chunk[i] is revealed during the
// scroll range *leading up to* section[i], not while the user is reading
// section[i]. (Chunk 0 fills in over the home; chunk 1 fills in while
// scrolling out of #about toward #skills; and so on.)
//
// The list is a *preference*, not a gatekeeper: at runtime we discover every
// direct child of the components layer and append any leftover (unlabeled or
// future-added) groups to the last chunk so nothing is ever skipped.
const REVEAL_CHUNKS = [
  // step 0 — about: just the CPU and the two top chips.
  ['cpu','chip-1-top-left','chip-2-top-right'],

  // step 1 — skills: center, top-right, both bottom-left chips, etc.
  ['ram','chip-7-bottom-left','sd-card-reader','chip-4-bottom-right'],

  // step 2 — education: chip-5-bottom-middle replaces the usb-c that
  ['power-button-top-left','gpio-top-big','chip-5-bottom-middle','hdmi-1','gpio-chip-bottom','capacitor-top-right','hdmi-2','chip-6-bottom-left','chip-3-top-right'],

  // step 3 — languages: a short, varied chunk (TR + BL + top + BL)
  ['connector-top-right','chip-7-capacitors-bottom-left','gpio-chip-top-1','connector-bottom-left','eth-port'],

  // step 4 — experience: remaining GPIO headers + connectors, ending on
  ['gpio-bottom','gpio-top-small','connector-bottom-middle-2','gpio-chip-top-2','usb-30'],

  // step 5 — contact: fine detail around the board with usb-20 closing
  ['capacitors-top-left-1','gpio-chip-top-3','usbc-bottom-left','capacitors-bottom-right','gpio-chip-top-4','connector-bottom-middle-1','capacitors-top-left-2','usb-20', 'screw-holes'],
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

async function loadBoard() {
  const container = document.getElementById('boardBg');
  if (!container) return;

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

  // Build the final per-step chunk list: curated chunks first, then any
  // discovered component not in the curation appended to the last chunk.
  const curatedKeys = new Set(REVEAL_CHUNKS.flat());
  const leftoverKeys = discovered
    .map(d => d.key)
    .filter(k => !curatedKeys.has(k));
  const chunks = REVEAL_CHUNKS.map(c => c.slice());
  if (leftoverKeys.length) {
    chunks[chunks.length - 1] = chunks[chunks.length - 1].concat(leftoverKeys);
  }

  // Resolver: discovered map first, then svg-wide id / inkscape:label fallback
  // (covers components that might live outside the components layer).
  const byKey = key =>
    elByKey.get(key) ||
    svg.querySelector(`#${CSS.escape(key)}`) ||
    svg.querySelector(`[inkscape\\:label="${key}"]`);

  const components = [];
  const usedKeys = new Set();
  for (const chunk of chunks) {
    for (const key of chunk) {
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
  }

  // Resolve wire→component mapping by endpoint hit-testing in screen space.
  // Defer one frame so the SVG is laid out and CTMs are valid.
  await new Promise(r => requestAnimationFrame(r));

  const compRects = components.map(c => ({
    label: c.label,
    el: c.el,
    rect: c.el.getBoundingClientRect(),
  }));

  const findComponentAtPoint = (x, y) => {
    let best = null;
    let bestArea = Infinity;
    const margin = 8;
    for (const c of compRects) {
      const r = c.rect;
      if (!r.width || !r.height) continue;
      if (x >= r.left - margin && x <= r.right + margin &&
          y >= r.top - margin && y <= r.bottom + margin) {
        const area = r.width * r.height;
        if (area < bestArea) { bestArea = area; best = c.label; }
      }
    }
    return best;
  };

  const traceEls = svg.querySelectorAll('.trace');
  const wires = [];
  const svgPoint = svg.createSVGPoint();
  traceEls.forEach(t => {
    // Inkscape exports most paths with inline style="...stroke-dasharray:none..."
    // which beats our CSS rule (.trace { stroke-dasharray:100 }) and turns the
    // wire into a solid line that just fades opacity. Strip the inline
    // dash properties so the CSS draw-on logic applies to every wire.
    if (t.style) {
      t.style.removeProperty('stroke-dasharray');
      t.style.removeProperty('stroke-dashoffset');
    }
    if (typeof t.getTotalLength !== 'function') return;
    let len, p0, p1;
    try {
      len = t.getTotalLength();
      p0 = t.getPointAtLength(0);
      p1 = t.getPointAtLength(len);
    } catch { return; }
    const ctm = t.getScreenCTM();
    if (!ctm) return;
    svgPoint.x = p0.x; svgPoint.y = p0.y;
    const s0 = svgPoint.matrixTransform(ctm);
    svgPoint.x = p1.x; svgPoint.y = p1.y;
    const s1 = svgPoint.matrixTransform(ctm);
    const a = findComponentAtPoint(s0.x, s0.y);
    const b = findComponentAtPoint(s1.x, s1.y);
    if (a && b) wires.push({ el: t, a, b });
    else if (a || b) wires.push({ el: t, a: a || b, b: a || b });
  });

  // Direction of progressive draw: path goes from "a" (start) to "b" (end).
  // We want the line to draw *from* the already-visible component *to* the
  // newly-appearing one — i.e. originate at the earlier-revealed endpoint.
  // .from-b flips the dash offset to -100 so the dash retracts off the
  // path-end side instead of the path-start side.
  const labelToIdx = new Map(components.map((c, i) => [c.label, i]));
  for (const w of wires) {
    const ai = labelToIdx.get(w.a);
    const bi = labelToIdx.get(w.b);
    if (ai != null && bi != null && bi < ai) {
      w.el.classList.add('from-b');
    }
  }

  // Recompute rects on resize (component bboxes shift with the page).
  let resizeTick = false;
  const refreshRects = () => {
    compRects.forEach(c => { c.rect = c.el.getBoundingClientRect(); });
  };

  // Each [data-board-step] section reveals one chunk of components, evenly
  // spread across that section's scroll range — so cadence is independent
  // of section height.
  const stepSections = [...document.querySelectorAll('[data-board-step]')]
    .sort((a, b) => Number(a.dataset.boardStep) - Number(b.dataset.boardStep));

  // Component count consumed by the end of each step (cumulative).
  // Built against the merged chunks (curated + leftovers) so auto-discovered
  // components contribute to step progression.
  const resolvedKeys = new Set(components.map(c => c.label));
  const stepCumulative = [];
  let acc = 0;
  for (const chunk of chunks) {
    acc += chunk.filter(k => resolvedKeys.has(k)).length;
    stepCumulative.push(acc);
  }
  const totalComps = components.length;

  function update() {
    if (stepSections.length === 0) return;
    const sy = window.scrollY;

    // Each chunk is fully lit by the time *its* section's title hits the
    // top of the viewport — i.e. chunk[i] reveals over the scroll range
    // ending at stepSections[i].offsetTop. The chunk for the first section
    // reveals over the home (start = 0); subsequent chunks reveal across
    // the previous section's height.
    const firstStart = 0;
    const lastEnd = stepSections[stepSections.length - 1].offsetTop;

    // Fade the board in over the early portion of the home, so the chassis
    // is present before components start lighting up.
    const fadeEnd = stepSections[0].offsetTop * 0.5;
    let fade = sy / Math.max(1, fadeEnd);
    fade = Math.min(1, Math.max(0, fade));
    container.style.opacity = String(fade);

    // Adjust only the board background element's opacity based on which
    // section we're currently approaching. Start at 0.06 at the first
    // section and increase by 0.01 per step, capped at 0.11.
    try {
      let stepIndex = 0;
      if (sy <= 0) {
        stepIndex = 0;
      } else if (sy >= lastEnd) {
        stepIndex = Math.max(0, stepSections.length - 1);
      } else {
        for (let i = 0; i < stepSections.length; i++) {
          const start = i === 0 ? 0 : stepSections[i - 1].offsetTop;
          const end = stepSections[i].offsetTop;
          if (sy < end) { stepIndex = i; break; }
        }
      }
      const baseOpacity = 0.08;
      const bgOpacity = Math.min(0.38, baseOpacity + 0.06 * stepIndex);
      if (pcbBase) pcbBase.style.opacity = String(bgOpacity);
    } catch (e) {
      // defensive: never throw from rendering logic
    }

    // Find which step the viewport currently sits in and how far through it
    // we are. idx accumulates: 0 at firstStart, totalComps at lastEnd.
    let idx = 0;
    if (sy <= firstStart) {
      idx = 0;
    } else if (sy >= lastEnd) {
      idx = totalComps;
    } else {
      for (let i = 0; i < stepSections.length; i++) {
        const start = i === 0 ? 0 : stepSections[i - 1].offsetTop;
        const end = stepSections[i].offsetTop;
        if (sy < end) {
          const local = (sy - start) / Math.max(1, end - start);
          const prev = i === 0 ? 0 : stepCumulative[i - 1];
          const target = stepCumulative[i];
          idx = Math.round(prev + local * (target - prev));
          break;
        }
      }
    }

    const lit = new Set();
    for (let i = 0; i < idx; i++) lit.add(components[i].label);

    components.forEach(c => {
      const should = lit.has(c.label);
      if (c.el.classList.contains('lit') !== should) {
        c.el.classList.toggle('lit', should);
      }
    });
    wires.forEach(w => {
      const should = lit.has(w.a) && lit.has(w.b);
      if (w.el.classList.contains('lit') !== should) {
        w.el.classList.toggle('lit', should);
      }
    });
  }

  let rafPending = false;
  const onScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { update(); rafPending = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (resizeTick) return;
    resizeTick = true;
    requestAnimationFrame(() => { refreshRects(); update(); resizeTick = false; });
  }, { passive: true });

  update();
}

loadBoard();
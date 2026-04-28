export const SUPPORTED_LOCALES = ['en', 'sl'];
export const DEFAULT_LOCALE = 'en';
export const STORAGE_KEY = 'lang';

// ─── Architecture ────────────────────────────────────────────────────────────
// Structural data (item order, ids, hrefs, icons, tags, skill names) lives
// at module scope as plain exports — single source of truth, edit once.
// Translatable text (titles, descriptions, category labels) lives inside
// `messages.{en,sl}` keyed by the same id. applyLocale deep-merges the active
// locale onto `en`, so any field missing from sl falls back to its en value
// without rendering blank.
// ─────────────────────────────────────────────────────────────────────────────

export const skills = [
  { name: 'C',                cat: 'language' },
  { name: 'C++',              cat: 'language' },
  { name: 'Python',           cat: 'language' },
  { name: 'Java',             cat: 'language' },
  { name: 'HTML / CSS / JS',  cat: 'language' },
  { name: 'Linux',            cat: 'systems'  },
  { name: 'Windows',          cat: 'systems'  },
  { name: 'Networking',       cat: 'systems'  },
  { name: 'Proxmox',          cat: 'infra'    },
  { name: 'Docker',           cat: 'infra'    },
  { name: 'Nginx / NPM',      cat: 'infra'    },
  { name: 'Git',              cat: 'tooling'  },
  { name: 'Bash',             cat: 'scripting'},
  { name: 'SQL',              cat: 'data'     },
  { name: 'Embedded Systems' ,cat: 'hardware' },
  { name: 'PC Assembly',      cat: 'hardware' },
];

// Each entry's `key` is the lookup id into messages.{en,sl}.education.items.
// `start` / `end` are calendar years; use end:0 to mean "still ongoing"
// (rendered as the locale's "present" word).
export const educationItems = [
  { key: 'uni', start: 2024, end: 0    },
  { key: 'gym', start: 2020, end: 2024 },
];

// Spoken languages. Same key-driven shape as education — name + level
// translate per locale; `bars` (0–4, fractional OK) drives the proficiency
// indicator.
export const languageItems = [
  { key: 'sl',              bars: 4    },
  { key: 'en', cert: '',    bars: 3.25 },
  { key: 'de', cert: '',    bars: 2.1  },
];

// Icons + tags don't translate; title/desc do.
export const experienceItems = [
  { key: 'vm',  icon: 'vms',  tags: ['proxmox', 'lxc', 'vm', 'docker'] },
  { key: 'net', icon: 'net', tags: ['https', 'firewall', 'ssl', 'dns'] },
  { key: 'srv', icon: 'srv', tags: ['apt', 'conf', 'status', 'monitoring'] },
  { key: 'adm', icon: 'adm', tags: ['admin', 'linux', 'shell', 'log'] },
  { key: 'dev', icon: 'dev', tags: ['build', 'v4.2', 'run', 'uptime'] },
];

// Email/URL don't translate; the platform label does (email → e-pošta).
export const contactLinks = [
  { key: 'email',  value: 'tilen@pokorn.si',  href: 'mailto:tilen@pokorn.si' },
  { key: 'github', value: 'github.com/tilnp', href: 'https://github.com/tilnp' },
  // { key: 'linkedin', value: 'linkedin.com/in/yourusername', href: 'https://linkedin.com/in/yourusername' },
];

export const messages = {
  en: {
    nav: {
      logoSuffix: '/ cs',
      home: 'home',
      about: 'about',
      skills: 'skills',
      education: 'education',
      languages: 'languages',
      experience: 'experience',
      contact: 'contact',
    },
    hero: {
      tag: 'computer science student',
      firstName: 'Tilen',
      lastName: 'Pokorn',
      sub: 'CS student building things at the intersection of systems, software, and hardware. Tinkering with whatever seems interesting this week.',
      cta: 'get in touch ↓',
      github: 'github',
      resume: 'résumé ↗',
    },
    about: {
      label: '01 — about',
      title: 'Who I am',
      p1: 'I\'m a <strong>computer science student</strong> with a strong interest in how systems work — from operating systems and networking down to the underlying hardware.',
      p2: 'I’m comfortable working across both <strong>software and hardware</strong>: using Linux environments, troubleshooting system issues, working in the terminal, and understanding how components interact at a low level. I focus on practical problem-solving rather than just theory.',
      p3: 'Outside of coursework I run a small <strong>home lab</strong> on Proxmox where I experiment with self-hosted services, containerised applications, and networking setups. I treat it as a hands-on learning environment, regularly building, breaking, and improving systems.',
    },
    skills: {
      label: '02 — skills',
      title: 'What I work with',
      cats: {
        language: 'language',
        systems: 'systems',
        infra: 'infra',
        tooling: 'tooling',
        scripting: 'scripting',
        data: 'data',
        hardware: 'hardware',
      },
    },
    education: {
      label: '03 — education',
      title: 'Background',
      present: 'present',
      items: {
        uni: { school: 'University of Ljubljana', degree: 'BSc Computer Science' },
        gym: { school: 'Škofja Loka Gymnasium',   degree: 'General Matura'       },
      },
    },
    languages: {
      label: '04 — languages',
      title: 'Languages I speak',
      items: {
        sl: { name: 'Slovenian', level: 'Native' },
        en: { name: 'English',   level: 'Fluent' },
        de: { name: 'German',    level: 'Conversational' },
      },
    },
    experience: {
      label: '05 — experience',
      title: 'Practical Experience',
      items: {
        vm: {
          title: 'Virtualization & containers',
          desc: 'Deploy and manage LXC containers and virtual machines on Proxmox, including system setup, configuration, and troubleshooting.' 
        },
        net: {
          title: 'Networking & services',
          desc: 'Configure network services including reverse proxying (Nginx Proxy Manager), private DNS, firewall rules, and internal service exposure.'
        },
        srv: {
          title: 'Service deployment',
          desc: 'Install, configure, and maintain self-hosted applications (Home Assistant, PhotoPrism, FileBrowser, Uptime Kuma, etc.), including updates and monitoring.'
        },
        adm: { 
          title: 'System administration',
          desc: 'Work in Linux environments using the terminal for system configuration, debugging, package management, and routine maintenance tasks.'
        },
        dev: {
          title: 'Iterative development',
          desc: 'Build, break, and refine systems in a self-managed environment, focusing on reliability and practical problem-solving.'
        },
      },
    },
    contact: {
      label: '06 — contact',
      title: 'Get in touch',
      platforms: {
        email:    'email',
        github:   'github',
        linkedin: 'linkedin',
      },
    },
    footer: {
      tagline: 'self-hosted · Node.js',
    },
    toggle: {
      switchTo: 'Switch language',
    },
  },

  sl: {
    nav: {
      logoSuffix: '/ cs',
      home: 'domov',
      about: 'o meni',
      skills: 'veščine',
      education: 'izobrazba',
      languages: 'jeziki',
      experience: 'izkušnje',
      contact: 'kontakt',
    },
    hero: {
      tag: 'študent računalništva in informatike',
      firstName: 'Tilen',
      lastName: 'Pokorn',
      sub: 'Študent računalništva, ki gradi stvari na presečišču sistemov, programske in strojne opreme. Trenutno brklja s čimerkoli, kar se ta teden zdi zanimivo.',
      cta: 'stopi v stik ↓',
      github: 'github',
      resume: 'življenjepis ↗',
    },
    about: {
      label: '01 — o meni',
      title: 'Kdo sem',
      p1: 'Sem <strong>študent računalništva</strong> s pristnim zanimanjem za delovanje sistemov — od operacijskih sistemov in omrežij vse do strojne opreme spodaj.',
      p2: 'Znajdem se s strojno opremo enako dobro kot s terminalom.',
      p3: 'Izven študija upravljam manjši <strong>domači laboratorij</strong> na Proxmoxu — samogostovane storitve, kontejnerizirane aplikacije, omrežni poskusi — in ga jemljem kot učno okolje, ki je vedno samo eno konfiguracijsko napako stran od pozne noči.',
    },
    skills: {
      label: '02 — veščine',
      title: 'S čim delam',
      cats: {
        language: 'jezik',
        systems: 'sistemi',
        infra: 'infra',
        tooling: 'orodja',
        scripting: 'skriptiranje',
        data: 'podatki',
        hardware: 'strojna oprema',
      },
    },
    education: {
      label: '03 — izobrazba',
      title: 'Ozadje',
      present: 'danes',
      items: {
        uni: { school: 'Univerza v Ljubljani',  degree: 'Računalništvo in informatika (UN)' },
        gym: { school: 'Gimnazija Škofja Loka', degree: 'Splošna matura'                    },
      },
    },
    languages: {
      label: '04 — jeziki',
      title: 'Jeziki, ki jih govorim',
      items: {
        sl: { name: 'slovenščina', level: 'materni jezik' },
        en: { name: 'angleščina',  level: 'tekoče' },
        de: { name: 'nemščina',    level: 'pogovorno' },
      },
    },
    experience: {
      label: '05 — izkušnje',
      title: 'Praktične izkušnje',
      // Any key omitted here falls back to its en counterpart automatically.
      items: {
        vm:  { title: 'Virtualizacija in kontejnerji', desc: 'Postavljanje in upravljanje LXC kontejnerjev in virtualnih strojev na Proxmoxu, vključno z nastavitvijo, konfiguracijo in odpravljanjem težav.' },
        net: { title: 'Omrežje in storitve',           desc: 'Nastavitev reverznega proxyja (Nginx Proxy Manager), zasebnega DNS in izpostavljanja notranjih storitev.' },
        srv: { title: 'Postavitev storitev',           desc: 'Namestitev, konfiguracija in vzdrževanje samogostovanih aplikacij (Home Assistant, PhotoPrism, FileBrowser, Uptime Kuma), vključno s posodobitvami in nadzorom.' },
        adm: { title: 'Sistemska administracija',      desc: 'Delo v Linux okoljih preko terminala za sistemsko konfiguracijo, razhroščevanje in vzdrževanje.' },
        dev: { title: 'Iterativni razvoj',             desc: 'Gradnja, lomljenje in izboljševanje sistemov v samoupravljanem okolju, s poudarkom na zanesljivosti in praktičnem reševanju težav.' },
      },
    },
    contact: {
      label: '06 — kontakt',
      title: 'Stopi v stik',
      platforms: {
        email:    'e-pošta',
        github:   'github',
        linkedin: 'linkedin',
      },
    },
    footer: {
      tagline: 'self-hosted · Node.js',
    },
    toggle: {
      switchTo: 'Zamenjaj jezik',
    },
  },
};

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// Recursive merge: `over` wins where defined, `base` fills the rest. Arrays
// and primitives replace wholesale (no element-wise merging) — that matches
// intuition for cases like "sl.experience.items.vm = {...}" overriding en's vm entry.
function deepMerge(base, over) {
  if (over === undefined) return base;
  if (over === null || typeof over !== 'object' || Array.isArray(over)) return over;
  if (base === null || typeof base !== 'object' || Array.isArray(base)) return over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
  return out;
}

const ESC_MAP = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC_MAP[c]);

// Renderers combine shared structure (module-scope arrays) with active-locale
// text (passed in via dict). Each renderer owns the inner DOM of its target.
const RENDERERS = {
  skills(el, dict) {
    const cats = dict.skills?.cats || {};
    el.innerHTML = skills.map(s => `
      <div class="skill-item">
        <span class="skill-name">${esc(s.name)}</span>
        <span class="skill-cat">${esc(cats[s.cat] || s.cat)}</span>
      </div>
    `).join('');
  },
  education(el, dict) {
    const t = dict.education?.items || {};
    const present = dict.education?.present || '';
    el.innerHTML = educationItems.map(e => {
      const tx = t[e.key] || {};
      const years = `${e.start} — ${e.end === 0 ? present : e.end}`;
      return `
        <div class="edu-item">
          <div>
            <div class="edu-school">${esc(tx.school)}</div>
            <div class="edu-degree">${esc(tx.degree)}</div>
          </div>
          <div class="edu-year">${esc(years)}</div>
        </div>
      `;
    }).join('');
  },
  languages(el, dict) {
    const t = dict.languages?.items || {};
    el.innerHTML = languageItems.map(l => {
      const tx = t[l.key] || {};
      const filled = Math.max(0, Math.min(4, l.bars ?? 0));
      const bars = Array.from({ length: 4 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, filled - i));
        const cls = fill > 0 ? 'bar filled' : 'bar';
        return `<span class="${cls}" style="--fill:${(fill * 100).toFixed(2)}%"></span>`;
      }).join('');
      return `
        <div class="lang-row">
          <div class="lang-name">${esc(tx.name)}</div>
          <div class="lang-meta">
            <span class="lang-level">${esc(tx.level)}</span>
            <div class="lang-bars" aria-hidden="true">${bars}</div>
            ${l.cert ? `<span class="lang-cert">${esc(l.cert)}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },
  experience(el, dict) {
    const t = dict.experience?.items || {};
    el.innerHTML = experienceItems.map(l => {
      const tx = t[l.key] || {};
      return `
        <div class="lab-item">
          <div class="lab-icon">${esc(l.icon)}</div>
          <div>
            <div class="lab-title">${esc(tx.title)}</div>
            <div class="lab-desc">${esc(tx.desc)}</div>
            ${(l.tags?.length ? `<div class="lab-tags">${l.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : '')}
          </div>
        </div>
      `;
    }).join('');
  },
  contact(el, dict) {
    const platforms = dict.contact?.platforms || {};
    el.innerHTML = contactLinks.map(c => `
      <a href="${esc(c.href)}" class="contact-link">
        <div class="contact-link-left">
          <span class="contact-platform">${esc(platforms[c.key] || c.key)}</span>
          <span class="contact-value">${esc(c.value)}</span>
        </div>
        <span class="contact-arrow">→</span>
      </a>
    `).join('');
  },
};

export function detectLocale() {
  const url = new URL(window.location.href);
  const param = url.searchParams.get('lang');
  if (SUPPORTED_LOCALES.includes(param)) return param;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED_LOCALES.includes(stored)) return stored;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return SUPPORTED_LOCALES.includes(nav) ? nav : DEFAULT_LOCALE;
}

export function applyLocale(lang) {
  if (!SUPPORTED_LOCALES.includes(lang)) lang = DEFAULT_LOCALE;
  const dict = lang === DEFAULT_LOCALE
    ? messages[DEFAULT_LOCALE]
    : deepMerge(messages[DEFAULT_LOCALE], messages[lang]);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-render]').forEach(el => {
    const fn = RENDERERS[el.dataset.render];
    if (fn) fn(el, dict);
  });

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = get(dict, el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = get(dict, el.dataset.i18nHtml);
    if (typeof v === 'string') el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    // format: "attr:path,attr:path"
    el.dataset.i18nAttr.split(',').forEach(pair => {
      const [attr, path] = pair.split(':').map(s => s.trim());
      const v = get(dict, path);
      if (typeof v === 'string') el.setAttribute(attr, v);
    });
  });
  document.querySelectorAll('[data-i18n-toggle]').forEach(el => {
    el.textContent = lang === 'en' ? 'SL' : 'EN';
    el.setAttribute('aria-label', dict.toggle.switchTo);
    el.setAttribute('title', dict.toggle.switchTo);
  });
}

export function setLocale(lang) {
  if (!SUPPORTED_LOCALES.includes(lang)) return;
  localStorage.setItem(STORAGE_KEY, lang);
  applyLocale(lang);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
}

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

// Icons (no color, inherits currentColor) for GitHub email / LinkedIn — 
// shared between the hero quick-links and the contact section so the
// markup lives in exactly one place. 16x16 viewBox, 1.6 stroke weight
// to match the rest of the site's restrained line-weight.
export const ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.4-.4-3.1 1.2a11.5 11.5 0 0 0-6 0C8 2.7 6.6 3.1 6.6 3.1A4.2 4.2 0 0 0 6.5 6.3 4.6 4.6 0 0 0 5.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3M12 13v3"/></svg>',
};

export const SITE_UPDATED = '2026-06-25';

export const skills = [
  { name: 'C',                     cat: 'language', bars: 4   },
  { name: 'C++',                   cat: 'language', bars: 3   },
  { name: 'Java',                  cat: 'language', bars: 2.5 },
  { name: 'Python',                cat: 'language', bars: 2   },
  { name: 'HTML / CSS / JS',       cat: 'language', bars: 2   },
  { name: 'Linux',                 cat: 'systems',  bars: 4   },
  { name: 'Windows',               cat: 'systems',  bars: 3   },
  { name: 'Networking',            cat: 'infra',    bars: 3   },
  { name: 'Bash',                  cat: 'scripting',bars: 3.5 },
  { name: 'System administration', cat: '',         bars: 4   },
  { name: 'Embedded Systems',      cat: '',         bars: 4   },
  { name: 'PC Assembly',           cat: 'hardware', bars: 5   },
];

// Each entry's `key` is the lookup id into messages.{en,sl}.education.items.
// `start` / `end` are calendar years; use end:0 for "still ongoing"
// (rendered as the locale's "present" word).
export const educationItems = [
  { key: 'uni', start: 2024, end: 0    },
  { key: 'gym', start: 2020, end: 2024 },
];

// Spoken languages. Same key-driven shape as education — name + level
// translate per locale; `bars` (0–4, fractional OK) drives the proficiency
// indicator.
export const languageItems = [
  { key: 'sl',           bars: 4    },
  { key: 'en', cert: '', bars: 3.4  },
  { key: 'de', cert: '', bars: 2.7  },
];

// Projects. Add entries here as projects come online; an empty array
// renders the section's empty-state message instead of cards.
// `key` is the lookup id into messages.{en,sl}.projects.items.
// `year` (optional) shows in the mono badge column.
// `ongoing: true` appends a green "→" inside the year chip with a
// localized "ongoing" tooltip — use this instead of writing " ->" by hand.
// `href` (optional) makes the card clickable. `tags` (optional) are
// non-translatable.
export const projectItems = [
  { key: 'barkwatch', year: '2026', href: 'https://github.com/tilnp/BarkWatch_Korosci-plus-Tilen_interface', tags: ['hackathon', 'team', 'AI'] },
  { key: 'stm32',     year: '2026', href: 'https://github.com/tilnp/STM32H750B-DK_OBD2_CAN_Dashboard', tags: ['STM32H750', 'embedded', 'CAN'] },
  { key: 'homelab',   year: '2025', ongoing: true,   tags: ['proxmox', 'hardware', 'web'] },
];

// Keys + tags don't translate; title/desc do.
// key is used for item icon
export const experienceItems = [
  { key: 'net', tags: ['https', 'firewall', 'tls', 'nginx'] },
  { key: 'adm', tags: ['admin', 'linux', 'shell', 'log'] },
  { key: 'emb', tags: ['STM32', 'GPIO', 'C/C++', 'embedded'] },
];

// Email/URL don't translate; the platform label does (email → e-pošta).
export const contactLinks = [
  { key: 'email',     value: 'tilen@pokorn.si',                    href: 'mailto:tilen@pokorn.si' },
  { key: 'github',    value: 'github.com/tilnp',                   href: 'https://github.com/tilnp' },
  { key: 'linkedin',  value: 'www.linkedin.com/in/tilnp',  href: 'https://www.linkedin.com/in/tilnp' },
];

export const messages = {
  en: {
    nav: {
      logoSuffix: '/ cs',
      home: 'home',
      about: 'about',
      education: 'education',
      skills: 'skills',
      projects: 'projects',
      experience: 'experience',
      languages: 'languages',
      contact: 'contact',
    },
    home: {
      lead: '',
      tag: 'computer science student',
      firstName: 'Tilen',
      lastName: 'Pokorn',
      sub: 'CS student building things at the intersection of systems, software, and hardware.',
      cta: 'get in touch ↓',
      github: 'github',
      resume: 'résumé ↗',
    },
    about: {
      label: '01 — about',
      title: 'Who I am',
      lead: '',
      p1: 'I\'m a <strong>computer science student</strong> with a genuine interest in how systems work — from operating systems and networking \
           down to the underlying hardware. I’m comfortable working across both <strong>software and hardware</strong>: working in Linux environments, \
           troubleshooting technical issues, using the terminal, and understanding how components interact at a low level.',
      p2: 'Outside of coursework I run a small <strong>home lab</strong> on Proxmox VE where I experiment with self-hosted services and automation projects. I also build small \
           <strong>personal tools</strong> to improve my workflow, and occasionally work on light design-related tasks. These projects are driven by \
           curiosity and hands-on learning.',
      p3: 'In my free time, I enjoy staying active, mostly through running and skiing. During the winter season, I work as a ski instructor for children, \
           which has helped me develop patience, communication skills, and confidence working with groups of different ages and personalities.',
    },
    skills: {
      label: '03 — skills',
      title: 'Technical knowledge',
      lead: '',
      cats: {
        language: 'language',
        systems: 'systems',
        infra: 'infrastructure',
        tooling: 'tooling',
        scripting: 'scripting',
        data: 'data',
        hardware: 'hardware',
      },
    },
    education: {
      label: '02 — education',
      title: 'Background',
      lead: '',
      present: 'present',
      items: {
        uni: {
          school: 'University of Ljubljana',
          degree: 'Computer and Information Science (BSc)',
          details: [
            'Programming (Java, C, C++)',
            'Algorithms, data structures, and computational theory',
            'Computer systems, operating systems, and architecture',
            'Databases, networks, and information systems',
            'Mathematics and statistics for computing',
          ],
        },
        gym: {
          school: 'Škofja Loka Gymnasium',
          degree: 'General Matura',
          details: [
            'General secondary education with strong math and science track',
            'Strong written and verbal communication skills in Slovene and English',
          ],
        },
      },
    },
    languages: {
      label: '06 — languages',
      title: 'Language Skills',
      lead: '',
      items: {
        sl: {
          name: 'Slovenian',
          level: 'Native',
          details: [
            'Everyday and academic communication',
          ],
        },
        en: {
          name: 'English',
          level: 'Fluent',
          details: [
            'Primary language for technical content',
            'Used for documentation and collaboration in software projects',
            'B2, General Matura (2024)'
          ],
        },
        de: {
          name: 'German',
          level: 'Conversational+',
          details: [
            'Reading, listening, and conversational comprehension',
            'Limited recent active use',
            'C1, Deutsches Sprachdiplom II (2024)'
          ],
        },
      },
    },
    projects: {
      label: '04 — projects',
      title: 'Selected work',
      lead: '',
      empty: 'More projects coming soon. In the meantime, see github.com/tilnp.',
      ongoing: 'ongoing',
      items: {
        barkwatch: {
          title: 'BarkWatch — Arnes Hackathon 2026',
          desc: 'AI-powered system for predicting bark beetle outbreaks in Slovenian forests, combining modeling with historical data visualization. \
                 Developed as a team project, reaching the hackathon finals. Responsible for frontend development: an interactive MapLibre-based interface \
                 for browsing forecasts and exploring data per forest sector.',
        },
        stm32: {
          title: 'Vehicle Data Dashboard',
          desc: 'Embedded system project using an STM32H750B-DK Discovery board to interface with a vehicle via OBD-II over CAN bus. Implements data acquisition \
                 from vehicle ECUs and real-time visualization on an integrated display or via UART.',
        },
        homelab: {
          title: 'Home lab',
          desc: 'Self-hosted Proxmox node for virtualization, containers, networking, and services. Running 24/7 alongside a Raspberry Pi 4B. \
                 Assembled and configured the system, which now hosts multiple services and this portfolio site.',
        },
      },
    },
    experience: {
      label: '05 — experience',
      title: 'Practical Experience',
      lead: '',
      items: {
        net: {
          title: 'Networking & services',
          desc: 'Configuring network services including reverse proxy (Nginx Proxy Manager), firewall, and internal service deployment.'
        },
        adm: { 
          title: 'System administration',
          desc: 'Working in Linux environments using the terminal for system configuration, debugging, package management, and routine maintenance tasks.'
        },
        emb: {
          title: 'Embedded systems',
          desc: 'Developing firmware for STM32 microcontrollers, focusing on hardware interfacing, sensor data acquisition, and real-time embedded system integration.',
        },
      },
    },
    contact: {
      label: '07 — contact',
      title: 'Get in touch',
      lead: '',
      platforms: {
        email:    'email',
        github:   'github',
        linkedin: 'linkedin',
      },
    },
    footer: {
      tagline: 'self-hosted · Node.js®',
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
      education: 'izobrazba',
      skills: 'veščine',
      projects: 'projekti',
      experience: 'izkušnje',
      languages: 'jeziki',
      contact: 'kontakt',
    },
    home: {
      lead: '',
      tag: 'študent računalništva in informatike',
      firstName: 'Tilen',
      lastName: 'Pokorn',
      sub: 'Študent računalništva, ki gradi stvari na presečišču sistemov, programske in strojne opreme.',
      cta: 'stopi v stik ↓',
      github: 'github',
      resume: 'življenjepis ↗',
    },
    about: {
      label: '01 — o meni',
      title: 'Kdo sem',
      lead: '',
      p1: 'Sem <strong>študent računalništva in informatike</strong> s pristnim zanimanjem za delovanje sistemov — od operacijskih sistemov in omrežij do \
           strojne opreme, ki vse to poganja. Znajdem se tako pri <strong>programski</strong> kot <strong>strojni opremi</strong>: uporaba Linux okolij, \
           odpravljanje sistemskih težav, delo v terminalu in razumevanje interakcij komponent na nizki ravni.',
      p2: 'Poleg študijskih obveznosti upravljam manjši <strong>home lab</strong> na Proxmox VE, kjer eksperimentiram s samogostovanjem storitev in avtomatizacijo. \
           Ob tem razvijam tudi manjša <strong>osebna orodja</strong> za izboljšanje svojega poteka dela, občasno pa se ukvarjam tudi z lažjimi oblikovalskimi nalogami. \
           Te projekte poganja radovednost in želja po stalnem razvijanju praktičnega znanja in veščin.',
      p3: 'V prostem času sem rad aktiven, največkrat tečem in smučam. V zimskem času delam kot učitelj smučanja za otroke, kar mi je pomagalo razviti potrpežljivost, \
           komunikacijske veščine ter samozavest pri delu s skupinami različnih starosti in značajev.',
    },
    skills: {
      label: '03 — veščine',
      title: 'Tehnična znanja',
      lead: '',
      cats: {
        language: 'jezik',
        systems: 'sistemi',
        infra: 'infrastruktura',
        tooling: 'orodja',
        scripting: 'skriptiranje',
        data: 'podatki',
        hardware: 'strojna oprema',
      },
    },
    education: {
      label: '02 — izobrazba',
      title: 'Ozadje',
      lead: '',
      present: 'danes',
      items: {
        uni: {
          school: 'Univerza v Ljubljani',
          degree: 'Računalništvo in informatika (UNI)',
          details: [
            'Programiranje (Java, C, C++)',
            'Algoritmi, podatkovne strukture in teorija računalništva',
            'Računalniški sistemi in njihova arhitektura, operacijski sistemi',
            'Podatkovne baze, omrežja in informacijski sistemi',
            'Matematika in statistika za računalništvo',
          ],
        },
        gym: {
          school: 'Gimnazija Škofja Loka',
          degree: 'Splošna matura',
          details: [
            'Splošno srednješolsko izobraževanje z močno matematično in naravoslovno podlago',
            'Močna pisna in ustna komunikacija v slovenščini in angleščini',
          ],
        },
      },
    },
    languages: {
      label: '06 — jeziki',
      title: 'Jezikovne kompetence',
      lead: '',
      items: {
        sl: {
          name: 'slovenščina',
          level: 'materni jezik',
          details: [
            'Vsakodnevna in akademska komunikacija',
          ],
        },
        en: {
          name: 'angleščina',
          level: 'tekoče',
          details: [
            'Glavni jezik za tehnične vsebine',
            'Uporaba pri dokumentaciji in sodelovanju pri projektih',
            'B2, Splošna Matura (2024)'
          ],
        },
        de: {
          name: 'nemščina',
          level: 'pogovorno+',
          details: [
            'Branje, poslušanje ter pogovorno razumevanje',
            'Omejena aktivna uporaba v zadnjih letih',
            'C1, Deutsches Sprachdiplom II (2024)'
          ],
        },
      },
    },
    projects: {
      label: '04 — projekti',
      title: 'Izbrana dela',
      lead: '',
      empty: 'Več projektov sledi kmalu. Do takrat si oglejte github.com/tilnp.',
      ongoing: 'v teku',
      items: {
        barkwatch: {
          title: 'BarkWatch — Arnes Hackathon 2026',
          desc: 'Umetnointeligenčni sistem za napovedovanje izbruhov podlubnikov v slovenskih gozdovih, ki združuje modeliranje in vizualizacijo zgodovinskih \
                 podatkov. Razvit kot skupinski projekt, ki se je uvrstil v finale hackathona. Odgovoren za razvoj frontend dela: interaktivni MapLibre vmesnik \
                 za pregledovanje napovedi in raziskovanje podatkov po gozdnih sektorjih.',
        },
        stm32: {
          title: 'Nadzorna plošča s podatki o vozilu',
          desc: 'Vgrajeni sistemski projekt z uporabo STM32H750B-DK Discovery plošče za povezavo z vozilom preko OBD-II prek CAN vodila. Omogoča zajem podatkov \
                 iz ECU enot vozila ter njihov prikaz v realnem času na integriranem zaslonu ali prek protokola UART.',
        },
        homelab: {
          title: 'Home lab',
          desc: 'Samogostovano Proxmox vozlišče za virtualizacijo, kontejnerje in samogostovane storitve. Deluje 24/7 skupaj z Raspberry Pi 4B. \
                 Sestavil in konfiguriral sistem, ki zdaj gosti več storitev in to portfolio spletno stran.',
        },
      },
    },
    experience: {
      label: '05 — izkušnje',
      title: 'Praktične izkušnje',
      lead: '',
      items: {
        net: {
          title: 'Omrežje in storitve',
          desc: 'Vzpostavitev reverznega proxyja (Nginx Proxy Manager), požarnega zidu in notranjih storitev.'
        },
        adm: {
          title: 'Sistemska administracija',
          desc: 'Delo v Linux okoljih z uporabo terminala za sistemsko konfiguracijo, odpravljanje napak, upravljanje paketov in redna vzdrževalna opravila.'
        },
        emb: {
          title: 'Vgrajeni sistemi',
          desc: 'Razvoj firmware-a za mikrokrmilnike STM32 s poudarkom na strojni povezljivosti, zajemu podatkov iz senzorjev ter integraciji vgrajenih sistemov v realnem času.',
        },
      },
    },
    contact: {
      label: '07 — kontakt',
      title: 'Stopi v stik',
      lead: '',
      platforms: {
        email:    'e-pošta',
        github:   'github',
        linkedin: 'linkedin',
      },
    },
    footer: {
      tagline: 'self-hosted · Node.js®',
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
const toBulletItems = value => {
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string' && v.trim());
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
};

// Renderers combine shared structure (module-scope arrays) with active-locale
// text (passed in via dict). Each renderer owns the inner DOM of its target.
const RENDERERS = {
  skills(el, dict) {
    const cats = dict.skills?.cats || {};
    el.innerHTML = skills.map(s => `
      <div class="skill-item">
        <div class="skill-text">
          <span class="skill-name">${esc(s.name)}</span>
          <span class="skill-cat">${esc(cats[s.cat] || s.cat)}</span>
        </div>
        <div class="skill-meta">
          <div class="skill-bars" aria-hidden="true">
            ${Array.from({ length: 5 }, (_, i) => {
              const fill = Math.max(0, Math.min(1, (s.bars ?? 0) - i));
              const cls = fill > 0 ? 'bar filled' : 'bar';
              return `<span class="${cls}" style="--fill:${(fill * 100).toFixed(2)}%"></span>`;
            }).join('')}
          </div>
        </div>
      </div>
    `).join('');
  },
  education(el, dict) {
    const t = dict.education?.items || {};
    const present = dict.education?.present || '';
    el.innerHTML = educationItems.map(e => {
      const tx = t[e.key] || {};
      const years = `${e.start} — ${e.end === 0 ? present : e.end}`;
      const details = toBulletItems(tx.details).length
        ? toBulletItems(tx.details)
        : toBulletItems(tx.detail);
      return `
        <div class="edu-item">
          <div>
            <div class="edu-school">${esc(tx.school)}</div>
            <div class="edu-degree">${esc(tx.degree)}</div>
            ${details.length ? `<ul class="edu-details">${details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
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
      const cert = l.cert || tx.cert || '';
      const details = toBulletItems(tx.details).length
        ? toBulletItems(tx.details)
        : toBulletItems(tx.context);
      return `
        <div class="lang-row">
          <div>
            <div class="lang-name">${esc(tx.name)}</div>
            ${details.length ? `<ul class="lang-details">${details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="lang-meta">
            <span class="lang-level">${esc(tx.level)}</span>
            <div class="lang-bars" aria-hidden="true">${bars}</div>
            ${cert ? `<span class="lang-cert">${esc(cert)}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },
  projects(el, dict) {
    const t = dict.projects?.items || {};
    if (!projectItems.length) {
      const empty = dict.projects?.empty || '';
      el.innerHTML = empty
        ? `<div class="proj-empty">${esc(empty)}</div>`
        : '';
      return;
    }
    const ongoingLabel = dict.projects?.ongoing || 'ongoing';
    el.innerHTML = projectItems.map(p => {
      const tx = t[p.key] || {};
      const tagsHtml = p.tags?.length
        ? `<div class="proj-tags">${p.tags.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>`
        : '';
      const yearInner = p.ongoing
        ? `<abbr title="${esc(ongoingLabel)}" aria-label="${esc(ongoingLabel)}">${esc(p.year ?? '')}<span class="ongoing-mark" aria-hidden="true">→</span></abbr>`
        : esc(p.year ?? '');
      const inner = `
        ${(p.year || p.ongoing) ? `<div class="proj-year">${yearInner}</div>` : ''}
        <div class="proj-body">
          <div class="proj-title">${esc(tx.title)}${p.href ? ' <span class="proj-arrow">↗</span>' : ''}</div>
          <div class="proj-desc">${esc(tx.desc)}</div>
          ${tagsHtml}
        </div>
      `;
      return p.href
        ? `<a class="proj-item" href="${esc(p.href)}" target="_blank" rel="noopener">${inner}</a>`
        : `<div class="proj-item">${inner}</div>`;
    }).join('');
  },
  experience(el, dict) {
    const t = dict.experience?.items || {};
    el.innerHTML = experienceItems.map(l => {
      const tx = t[l.key] || {};
      return `
        <div class="lab-item">
          <div class="lab-icon">${esc(l.key)}</div>
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
      <a href="${esc(c.href)}" class="contact-link" target="_blank" rel="noopener noreferrer">
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
    el.innerHTML = `
      <span class="lang-option${lang === 'en' ? ' is-active' : ''}">EN</span>
      <span class="lang-option${lang === 'sl' ? ' is-active' : ''}">SL</span>
    `;
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

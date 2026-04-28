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
  { key: 'sl',                bars: 4    },
  { key: 'en', cert: '',      bars: 3.25 },
  { key: 'de', cert: '',      bars: 2.1  },
];

// Projects. Add entries here as projects come online; an empty array
// renders the section's empty-state message instead of cards.
// `key` is the lookup id into messages.{en,sl}.projects.items.
// `year` (optional) shows in the mono badge column. `href` (optional)
// makes the card clickable. `tags` (optional) are non-translatable.
export const projectItems = [
  // { key: 'homelab', year: '2025', href: 'https://github.com/tilnp/homelab', tags: ['proxmox','docker'] },
];

// Keys + tags don't translate; title/desc do.
// key is used for item icon
export const experienceItems = [
  { key: 'vm',  tags: ['proxmox', 'lxc', 'vm', 'docker'] },
  { key: 'net', tags: ['https', 'firewall', 'ssl', 'dns'] },
  { key: 'srv', tags: ['apt', 'conf', 'status', 'monitoring'] },
  { key: 'adm', tags: ['admin', 'linux', 'shell', 'log'] },
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
      sub: 'CS student building things at the intersection of systems, software, and hardware. Tinkering with whatever seems interesting this week.',
      cta: 'get in touch ↓',
      github: 'github',
      resume: 'résumé ↗',
    },
    about: {
      label: '01 — about',
      title: 'Who I am',
      lead: '',
      p1: 'I\'m a <strong>computer science student</strong> with a genuine interest in how systems work — from operating systems and networking down to the underlying hardware.',
      p2: 'I’m comfortable working across both <strong>software and hardware</strong>: working in Linux environments, troubleshooting system issues, using the terminal, and understanding how components interact at a low level. I focus on practical problem-solving rather than just theory.',
      p3: 'Outside of coursework I run a small <strong>home lab</strong> on Proxmox where I experiment with self-hosted services, containerised applications, and networking setups. I treat it as a hands-on learning environment, regularly building, breaking, and improving systems.',
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
          degree: 'BSc Computer Science',
          details: [
            'Programming (Java, C, C++, Python)',
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
          ],
        },
        de: {
          name: 'German',
          level: 'Conversational',
          details: [
            'Basic conversation and comprehension',
          ],
        },
      },
    },
    projects: {
      label: '04 — projects',
      title: 'Selected work',
      lead: '',
      empty: 'More projects coming soon. In the meantime, see github.com/tilnp.',
      items: {
        // homelab: {
        //   title: 'Home lab',
        //   desc: 'Self-hosted infrastructure on Proxmox running ~12 services behind Nginx Proxy Manager.',
        // },
      },
    },
    experience: {
      label: '05 — experience',
      title: 'Practical Experience',
      lead: '',
      items: {
        vm: {
          title: 'Virtualization & containers',
          desc: 'Deploying and managing LXC containers and virtual machines on Proxmox, including system setup, configuration, and troubleshooting.'
        },
        net: {
          title: 'Networking & services',
          desc: 'Configuring network services including reverse proxy (Nginx Proxy Manager), private DNS server, firewall rules, and internal service exposure.'
        },
        srv: {
          title: 'Service deployment',
          desc: 'Installing, configuring, and maintaining self-hosted applications (Home Assistant, PhotoPrism, FileBrowser, Uptime Kuma, etc.), including updates and monitoring.'
        },
        adm: { 
          title: 'System administration',
          desc: 'Working in Linux environments using the terminal for system configuration, debugging, package management, and routine maintenance tasks.'
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
      sub: 'Študent računalništva, ki gradi stvari na presečišču sistemov, programske in strojne opreme. Ukvarja se s tistim, kar se ta teden zdi zanimivo.',
      cta: 'stopi v stik ↓',
      github: 'github',
      resume: 'življenjepis ↗',
    },
    about: {
      label: '01 — o meni',
      title: 'Kdo sem',
      lead: '',
      p1: 'Sem <strong>študent računalništva in informatike</strong> s pristnim zanimanjem za delovanje sistemov — od operacijskih sistemov in omrežij vse do strojne opreme, ki vse to poganja.',
      p2: 'Znajdem se tako pri <strong>programski</strong> kot <strong>strojni opremi</strong>: uporaba Linux okolij, odpravljanje sistemskih težav, delo v terminalu in razumevanje interakcije komponent na nizki ravni. Osredotočam se na praktično reševanje problemov in ne le na teorijo.',
      p3: 'Poleg študija upravljam manjši <strong>home lab</strong> na Proxmoxu, kjer eksperimentiram s samogostovanjem storitev, kontejnerskimi aplikacijami in omrežnimi nastavitvami. Nanj gledam kot na praktično učno okolje, kjer redno postavljam, preizkušam in izboljšujem sisteme.',
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
          degree: 'Računalništvo in informatika (UN)',
          details: [
            'Programiranje (Java, C, C++, Python)',
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
          ],
        },
        de: {
          name: 'nemščina',
          level: 'pogovorno',
          details: [
            'Osnovni pogovor in razumevanje',
          ],
        },
      },
    },
    projects: {
      label: '04 — projekti',
      title: 'Izbrano delo',
      lead: '',
      empty: 'Več projektov sledi kmalu. Do takrat si oglejte github.com/tilnp.',
      items: {
        // Per-locale overrides go here; keys default to en values.
      },
    },
    experience: {
      label: '05 — izkušnje',
      title: 'Praktične izkušnje',
      lead: '',
      // Any key omitted here falls back to its en counterpart automatically.
      items: {
        vm: {
          title: 'Virtualizacija in kontejnerji',
          desc: 'Postavljanje in upravljanje LXC kontejnerjev in virtualnih strojev na Proxmoxu, vključno z nastavitvijo, konfiguracijo in odpravljanjem težav.'
        },
        net: {
          title: 'Omrežje in storitve',
          desc: 'Vzpostavitev reverznega proxyja (Nginx Proxy Manager), zasebnega DNS strežnika in izpostavljanja notranjih storitev.'
        },
        srv: {
          title:'Postavitev storitev',
          desc: 'Namestitev, konfiguracija in vzdrževanje samogostovanih aplikacij (Home Assistant, PhotoPrism, FileBrowser, Uptime Kuma, itd.), vključno s posodobitvami in nadzorovanjem.'
        },
        adm: {
          title: 'Sistemska administracija',
          desc: 'Delo v Linux okoljih z uporabo terminala za sistemsko konfiguracijo, odpravljanje napak, upravljanje paketov in redna vzdrževalna opravila.'
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
    el.innerHTML = projectItems.map(p => {
      const tx = t[p.key] || {};
      const tagsHtml = p.tags?.length
        ? `<div class="proj-tags">${p.tags.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>`
        : '';
      const inner = `
        ${p.year ? `<div class="proj-year">${esc(p.year)}</div>` : ''}
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

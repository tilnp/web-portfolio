export const SUPPORTED_LOCALES = ['en', 'sl'];
export const DEFAULT_LOCALE = 'en';
export const STORAGE_KEY = 'lang';

export const messages = {
  en: {
    nav: {
      logoSuffix: '/ cs',
      home: 'home',
      about: 'about',
      skills: 'skills',
      education: 'education',
      lab: 'lab',
      contact: 'contact',
    },
    hero: {
      tag: 'computer science student',
      firstName: 'Tilen',
      lastName: 'Pokorn',
      sub: 'CS student building things at the intersection of systems, software, and hardware. Currently tinkering with whatever seems interesting this week.',
      cta: 'get in touch ↓',
      github: 'github',
      resume: 'résumé ↗',
    },
    about: {
      label: '01 — about',
      title: 'Who I am',
      p1: 'I\'m a <strong>computer science student</strong> with a genuine interest in how systems work — from operating systems and networking all the way down to the hardware underneath.',
      p2: 'I know my way around hardware as well as a terminal.',
      p3: 'Outside of coursework I run a small <strong>home lab</strong> on Proxmox — self-hosted services, containerised apps, networking experiments — and I treat it as a learning environment that\'s permanently one config mistake away from going to sleep late.',
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
      uniSchool: 'University of Ljubljana',
      uniDegree: 'BSc Computer Science',
      uniYears: '2024 — present',
      gymSchool: 'Škofja Loka Gymnasium',
      gymDegree: 'General Matura',
      gymYears: '2020 — 2024',
    },
    lab: {
      label: '04 — lab',
      title: 'Things I run & tinker with',
      server: {
        title: 'Home server',
        desc: 'Self-built Proxmox node with Debian LXC containers and virtual machines. Reverse-proxied via Nginx Proxy Manager. Hosts this CV and several self-hosted apps.',
      },
      pi: {
        title: 'Raspberry Pi experiments',
        desc: 'Pi-hole, OpenMediaVault.',
      },
      app: {
        title: 'Self-hosted stack',
        desc: 'Home Assistant, PhotoPrism, FileBrowser, Uptime Kuma and others. A permanent learning environment for deployment, monitoring, and keeping things actually running.',
      },
    },
    contact: {
      label: '05 — contact',
      title: 'Get in touch',
      email: 'email',
      github: 'github',
      linkedin: 'linkedin',
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
      lab: 'laboratorij',
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
      uniSchool: 'Univerza v Ljubljani',
      uniDegree: 'Računalništvo in informatika (UN)',
      uniYears: '2024 — danes',
      gymSchool: 'Gimnazija Škofja Loka',
      gymDegree: 'Splošna matura',
      gymYears: '2020 — 2024',
    },
    lab: {
      label: '04 — laboratorij',
      title: 'Kaj poganjam in po čem brkljam',
      server: {
        title: 'Domači strežnik',
        desc: 'Lastnoročno postavljeno Proxmox vozlišče z Debian LXC kontejnerji in virtualnimi stroji. Reverzni proxy preko Nginx Proxy Managerja. Gosti ta CV in več samogostovanih aplikacij.',
      },
      pi: {
        title: 'Eksperimenti z Raspberry Pi',
        desc: 'Pi-hole, OpenMediaVault.',
      },
      app: {
        title: 'Samogostovane storitve',
        desc: 'Home Assistant, PhotoPrism, FileBrowser, Uptime Kuma in druge. Stalno učno okolje za uvajanje, nadzor in držanje stvari dejansko v teku.',
      },
    },
    contact: {
      label: '05 — kontakt',
      title: 'Stopi v stik',
      email: 'e-pošta',
      github: 'github',
      linkedin: 'linkedin',
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
  const dict = messages[lang];
  document.documentElement.lang = lang;

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

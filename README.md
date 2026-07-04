# web-portfolio

Personal CV / portfolio site. Single page, vanilla HTML/CSS/JS.

## Repo layout

```
web-cv/
├── README.md
├── .gitattributes
├── .gitignore
├── scripts/
│   └── build_wires.py    ← regenerate board.wires.json after editing board.svg
└── public/               ← web root
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── i18n.js
    ├── board.svg
    └── board.wires.json  ← prebuilt wire→component
```

Everything the browser fetches lives inside `public/`. The repo root only holds project-level files.

## Run it

Serving `public/` over HTTP — `file://` won't work because `script.js` fetches `board.svg` and `board.wires.json`.

- `python3 -m http.server -d public` → open <http://localhost:8000>
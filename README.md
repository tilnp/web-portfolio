# web-portfolio

Personal CV / portfolio site. Single page, vanilla HTML/CSS/JS, served by a small dependency-free Node server and shipped as a Docker image.

## Repo layout

```
web-portfolio/
├── README.md
├── LICENSE
├── .gitattributes
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yaml   ← copied to the host on deploy
├── deploy.sh.example     ← copy to deploy.sh (gitignored) and set HOST
├── package.json          ← fonts only (@fontsource-variable)
├── package-lock.json
├── server.js             ← static file server (no dependencies)
├── scripts/
│   └── build_wires.py    ← regenerate board.wires.json after editing board.svg
└── public/               ← web root
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── i18n.js
    ├── board.svg
    ├── board.wires.json  ← prebuilt wire→component
    └── fonts/            ← Geist woff2 files, committed
```

Everything the browser fetches lives inside `public/`. The repo root only holds server, build and project-level files.

## Run locally

```bash
node server.js   # http://localhost:3000 (PORT env var overrides)
```

## Docker

Build:

```bash
docker build -t web-portfolio:1.0 .
```

Add `--platform linux/amd64` (or `linux/arm64`) if the build machine and server architectures differ. `deploy.sh` runs this automatically on release.

### Health check

`GET /healthz` returns `200 ok`, or `503` while shutting down. The Dockerfile's `HEALTHCHECK` polls it. Status shows as `(healthy)` in `docker compose ps` on the server.

## Deploy

One-time, on the server:

```bash
ssh user@server 'mkdir -p /opt/web-portfolio'
```

One-time, on the build machine:

```bash
cp deploy.sh.example deploy.sh && chmod +x deploy.sh   # then set HOST in deploy.sh
```

Then, with a new version tag per release:

```bash
./deploy.sh 1.1
```

The script builds the image, copies it and `docker-compose.yaml` to the host over SSH, and runs `docker compose up -d`. Check status with `ssh user@server 'cd /opt/web-portfolio && docker compose ps'`.

Rollback: `ssh user@server 'cd /opt/web-portfolio && TAG=1.0 docker compose up -d'`

The container serves plain HTTP on port 3000. Point the reverse proxy at `<host-ip>:3000`; TLS is handled there.

## Updating fonts

Fonts are committed in `public/fonts/`. To update them, run `npm update`, then copy the needed `.woff2` files from `node_modules/@fontsource-variable/*/files/` into `public/fonts/`.

## Editing the board

After changing `public/board.svg`, regenerate the wire map:

```bash
python3 scripts/build_wires.py
```

## License

The source code is licensed under the [MIT License](LICENSE).\
Personal content, images, and branding are excluded and remain the property of the author.
# web-portfolio

Personal CV / portfolio site. Single page, vanilla HTML/CSS/JS, served by a small dependency-free Node.js server and shipped as a Docker image.

## Repo layout

```text
web-portfolio/
├── README.md
├── LICENSE
├── .gitattributes
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yaml
├── deploy.sh.example
├── package.json
├── package-lock.json
├── server.js
├── scripts/
│   └── build_wires.py
└── public/
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── i18n.js
    ├── board.svg
    ├── board.wires.json
    └── fonts/
```

Everything the browser fetches lives inside `public/`. The repository root contains server, build and project-level files.

## Run locally

```bash
node server.js
```

Available at `http://localhost:3000`.

The `PORT` environment variable overrides the default port. The server listens on `0.0.0.0`.

## Docker

### Build

```bash
docker build -t web-portfolio:1.0 .
```

Add `--platform linux/amd64` (or `linux/arm64`) if the build machine and server architectures differ.

### Security

The Docker image uses:

- Node.js 24 Alpine.
- Non-root `node` user.
- Read-only filesystem.
- All Linux capabilities dropped.
- Privilege escalation disabled.
- Docker init process enabled through Compose.

### Resource limits

| Resource | Limit |
|---|---:|
| Memory | 128 MB |
| CPU | 0.5 cores |
| Processes | 50 |

### Health check

`GET /healthz` returns:

- `200 ok` when the server is running.
- `503 shutting down` when graceful shutdown begins.

The Dockerfile defines a `HEALTHCHECK` that polls this endpoint.

Configuration:

- Interval: 30 seconds
- Timeout: 5 seconds
- Start period: 5 seconds
- Retries: 3

Check health:

```bash
docker inspect --format='{{.State.Health.Status}}' web-portfolio
```

Possible statuses: `starting`, `healthy`, `unhealthy`.

## Deploy

### One-time server setup

Create the deployment directory:

```bash
ssh user@server 'mkdir -p /opt/web-portfolio'
```

### One-time build machine setup

Copy the deployment script:

```bash
cp deploy.sh.example deploy.sh
chmod +x deploy.sh
```

Edit `deploy.sh` and configure:

```bash
HOST=user@server
DIR=/opt/web-portfolio
```

Ensure SSH key authentication is configured and the remote user has permission to run Docker commands.

### Deploy a new version

Use a unique version tag for each release:

```bash
./deploy.sh 1.0
```

The script automatically:

1. Builds the Docker image locally.
2. Exports and compresses the image.
3. Transfers it to the server over SSH.
4. Imports the image on the server.
5. Copies `docker-compose.yaml` to the deployment directory.
6. Starts or updates the container using the specified image tag.

### Check deployment

```bash
ssh user@server 'cd /opt/web-portfolio && docker compose ps'
```

View logs:

```bash
ssh user@server 'docker logs -f web-portfolio'
```

### Rollback

Deploy a previously uploaded image version:

```bash
ssh user@server 'cd /opt/web-portfolio && TAG=1.0 docker compose up -d'
```

Previous image versions remain available on the server unless manually removed.

## Networking

The container serves plain HTTP on port `3000`.

The Compose configuration binds the port to the specified server IP:

```yaml
ports:
  - "192.168.64.X:3000:3000"
```

Replace `X` with the server's actual IP address.

Point Nginx Proxy Manager at:

```text
Scheme: http
Forward Hostname / IP: <server-ip>
Forward Port: 3000
```

TLS termination is handled by the reverse proxy.

Port 3000 should only be accessible from trusted infrastructure, particularly the reverse proxy. Do not expose it directly to the internet.

## Updating fonts

Fonts are committed in `public/fonts/`.

To update them, run:

```bash
npm update
```

Then copy the needed `.woff2` files from:

```text
node_modules/@fontsource-variable/*/files/
```

into `public/fonts/`.

## Editing the board

After changing `public/board.svg`, regenerate the wire map:

```bash
python3 scripts/build_wires.py
```

Commit both `board.svg` and the regenerated `board.wires.json`.

## License

The source code is licensed under the [MIT License](LICENSE).

Personal content, images and branding are excluded and remain the property of the author.
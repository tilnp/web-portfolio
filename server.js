const http = require('http');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const PUBLIC = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

let shuttingDown = false;

const send = (res, status, body) =>
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }).end(body);

// Returns an absolute path inside PUBLIC, or null if the URL is malformed/escapes it
function resolveFile(pathname) {
  let rel;
  try { rel = decodeURIComponent(pathname); } catch { return null; }
  if (rel.includes('\0')) return null;
  const file = path.join(PUBLIC, rel === '/' ? 'index.html' : rel);
  return file.startsWith(PUBLIC + path.sep) ? file : null;
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split('?')[0];

  if (pathname === '/healthz') {
    return send(res, shuttingDown ? 503 : 200, shuttingDown ? 'shutting down' : 'ok');
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return send(res, 405, 'Method not allowed');
  }

  const file = resolveFile(pathname);
  if (!file) return send(res, 400, 'Bad request');

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found');
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Content-Length': st.size,
    });
    if (req.method === 'HEAD') return res.end();
    pipeline(fs.createReadStream(file), res, () => {});
  });
});

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  server.close(() => process.exit(0));
  server.closeIdleConnections();
  setTimeout(() => process.exit(1), 10_000).unref(); // force-exit if connections hang
}
process.on('SIGTERM', shutdown); // docker stop
process.on('SIGINT', shutdown);

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
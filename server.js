'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

// ============================================================
// Configuration
// ============================================================

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const PUBLIC_DIR = path.resolve(__dirname, 'public');

// Cache durations (seconds)
const CACHE_STATIC = Number(process.env.CACHE_STATIC) || 86400; // 1 day
const CACHE_HTML = Number(process.env.CACHE_HTML) || 300;       // 5 minutes

const SHUTDOWN_TIMEOUT = 10_000;

// ============================================================
// MIME TYPES
// ============================================================

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',

    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.avif': 'image/avif',

    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',

    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
};

// ============================================================
// SECURITY HEADERS
// ============================================================

function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    );
}

// ============================================================
// HELPERS
// ============================================================

let shuttingDown = false;

function send(res, status, body, extraHeaders = {}) {
    res.writeHead(status, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        ...extraHeaders,
    });

    res.end(body);
}

// Resolve URL to an absolute path inside PUBLIC_DIR.
// Returns null if the URL is malformed or attempts traversal.

function resolveFile(pathname) {
    let decoded;

    try {
        decoded = decodeURIComponent(pathname);
    } catch {
        return null;
    }

    // Reject null bytes, backslashes and hidden files.
    if (
        decoded.includes('\0') ||
        decoded.includes('\\') ||
        decoded.split('/').some(part => part.startsWith('.'))
    ) {
        return null;
    }

    const relativePath = decoded === '/'
        ? 'index.html'
        : decoded.replace(/^\/+/, '');

    const file = path.resolve(PUBLIC_DIR, relativePath);
    const relative = path.relative(PUBLIC_DIR, file);

    // Prevent escaping the public directory.
    if (
        relative === '..' ||
        relative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relative)
    ) {
        return null;
    }

    return file;
}

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer((req, res) => {

    setSecurityHeaders(res);

    // Parse request URL.
    let pathname;

    try {
        pathname = new URL(req.url, 'http://localhost').pathname;
    } catch {
        return send(res, 400, 'Bad request');
    }

    // --------------------------------------------------------
    // Health check
    // --------------------------------------------------------

    if (pathname === '/healthz') {
        return send(
            res,
            shuttingDown ? 503 : 200,
            shuttingDown ? 'shutting down' : 'ok'
        );
    }

    // --------------------------------------------------------
    // Allowed methods
    // --------------------------------------------------------

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return send(res, 405, 'Method not allowed', {
            'Allow': 'GET, HEAD',
        });
    }

    // --------------------------------------------------------
    // Resolve requested file
    // --------------------------------------------------------

    const file = resolveFile(pathname);

    if (!file) {
        return send(res, 400, 'Bad request');
    }

    // --------------------------------------------------------
    // File information
    // --------------------------------------------------------

    fs.stat(file, (err, stats) => {

        if (err || !stats.isFile()) {
            return send(res, 404, 'Not found');
        }

        // ----------------------------------------------------
        // Response headers
        // ----------------------------------------------------

        const ext = path.extname(file).toLowerCase();

        const isHtml = ext === '.html' || ext === '.htm';

        const cacheTime = isHtml ? CACHE_HTML : CACHE_STATIC;

        const etag = `"${stats.size.toString(16)}-${Math.trunc(stats.mtimeMs).toString(16)}"`;

        const lastModified = stats.mtime.toUTCString();

        const headers = {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Content-Length': stats.size,

            'ETag': etag,
            'Last-Modified': lastModified,

            'Cache-Control': `public, max-age=${cacheTime}`,
            'Accept-Ranges': 'bytes',
        };

        // ----------------------------------------------------
        // Conditional requests
        // ----------------------------------------------------

        const ifNoneMatch = req.headers['if-none-match'];
        const ifModifiedSince = req.headers['if-modified-since'];

        if (
            (ifNoneMatch && ifNoneMatch.split(',').map(v => v.trim()).includes(etag)) ||
            (!ifNoneMatch && ifModifiedSince &&
                !Number.isNaN(Date.parse(ifModifiedSince)) &&
                stats.mtime <= new Date(ifModifiedSince))
        ) {
            res.writeHead(304, {
                'ETag': etag,
                'Last-Modified': lastModified,
                'Cache-Control': headers['Cache-Control'],
            });

            return res.end();
        }

        res.writeHead(200, headers);

        // HEAD requests only return headers.
        if (req.method === 'HEAD') {
            return res.end();
        }

        // ----------------------------------------------------
        // Stream file
        // ----------------------------------------------------

        pipeline(
            fs.createReadStream(file),
            res,
            (err) => {
                if (err && !res.destroyed) {
                    res.destroy(err);
                }
            }
        );

    });

});

// ============================================================
// SERVER SETTINGS
// ============================================================

server.requestTimeout = 30_000;
server.headersTimeout = 15_000;
server.keepAliveTimeout = 5_000;
server.maxHeadersCount = 100;

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

function shutdown(signal) {

    if (shuttingDown) return;

    shuttingDown = true;

    console.log(`${signal} received. Shutting down...`);

    // Stop accepting new connections.
    server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
    });

    // Close idle connections immediately.
    server.closeIdleConnections();

    // Force shutdown if connections remain.
    const timeout = setTimeout(() => {
        console.error('Shutdown timeout. Forcing exit.');

        server.closeAllConnections();
        process.exit(1);

    }, SHUTDOWN_TIMEOUT);

    timeout.unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ============================================================
// START SERVER
// ============================================================

server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`Serving: ${PUBLIC_DIR}`);
});
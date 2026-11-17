FROM node:22-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --chown=node:node server.js ./
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:${PORT}/healthz || exit 1
CMD ["node", "server.js"]
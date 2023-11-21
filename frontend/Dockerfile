# Builder image
FROM docker.io/node:20-alpine AS build

WORKDIR /app

# Set up pnpm
RUN npm install -g pnpm@7.32.2 && pnpm config set store-dir .pnpm-store
COPY pnpm-lock.yaml .npmrc* ./
RUN pnpm fetch

# Build
COPY . .
RUN pnpm install --frozen-lockfile --offline --ignore-scripts --recursive
RUN pnpm run build

# Runtime image
FROM docker.io/node:20-alpine AS release

ENV PORT 3000
ENV NODE_ENV production

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
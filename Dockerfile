# Stage 1: Install dependencies
FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Stage 2: Build
FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20 AS runner
WORKDIR /app
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nodejs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/database.ts ./
COPY --from=builder /app/supabase.ts ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/index.html ./
COPY --from=builder /app/types.ts ./
COPY --from=builder /app/constants.ts ./
COPY --from=builder /app/services ./services
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/components ./components

ENV NODE_ENV=production
ENV PORT=3000

USER nodejs
EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]

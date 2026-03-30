# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install specific Prisma version
RUN npm install prisma@5.22.0 @prisma/client@5.22.0

# Install dependencies
RUN npm ci

# Stage 2: Build Prisma client
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json package-lock.json* ./

# Generate Prisma client with specific version
RUN npm install prisma@5.22.0 @prisma/client@5.22.0 && npx prisma generate

# Copy source files
COPY . .

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/services ./services
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/database.ts ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/index.html ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/types.ts ./
COPY --from=builder /app/constants.ts ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Change ownership
USER nodejs

# Expose port
EXPOSE 3000

# Start the server
CMD ["npx", "tsx", "server.ts"]

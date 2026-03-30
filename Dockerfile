# Stage 1: Install all dependencies
FROM node:20 AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy prisma folder
COPY prisma ./prisma

# Remove node_modules to force fresh install
RUN rm -rf node_modules

# Remove cached Prisma engine to force fresh install
RUN rm -rf node_modules/.prisma

# Install all dependencies
RUN npm install --force && \
    npm install prisma@5.22.0 @prisma/client@5.22.0 groq-sdk@0.5.0 && \
    npx prisma generate

# Stage 2: Build
FROM node:20 AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy ALL source files needed for build
COPY . .

# Build frontend
RUN npm run build

# Stage 3: Production
FROM node:20 AS runner
WORKDIR /app

# Create non-root user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nodejs

# Copy all files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/supabase.ts ./
COPY --from=builder /app/database.ts ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/index.html ./
COPY --from=builder /app/types.ts ./
COPY --from=builder /app/constants.ts ./
COPY --from=builder /app/services ./services
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/components ./components

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Change ownership
USER nodejs

# Expose port
EXPOSE 3000

# Start the server
CMD ["npx", "tsx", "server.ts"]

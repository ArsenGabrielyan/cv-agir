# Use a lightweight Node image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy only essential configs and manifest first
COPY package*.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY patches ./patches

# Install dependencies early
RUN npm install

# Copy remaining necessary folders and files
COPY prisma ./prisma
COPY public ./public
COPY src ./src

# ✅ Fix #1: Ensure Tailwind’s input file is present
COPY src/app/globals.css ./src/app/globals.css

# ✅ Fix #2: Ensure Prisma finds the schema
ENV PRISMA_SCHEMA_PATH=./prisma/schema.prisma

# Apply patch *after* full source context is ready
RUN npx patch-package

# Generate Prisma client + print.css
RUN npx prisma generate && npm run gen-print-css

# ✅ Safe final build
RUN npm run build

# Start server
CMD ["npx", "next", "start"]
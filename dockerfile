FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./

RUN npm install --ignore-scripts

COPY . .
ENV PRISMA_SCHEMA_PATH=./prisma/schema.prisma

RUN npx prisma generate && npm run gen-print-css
RUN npm run build

CMD ["npx", "next", "start"]
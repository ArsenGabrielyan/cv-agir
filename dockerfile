FROM node:lts

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org
RUN npm install --ignore-scripts

COPY . .
ENV PRISMA_SCHEMA_PATH=./prisma/schema.prisma

RUN npm run postinstall
RUN npm run build

CMD ["npx", "next", "start"]
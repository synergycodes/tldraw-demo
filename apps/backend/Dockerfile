FROM node:23-alpine

WORKDIR /app

RUN npm install --global corepack@latest
RUN corepack enable
RUN corepack prepare pnpm@latest-10 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --prod

COPY apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend/dist

EXPOSE 5858

ENTRYPOINT ["node", "server.node.js"]

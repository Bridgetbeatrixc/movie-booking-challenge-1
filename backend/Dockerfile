FROM node:20-alpine

WORKDIR /app

# Copy manifests first so dependency installation remains cached between code changes.
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

USER node
CMD ["node", "src/server.js"]

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --no-audit --no-fund

COPY src/ ./src/

EXPOSE 5000

CMD ["node", "src/index.js"]


FROM node:22-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm install --include=optional
COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npx", "wrangler", "dev", "--config", "dist/server/wrangler.json", "--port", "5000", "--ip", "0.0.0.0"]


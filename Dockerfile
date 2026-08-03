FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install --prefix . && npm install --prefix client && npm install --prefix server
COPY . .
RUN npm run build --prefix client
EXPOSE 5000 5173
CMD ["sh", "-c", "npm run dev --prefix server & npm run dev --prefix client"]

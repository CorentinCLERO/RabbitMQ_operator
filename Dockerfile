FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY setup-env.js ./
COPY .env.example ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
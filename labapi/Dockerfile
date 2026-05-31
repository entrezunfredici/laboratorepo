FROM node:20-alpine

# Dépendances système pour sqlite3 (compilation native)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copie des manifestes en premier pour profiter du cache Docker
COPY package*.json ./

RUN npm install --omit=dev

# Copie du code source
COPY . .

# Dossier pour la base SQLite (monté en volume pour la persistance)
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "./bin/www"]

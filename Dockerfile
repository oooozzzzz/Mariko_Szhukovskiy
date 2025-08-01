FROM node:22-alpine

RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    ca-certificates \
    && ln -s /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 \
    && ln -s /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Генерируем Prisma Client (без подключения к БД)
RUN npx prisma generate

# Делаем скрипт запуска исполняемым
RUN chmod +x ./start.sh

EXPOSE 3000
CMD ["sh", "./start.sh"]
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

COPY init.sql /docker-entrypoint-initdb.d/init.sql

RUN apt-get update && apt-get install -y sqlite3

EXPOSE 3000

CMD ["sh", "-c", "sqlite3 /app/comment_db.db < /docker-entrypoint-initdb.d/init.sql && npm start"]
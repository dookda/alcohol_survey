FROM node:17.5.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i --production

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
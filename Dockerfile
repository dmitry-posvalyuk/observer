FROM node:20-alpine

COPY . .

RUN npm i && \
    npm run build && \
    npm i -g pm2

CMD ["pm2-runtime", "pm2.config.js"]

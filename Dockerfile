FROM node:20-alpine

ADD app.js /app/app.js
RUN cd /app && yarn add express express-prometheus-middleware prom-client
WORKDIR /app
USER 1000

ENTRYPOINT ["node", "/app/app.js"]

FROM node:6.1.0

ADD ./package.json /app/package.json

WORKDIR /app
RUN npm install

ENV NODE_ENV=production
ENV PORT=80

ADD ./ /app

EXPOSE 80

CMD [ "node", "index.js" ]
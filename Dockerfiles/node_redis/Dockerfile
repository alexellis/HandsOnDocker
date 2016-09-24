FROM mhart/alpine-node:4.4

WORKDIR /root
RUN npm install node-redis
ADD ./app.js  ./app.js

CMD ["node", "app.js"]

FROM mhart/alpine-node:4.4

WORKDIR /root
RUN npm install node-redis
ADD ./app.js  ./app.js

EXPOSE 3000
CMD ["node", "app.js"]
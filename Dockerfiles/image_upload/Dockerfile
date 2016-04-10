FROM mhart/alpine-node:4

USER root
RUN mkdir -p /var/web
WORKDIR /var/web

ADD app.js ./
ADD package.json ./
ADD views ./views

#RUN mkdir -p uploads

RUN npm install

EXPOSE 3000
CMD ["node", "app.js"]

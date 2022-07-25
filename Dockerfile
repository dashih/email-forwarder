FROM node:16
WORKDIR /home/node/app
COPY . .
EXPOSE 25
CMD [ "node", "app.js" ]

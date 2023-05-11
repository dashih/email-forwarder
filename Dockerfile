FROM node:18.16.0
WORKDIR /home/node/app
COPY . .
EXPOSE 25
CMD [ "node", "app.js" ]
HEALTHCHECK CMD curl --fail smtp://localhost --mail-from healthcheck@dannyshih.net --mail-rcpt healthcheck@dannyshih.net --upload-file /home/node/app/healthcheck-email.txt

FROM node:10

RUN apt-get update && \
    apt-get install -y unoconv libreoffice-writer libreoffice-calc

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
EXPOSE 8080

CMD [ "node", "index.js" ]

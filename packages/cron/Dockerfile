FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
# This ensures that while in production, the .env file gets read from the current directory instead of the 
# previous directory.
ENV MHC_DOCKER=true
WORKDIR /home/node/app

COPY package.json ./
COPY dist/index.js ./
COPY .env.local ./

USER node

RUN npm install

CMD [ "node", "index.js" ]

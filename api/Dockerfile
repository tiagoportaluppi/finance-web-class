FROM node:lts-slim

ENV HOME=/home/app
COPY . $HOME/api
WORKDIR $HOME/api

RUN npm update && npm install
RUN npm i -g nodemon dotenv

EXPOSE 3001 3000
CMD ["npm", "start"]

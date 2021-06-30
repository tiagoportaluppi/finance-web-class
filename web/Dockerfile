FROM node:10 AS builder

# WORKDIR /app
# COPY . .

ENV HOME=/home/app
# COPY . $HOME/web
# WORKDIR $HOME/web

COPY ./build $HOME/web/build
# WORKDIR $HOME/web

# RUN npm install
# RUN npm run build

FROM nginx:alpine

ENV HOME=/home/app

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder $HOME/web/build .

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

ENTRYPOINT ["nginx", "-g", "daemon off;"]

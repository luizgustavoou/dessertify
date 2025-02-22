FROM node:alpine as development

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install --legacy-peer-deps

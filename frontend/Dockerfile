FROM node:16-buster-slim

RUN apt-get -y update
RUN apt-get -y upgrade
RUN npm install -g serve
COPY build ./build

CMD ["serve","-s","build"]
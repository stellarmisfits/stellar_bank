FROM node:latest

RUN addgroup -S IBM && adduser -S -g IBM ibmer

ENV HOME=/home/ibmer

COPY package*.json $HOME/app

COPY src $HOME/app/src

WORKDIR $HOME/app

RUN chown -R ibmer:ibmer $HOME/* /usr/local/ && \
    npm cache clean && \
    npm install --silent --progress=false && \ # --production && \
    chown -R ibmer:ibmer $HOME/*

USER ibmer

EXPOSE 3000

CMD ["npm", "start"]
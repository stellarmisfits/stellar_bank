FROM node:alpine

RUN addgroup -S IBM && adduser -S -g IBM ibmer
ENV HOME=/home/ibmer

COPY package*.json $HOME/app/
COPY src $HOME/app/src/
COPY .env $HOME/app/

WORKDIR $HOME/app

RUN chown -R ibmer:IBM $HOME/* /usr/local/
RUN npm install
RUN chown -R ibmer:IBM $HOME/* /usr/local/

USER ibmer

EXPOSE 3009 3010

CMD npm start

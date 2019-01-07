FROM keymetrics/pm2:latest-jessie

RUN apt-get dist-upgrade  
RUN apt-get update
RUN apt-get install -y build-essential gcc g++ make autoconf automake
RUN apt-get install -y curl wget git procps gzip vim dnsutils net-tools

RUN echo 'purple-ts.threebx.com' >> /etc/hostname

RUN apt-get install -y nodejs
RUN npm install --unsafe-perm -g pm2@latest
RUN npm install --unsafe-perm -g nodemon

RUN mkdir -p /srv/coinserver
COPY . /srv/coinserver
WORKDIR /srv/coinserver

RUN npm install

EXPOSE 3333

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--only", "ts_purple" ]

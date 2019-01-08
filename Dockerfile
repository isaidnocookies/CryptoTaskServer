FROM keymetrics/pm2:latest-jessie

RUN apt-get dist-upgrade  
RUN apt-get update
RUN apt-get install -y build-essential gcc g++ make autoconf automake
RUN apt-get install -y curl wget git procps gzip vim dnsutils net-tools

RUN echo 'ts.threebx.com' >> /etc/hostname

RUN apt-get install -y nodejs
RUN npm install --unsafe-perm -g pm2@latest
RUN npm install --unsafe-perm -g nodemon
RUN npm install --unsafe-perm -g typescript

RUN mkdir -p /srv/taskserver
COPY . /srv/taskserver
WORKDIR /srv/taskserver

RUN npm install
RUN npm run build
RUN tsc

EXPOSE 3333
EXPOSE 6379

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--only", "ts" ]

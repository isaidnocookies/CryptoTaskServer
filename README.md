# Node Task Server

First attempt at creating a replacement for the existing python-based task server.

## Getting Started

For development:
```
clone repo
cd node-task-server
npm install
npm run dev
```
Check the config.ts file to configure local db settings, local environment settings, etc.

## Running the tests

Currently, tests are used manually by importing and integrating the testing functions included in /helpers/tester.functions. These functions help to compare the created version against a downloaded version. This passes if the values are within a percentage.

## Deployment

TBD

## Running the Task Server Locally

You will need MongoDB and Redis running locally.

MongoDB can be installed via Brew. Create its database directory and make it accessible.

```
brew install mongodb
mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

You should now be able to launch your MongoDB locally by runinng

```
mongod
```


To install redis locally run the following:

```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
```

Then naviage to redis-stable/src and run

```
redis-server
```

Your redis server should now be running.

You will need to change the redis url in the task server to local instead of docker (unless you are using docker)

```
local: {
    url: "127.0.0.1",
    //url: "host.docker.internal",
    port: "6379"
},
```

You can now launch your task server locally by running the following in your task server directory.

```
npm run dev
```



## Troubleshooting

If the process fails to spawn, make sure that these dependencies are installed:

```
npm install ts-node
npm install typescript
```

If your MongoDB instance fails to launch, your permissions for its data folder may be insufficient. You can also just run mongod as sudo.

```
sudo chown -R `id -un` /data/db
```
or
```
sudo mongod
```

## Built With

* Typescript
* NodeJS
* MongoDB
* Express
* Redis

## Authors

* **Christopher Forte** - *Initial work*
* **Scott Oberman** - *More work and documentation*
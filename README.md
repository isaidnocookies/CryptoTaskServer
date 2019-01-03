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

## Built With

* Typescript
* NodeJS
* MongoDB
* Express

## Authors

* **Christopher Forte** - *Initial work*
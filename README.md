![PumaPay Logo](diagrams/pumapay02.png "PumaPay")


# Proof of Concept for PumaPay

# Description
The first version of the PumaPay SDK is now available for developers' use free of charge. Built around the features of the ERC20 token, this initial version of the PumaPay solution is an open-source protocol that flexibly integrates with any kind of merchant platform. This allows developers to either clone the entire project or use only parts of it directly into their platform or edit it as it may suit the merchant's needs. While this only facilitates a crypto-typical push action, the full-scale Pull protocol will come with a future version of this software.
# Installation

### Prerequisites
* [Install Node and NPM](https://www.npmjs.com/get-npm)
* [Install Docker](https://docs.docker.com/engine/installation/)
* [Angular-cli](https://github.com/angular/angular-cli) `npm install -g @angular/cli@latest`
* For Windows in case it will not execute `npm install` correctly > `npm install -g windows-build-tools`

### Get started with Node
1.  Clone this repo
```git
$ git clone https://github.com/pumapayio/puma-poc.git
```
2.  Change to project directory

```bash
$ cd puma-poc
```
3.  Install the required packages

```bash
# from root
$ cd ./server
$ npm install

$ cd ./client
$ npm install
```
4. In Order to access the data you need a running instance of Postgres 

### Get started with Docker
1.  Clone this repo

```git
$ git clone https://github.com/pumapayio/puma-poc.git
```
2.  Change to project directory

```bash
$ cd puma-poc
```
3.  Build the docker containers

```docker
$ docker-compose build
```
4.  Start the application

```docker
$ docker-compose up -d
```
#### Configure Docker Windows
You need to share your C drive with docker. Go to `Docker > Settings > Shared Drives > Select C > Apply` - You will be asked to fill in your credentials.
In case this doesn't work, follow [this guide](https://blogs.msdn.microsoft.com/stevelasker/2016/06/14/configuring-docker-for-windows-volumes/). Firewall needs to be paused in order for this to work properly.

# Usage 
* PoC Webpage : `http://localhost:4200`
* Server: `http://localhost:8080`
* DB:
    * PGHOST=postgres
    * PGUSER=local_user
    * PGPASSWORD=local_pass
    * PGDATABASE=local_puma_poc
    * PGPORT=`http://localhost:5435` -- port specified in docker-compose.yml

#### Clean up local development environment
```bash
$ docker-compose down
## OR
$ docker ps # list running containers
$ docker ps -a # list all containers
# check the COINTAINER_ID from list obtained in previous command
$ docker rm <CONTAINER_ID> # remove the container with ID
$ docker rm <CONTAINER_ID> -f # force remove the container with ID
```

## Run Tests
First you need to deploy the application locally - See [Local Deployment](#local-deployment)
Testing Suite:

* [Mocha](https://mochajs.org/) - Test Framework
* [Chai](http://www.chaijs.com/) - Assertion Library
* [Supertest](https://github.com/visionmedia/supertest) - HTTP Testing

#### Run all tests
To run all the tests

```bash
$ npm test
```

#### E2E Testing
To run the E2E tests

```bash
$ npm run test-e2e
```

#### Unit Testing
To run all the Unit tests

```bash
$ npm run test-unit
```

To run individual unit test

```bash
$ mocha -r ts-node/register path/to/unit/test
```

## API Documentation
To see the specification of the APIs import [swagger.yml](./swagger.yml) at the [online swagger editor](https://editor.swagger.io)

## Docker Useful Links
You can find some more info about docker [here](https://github.com/wsargent/docker-cheat-sheet) and [here](https://medium.com/statuscode/dockercheatsheet-9730ce03630d)

# Credits 

# License

# Troubleshooting
### Docker containers failed to start
In case of the error below when starting the docker containers, you should quit docker from the taskbar and start it again

```
ERROR: for pumaapi_pp_io_dev_1  Cannot start service pp_io_dev: driver failed programming external connectivity on endpoint pumaapi_pp_io_dev_1
```

### Docker Shared Volumes - Not working as expected
In case of the error below when starting the docker containers, you should go to Docker Settings from the taskbar > Shared Drives > UnShare and Share the C drive for this to work. Keep in mind that your firewall should be disabled during this process.

```
 psql:/docker-entrypoint-initdb.d/20-create-poc-tables.sql:0: could not read from input file: Is a directory
```
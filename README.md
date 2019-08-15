# CI/CD 101 Workshop Repository 
Simple Node.js project and static website to demonstrate basic CI/CD w/ CircleCI.

## Prerequisites
- [Github](https://github.com)
- [Dockerhub](https://hub.docker.com)
- Fork this repository to your Github account

Running anything on local computer requires [Node.js](https://nodejs.org/en/)_ and [yarn](https://yarnpkg.com/en/_) installed. Otherwise, the [tutorial](#tutorial) section below can be done all in your browser.

## Tutorial
This section shows how to setup a basic CI/CD pipeline with this project and CircleCI. The goals are:
1. Automatically run tests against changes to the repository
1. Automatically build and push a new Docker image if/when tests pass

## Local Machine
### Setup & Run
1. Revisit the [prerequisites](#prerequisites) section above to ensure you have the required software installed.
1. Clone the repository and run `yarn` to install dependencies.
1. `yarn start` to start a simple web server for the static assets.

## Test
The test suite uses [TestCafe](https://devexpress.github.io/testcafe/). It also assumes Chrome and Firefox browsers available on the system.

1. `yarn test` to start the tests. They're very elementary content checks.


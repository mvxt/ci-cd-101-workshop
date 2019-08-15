# CI/CD 101 Workshop Repository 
Simple Node.js project and static website to demonstrate basic CI/CD w/ CircleCI. The presentation is not needed to use this repository, but you can [view those slides here](https://docs.google.com/presentation/d/1VQbs8DrNX0rqTHNwFmVzve49LNNiu1MuXs0Hu8Ppbk8)

## Prerequisites
- [Github](https://github.com)
- [Dockerhub](https://hub.docker.com)
- Fork this repository to your Github account
- Understanding of basic terminology and concepts in CI/CD (e.g., "jobs", "workflows" or "pipelines", "tasks" or "steps", etc.)

Running anything on local computer requires [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/) installed. Otherwise, the [tutorial](#tutorial) section below can be done all in your browser.

## Tutorial
This section shows how to setup a basic CI/CD pipeline with this project and CircleCI. The goals are:
- Automatically run tests against changes to the repository
- Automatically build and push a new Docker image if/when tests pass

Note that this tutorial shows how to do everything inline on Github, but you can clone the repository and edit / push files from your local environment if that's preferable.

1. After you've cloned the repository, go ahead and create a new file `.circleci/config.yml`. Configuration for CircleCI lives in a file called `config.yml` inside a `.circleci` folder.
1. We'll start off by defining our workflow. You could technically just define jobs, but they'll always automatically run concurrently unless you define a workflow for them. Workflows could consist of only one job, so it's easier to just start off defining a workflow which can then be expanded later.
    ```
    #######################
    # Workflow Definitions
    #######################
    workflows:
      version: 2
      build-deploy:
        jobs:
          - test
    ```
    - In the snippet above, I've defined a workflow called "build-deploy" (you can name it whatever you want as long as it follows YAML conventions).
    - `version: 2` is always needed, as that's the current workflows version in CircleCI.
    - `jobs:` defines which jobs we want to run in our workflow. In this case, we're only declaring a single job called "test" (again, pick any name you'd like).

## Local Machine
### Setup & Run
1. Revisit the [prerequisites](#prerequisites) section above to ensure you have the required software installed.
1. Clone the repository and run `yarn` to install dependencies.
1. `yarn start` to start a simple web server for the static assets.

### Test
The test suite uses [TestCafe](https://devexpress.github.io/testcafe/). It also assumes Chrome and Firefox browsers available on the system.

1. `yarn test` to start the tests. They're very elementary content checks.


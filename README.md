# CI/CD 101 Workshop Repository 
Simple Node.js project and static website to demonstrate basic CI/CD w/ CircleCI. The presentation is not needed to use this repository, but you can [view those slides here](https://docs.google.com/presentation/d/1VQbs8DrNX0rqTHNwFmVzve49LNNiu1MuXs0Hu8Ppbk8).

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
- Setup nightly builds on the `development` branch

Note that this tutorial shows how to do everything inline on Github, but you can clone the repository and edit / push files from your local environment if that's preferable. Instructions on [how to write files/folders inline on Github here](https://stackoverflow.com/questions/18773598/creating-folders-inside-github-com-repo-without-using-git).

1. After you've forked the repository, go ahead and create a new file `.circleci/config.yml`. Configuration for CircleCI lives in a file called `config.yml` inside a `.circleci` folder at the top level of your repo.
1. We'll start off by defining our workflow. You could technically just define jobs, but workflows are more powerful and configurable. You could easily have a workflow that only consists of a single job as well, so there are few reasons not to define a workflow.
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
    - `version: 2` is always needed, as that's the current workflows version in CircleCI.
    - I've defined a workflow called "build-deploy" (you can name it anything as long as it follows YAML conventions).
    - `jobs:` defines which jobs we want to run in our workflow. In this case, we're only declaring a single job called "test" (again, pick any name you'd like).
1. Once you've defined the workflow, we'll now need to define the actual job. For now, let's start with something simple:
    ```
    ... // Workflow Definitions above
    #######################
    # Job Definitions
    #######################
    version: 2.1
    jobs:
      test:
        docker:
        - image: circleci/node:10.15.1-browsers
        working_directory: ~/ci-cd-101-workshop

        steps:
        - checkout
        - run: echo "Hello World!"
    ```        
    - `version: 2.1` dictates the version of configuration, and 2.1 is the current default.
    - We're defining a job called "test", and the first thing we'll define is [the executor](https://circleci.com/docs/2.0/executor-types/), which is the environment you do work in. We have options for Docker, Linux VM, Mac VM, and Windows VM, and we'll choose Docker for now.
    - we're using a convenience image containing Node.js and browsers for testing. See the list of [convenience images here](https://circleci.com/docs/2.0/circleci-images). You could, however, [define your own custom images](https://circleci.com/docs/2.0/custom-images/).
    - By default, CircleCI will use `~/project` if you don't specify a `working_directory`. We recommend defining it so you explicitly know and set where your source code lives inside the environment.
    - The `steps` section defines what actions you actually do in the job. `checkout` checks out your repository, and a `run:` step is any Bash command you want to run.
1. By now, your config file should look like this:
    ```
    #######################
    # Workflow Definitions
    #######################
    workflows:
      version: 2
      build-deploy:
        jobs:
        - test
	
    #######################
    # Job Definitions
    #######################
    version: 2.1
    jobs:
      test:
        docker:
        - image: circleci/node:10.15.1-browsers
        working_directory: ~/ci-cd-101-workshop

        steps:
        - checkout
        - run: echo "Hello World!"
    ```
1. Check `.circleci/config.yml` into your repository and then head over to [CircleCI](https://circleci.com).
    - Log into CircleCI using your Github credentials. You'll be shown a dashboard, which will be empty if this is your first time logging in.
1. Go to the left-hand side and click on "Add Projects". Find the project you've forked, click "Set Up Project", and then scroll down and "Start building". This will kick off your first build with the config file you've written and committed to master.


## Local Machine
### Setup & Run
1. Revisit the [prerequisites](#prerequisites) section above to ensure you have the required software installed.
1. Clone the repository and run `yarn` to install dependencies.
1. `yarn start` to start a simple web server for the static assets.

### Test
The test suite uses [TestCafe](https://devexpress.github.io/testcafe/). It also assumes Chrome and Firefox browsers available on the system.

1. `yarn test` to start the tests. They're very elementary content checks.


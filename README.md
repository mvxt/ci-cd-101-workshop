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
- Automatically build and push a new Docker image if/when tests pass only on `master` branch
- Setup nightly builds on the `development` branch

Note that this tutorial can be done entirely inline on Github, but you can clone your forked repository and edit / push files from your local environment if that's preferable. Instructions on [how to write files/folders inline on Github here](https://stackoverflow.com/questions/18773598/creating-folders-inside-github-com-repo-without-using-git).

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
    - We're using a convenience image containing Node.js and browsers for testing. See the list of [convenience images here](https://circleci.com/docs/2.0/circleci-images). You could also [define your own custom images](https://circleci.com/docs/2.0/custom-images/).
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

1. If there were no hiccups or problems, then in your CircleCI Dashboard, you should see a green, passing build! But of course, this job is useless; it doesn't do anything meaningful. Let's change that.

1. Inside your config, let's change the steps in your job.
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
          - run:
              name: Install dependencies
              command: yarn
          - run:
              name: Run tests
              command: yarn test
    ```
    - The run step has been modified to have the "name" and "command" subkeys. This helps make things more readable in both the config and the job details page.
    - We're now installing dependencies and running the test suite. Commit these changes and see the difference on the jobs page!

1. Great! Let's add a Docker build now. In this repository there's a Dockerfile which is essentially just extending nginx. It will just be a simple container that will serve our static assets.

1. But wait a second - each job runs in a new, clean environment. Should I just clone the repository again? Well, you _could_, but here, we'll introduce the concept of [workspaces](https://circleci.com/docs/2.0/workflows/#using-workspaces-to-share-data-among-jobs). A workspace is a datastore that can transfer files and artifacts between jobs. 
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
          - run:
              name: Install dependencies
              command: yarn
          - run:
              name: Run tests
              command: yarn test
          - persist_to_workspace:
              root: .
              paths:
                - Dockerfile
                - etc
                - css
                - img
                - index.html
                - js
                - mail
                - scss
    ```
    - In the changes above, we add a `persist_to_workspace` declaration with the root as the current working directory.
    - In `paths`, we explicitly define which paths or files we want to add to the workspace. This is recommended over doing a blanket add of `.`, which will persist everything in the current folder - an inefficient use of workspaces.
    - Of particular importance, we will want to include all the directories containing website assets as well as the `Dockerfile` and `etc` folder. These are needed for the nginx container.

1. Now, let's make use of those transferred files in the new job where we build the Docker image.
    ```
    ... // rest of config file above
    jobs:
      test:
        ... // test job definition here

      build-push:
        docker:
          - image: circleci/node:10.15.1-browsers
        working_directory: ~/ci-cd-101-workshop

        steps:
          - attach_workspace:
              at: .
          - setup_remote_docker
          - run:
              name: Build and tag the Docker image
              command: docker build -t $DOCKER_TAG -t ${DOCKER_TAG}:${CIRCLE_SHA1} .
          - run:
              name: Login to Dockerhub and push
              command: |
                echo $DOCKER_PWD | docker login -u $DOCKER_LOGIN --password-stdin
                docker push $DOCKER_TAG
                docker push ${DOCKER_TAG}:${CIRCLE_SHA1}
    ```
    - The first thing we do in the `build-push` job is actually just attach the workspace we created in the previous job.
    - We run `setup_remote_docker`, which [sets up an isolated, secure environment](https://circleci.com/docs/2.0/building-docker-images) where we can run our Docker commands for building images. From here on out, all `docker` commands will run in that environment.
    - We then first build the image and tag it. You see two tags there, because we want to not only build the `latest` tag, but also tag the specific SHA for this commit for record-keeping.
    - Instead of hard-coding a name, I'm making use of environmental variables called `$DOCKER_TAG` and `$CIRCLE_SHA1`. The first you will define in the next step, but `CIRCLE_SHA1` is built into the platform. You can [see a list of those here](https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables).
    - The final run step is actually logging into Docker and pushing both of the tags, using the same variables as before along with two new ones for your login information.

1. You'll want to go into your Project Settings > Environment Variables > Add Variable. You'll need to add 3 variables:
    - `DOCKER_TAG`: This is the name of your Dockerhub repository. For example, mine is `mikeyvxt/ci-cd-101-workshop`.
    - `DOCKER_LOGIN`: This will be your Dockerhub username.
    - `DOCKER_PWD`: This will be your Dockerhub password.

1. The ENV variables are kept safe by staying encrypted in the user interface and only injecting into your environment once the builds run. Now, you'll want to modify your workflows to also run this new job. Additionally, we want to ensure that the `build-push` job doesn't run unless tests pass - if tests don't pass, why would we want to push a Docker image with a broken site?
    ```
    #######################
    # Workflow Definitions
    #######################
    workflows:
      version: 2
      build-deploy:
        jobs:
          - test
          - build-push:
              requires:
                - test
              filters:
                branches:
                  only: master

    ... // Job Definitions below
    ```
    - We added `build-push` to the list of jobs we want to run in our `build-deploy` pipeline.
    - We also define a `requires` parameter below it, indicating that `build-push` must only run if `test` passes.
    - Finally we define a filter. We don't want to build and push a new image on _every_ commit (default), just for changes on the `master` branch. So we define that here.

1. By now, your config file should look like below. Push your new config file and watch the magic happen!
    ```
    #######################
    # Workflow Definitions
    #######################
    workflows:
      version: 2
      build-deploy:
        jobs:
          - test
          - build-push:
              requires:
                - test
              filters:
                branches:
                  only: master

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
          - run:
              name: Install dependencies
              command: yarn
          - run:
              name: Run tests
              command: yarn test
          - persist_to_workspace:
              root: .
              paths:
                - Dockerfile
                - etc
                - css
                - img
                - index.html
                - js
                - mail
                - scss

      build-push:
        docker:
          - image: circleci/node:10.15.1-browsers
        working_directory: ~/ci-cd-101-workshop

        steps:
          - attach_workspace:
              at: .
          - setup_remote_docker
          - run:
              name: Build and tag the Docker image
              command: docker build -t $DOCKER_TAG -t ${DOCKER_TAG}:${CIRCLE_SHA1} .
          - run:
              name: Login to Dockerhub and push
              command: |
                echo $DOCKER_PWD | docker login -u $DOCKER_LOGIN --password-stdin
                docker push $DOCKER_TAG
                docker push ${DOCKER_TAG}:${CIRCLE_SHA1}
    ```
1. Almost done! One last piece of functionality is that we want to run nightly builds on our `develop` branch. This is (usually) the branch that changes on a daily basis in many companies, while the `master` branch tends to only change upon releases of major changes. Add the following to your config in the `workflows` section:
    ```
    #######################
    # Workflow Definitions
    #######################
    workflows:
      version: 2
      build-deploy:
        jobs:
          - test
          - build-push:
              requires:
                - test
              filters:
                branches:
                  only: master

      nightly:
        jobs:
          - test
        triggers:
          - schedule:
              cron: 0 0 * * *
              filters:
                branches:
                  only: develop

    ... // Job definitions below
    ```
    - We've added a new workflow called "nightly". It only runs the `test` job, and it runs it based on a CRON tab, filtered to only run on the `develop` branch.
1. Commit & push these changes, and you're all set! We've accomplished the goals set forth at the beginning of this tutorial. Where can you go from here?
    - There are various ways you could [optimize](https://circleci.com/docs/2.0/optimizations/) your builds and your configuration.
    - Try onboarding your own, personal projects to CircleCI! See the various [example projects](https://circleci.com/docs/2.0/example-configs/#section=configuration), [config cookbooks](https://circleci.com/docs/2.0/configuration-cookbook/#section=configuration), and [sample use cases](https://circleci.com/docs/2.0/tutorials/#section=configuration) we have in our docs.
    - Consult the [complete config reference](https://circleci.com/docs/2.0/configuration-reference/#section=configuration) for all of the available configuration our platform offers.
    - Considering CircleCI for your team? [Reach out to us](https://circleci.com/contact/), and we'll discuss if CircleCI is the right fit for your team!

Thanks for taking the time to attend the workshop and/or browse this tutorial. Questions, comments, and bug reports welcome in the Issues tab.

## Local Machine
### Setup & Run
1. Revisit the [prerequisites](#prerequisites) section above to ensure you have the required software installed.
1. Clone the repository and run `yarn` to install dependencies.
1. `yarn start` to start a simple web server for the static assets.

### Test
The test suite uses [TestCafe](https://devexpress.github.io/testcafe/). It also assumes Chrome and Firefox browsers available on the system.

1. `yarn test` to start the tests. They're very elementary content checks.


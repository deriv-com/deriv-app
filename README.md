Deriv App
============
This repository contains the various platforms of Deriv.

- [Installation](#installation)
- [Working With This Repo](#working-with-this-repo)
- [Usage](#usage)
  - [How to Clean Packages](#how-to-clean-packages)
  - [Examples](#examples)
- [PR Guidelines](#pr-guidelines)
- [FAQ](#faq)

[comment]: <> (TODO: Refactor Clean Project to be under usage)

## Installation
In order to work on your own version of the Deriv Javascript and CSS, please **fork this project**.

You will need to perform the following on your development machine:

1. Node.js (10.14.2 or higher is recommended) and NPM (see <https://nodejs.org/en/download/package-manager/>)
2. Run `npm run bootstrap` from the root folder

[comment]: <> (3. If you wish to install and work with only a single, or multiple but specific packages, then follow `3i` for each package. However, if you wish to install and work with all packages, follow `3ii`.)
[comment]: <> (i. Run `npm run bootstrap {package name}`. Replace `{package name}` with the name of the package you want to work with. eg.: `trader`, `bot`)
[comment]: <> (ii. Install all packages with a hoisting strategy \(lift all common packages to a root `node_modules` and not package specific\), run `npm run hoist`)

## Working With This Repo
All packages must contain the following scripts to perform the stated actions:

| Command             | Description                                                                                   |
| ------------------- |:---------------------------------------------------------------------------------------------:|
| `start`             | Runs complete test and build suite and starts the dev server.                                 |
| `serve`             | Runs build suite and starts the dev server.                                                   |
| `build`             | Runs build suite and outputs the result into `dist`. Takes optional `base` value as argument. |
| `test`              | Runs the test suite with eslint, and stylelint.                                               |
| `test:eslint`       | Runs only eslint.                                                                             |
| `test:stylelint`    | Runs only stylelint.                                                                          |
| `test:mocha`        | Runs only the test suite.                                                                     |
| `deploy`            | Runs `build` script, then pushes the output to GH Pages.                                      |
| `deploy:clean`      | Runs `build` script, clears `gh-pages` branch, then pushes the output to GH Pages.            |
| `deploy:folder`     | Runs `build` script, then pushes the output to the specified folder in GH Pages.              |
| `deploy:staging`    | Initiates procedures for deploying to staging. (Package specific)                             |
| `deploy:production` | Initiates procedures for deploying to production. (Package specific)                          |

**Please follow the README of each package you intend to work with on how to get set up.** However, the above scripts can be run from the root directory in the following manner.

### Usage
#### How to Clean Packages
If you intend to remove `node_modules` folder(s) from the projects, please run `lerna clean` and follow the instructions.

You can read more on the various lerna commands (and the `clean` command) over at the [Lerna docs](https://github.com/lerna/lerna/).

#### Examples
In order to run the `start` script for all packages (`trader`, `bot`, etc.), simply `cd` to the root of the repo and run:
```bash
npm run start
```

If you intend to run the script for a specific package, simply run:

```bash
npm run start trader
```

Likewise, to run any of the `deploy` scripts such as `deploy:folder` or `deploy:staging` for a specific package, just run:
```bash
npm run deploy:folder trader br_test_folder
```

You can find the names of packages by first navigating to the `packages` folder. Each subfolder is a package, and contains a `package.json` file. The value of the `name` key in `package.json` is the package name.

### PR Guidelines
1. Use the `developer 1|developer 2/task_name` format for PR titles. (e.g.: `dev1/fixed_emoji_issue`)
2. Use the appropriate package labels available on the repo to indicate which packages your PR modifies.
3. Use Draft PRs if you don't mean to request for reviews yet. [Read more here.](https://github.blog/2019-02-14-introducing-draft-pull-requests/)

### FAQ
1. If you have to use `sudo -s` in your environment, please remove any hardcoded `sudo` from `packages/*` (eg., remove `sudo` from `start` and `serve` commands of `packages/trader`)

2. How do I install a package?

    A. Run `lerna add` with the `--scope` argument as the package you want to install to. (e.g.,  `lerna add npm-package-name --scope=trader`)

3. How do I run `npm ci` or equivalent (to add dependencies based on `package-lock.json`?

    A. You have two options:

    1. use `lerna exec` with the `--scope` argument as the package you want to run the command on, as such `lerna exec --scope=trader -- npm ci`.
    2. `cd` into `packages/PACKAGE-NAME` and run `npm ci`, as such `cd packages/trader && npm ci`

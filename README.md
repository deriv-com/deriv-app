Deriv App
=============

This repository contains the various platforms of Deriv.

## Installation

In order to work on your own version of the Deriv Javascript and CSS, please **fork this project**.

You will need to perform the following on your development machine:

1. Node.js (10.14.2 or higher is recommended) and NPM (see <https://nodejs.org/en/download/package-manager/>)
2. Run `npm ci`
3. If you wish to install and work with only a single, or multiple but specific packages, then follow `3i` for each package. However, if you wish to install and work with all packages, follow `3ii`.

    1. Run `npm run bootstrap {package name}`. Replace `{package name}` with the name of the package you want to work with. eg.: `trader`, `bot`

    2. Install all packages with a hoisting strategy (lift all common packages to a root `node_modules` and not package specific), run `npm run hoist`

How to work with this repo
=============================

All packages must contain the following scripts to perform the stated actions:

| Command             | Description                                                                                   |
| ------------------- |:---------------------------------------------------------------------------------------------:|
| `start`             | Runs complete test and build suite and starts the dev server.                                 |
| `serve`             | Runs build suite and starts the dev server.                                                   |
| `build`             | Runs build suite and outputs the result into `dist`. Takes optional `base` value as argument. |
| `test`              | Runs the test suite.                                                                          |
| `deploy`            | Runs `build` script, then pushes the output to GH Pages.                                      |
| `deploy:clean`      | Runs `build` script, clears `gh-pages` branch, then pushes the output to GH Pages.            |
| `deploy:folder`     | Runs `build` script, then pushes the output to the specified folder in GH Pages.              |
| `deploy:staging`    | Initiates procedures for deploying to staging. (Package specific)                             |
| `deploy:production` | Initiates procedures for deploying to production. (Package specific)                          |

**Please follow the README of each package you intend to work with on how to get set up.** However, the above scripts can be run from the root directory in the following manner.
## Usage
### Example
In order to run the `start` script for all packages (`trader`, `bot`, etc.), simply `cd` to the root of the repo and run:
```bash
npm run start
```

If you intend to run the script for a specific package, simply run:

```bash
npm run start trader
```

You can find the names of packages by first navigating to the `packages` folder. Each subfolder is a package, and contains a `package.json` file. The value of the `name` key in `package.json` is the package name.

### Clean projects

If you intend to remove `node_modules` folder(s) from the projects, please run `lerna clean` and follow the intstructions.

You can read more on the various lerna commands (and the `clean` command) over at the [Lerna docs](https://github.com/lerna/lerna/).

### FAQ

1. If you have to use `sudo -s` in your environment, please remove any hardcoded `sudo` from `packages/*` (eg., remove `sudo` from `start` and `serve` commands of `packages/trader`)

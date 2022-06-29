# `@deriv/cashier`

## Description

This repository is a workspace of [deriv-app](../../README.md) monorepo and covers the [cashier](https://app.deriv.com/cashier/) page in app.deriv.com. (You need to be logged in to see the page.)
This project covers:

-   Deposit, Withdraw and Transfer (for both `Fiat` and `Crypto`)
-   Deposit and withdraw for `payment agent`
-   Deposit for `p2p` and `onRamp`

## How to Install the Project

Follow the instructions [here](../../README.md).

## How to Work with the Project

To run and work on this workspace you need to use `npm run serve cashier` command along with `npm run serve core`.
Webpack will watch changes in `cashier` so that if you made any changes in this package, it will automatically rebuild `cashier` and recompile `core`.
You can use it like this in your code:

```
const cashier = require('@deriv/cashier');

```

## Folder Structure

```
build
    ├── ...
    ├── webpack-config.js
src
    ├── _common
    ├── components
    ├── config
    ├── constants
    |   |──routes-config.js
    ├── containers
    ├── pages
    ├── public
    ├── stores
    ├── utils
    │   ├── Validator
    |   |   ├──...
    |   |   ├── validator.js

```

**components:** This folder contains all the reusable components that we need for developing this workspace.
We have a separate folder for each component.

**constants:** We add the static data structures needed for the workspace here.
We have a separate folder for each component.

**containers:** This folder contains the wrappers we use for the whole project.

**pages:** This is the place for putting all the features which are visible through the browser. We have separate folder for each feature.
The features developed in this folder also has been exported through the webpack for the use of other packages (like appstore).

**public:** All shared files (like .svg files) will be placed here.

**store:** We use Mobx as state management tool in Cashier, and this is the place for putting the relevant store files. Also, for each store file we have a test file in **tests** folder.

**utils:** We place all the common and helper methods which are required for the project in this folder.

## Troubleshooting

-   **Icon missing:** If the icons are missing, you only need to build this project. You can do this by running the build command:

```
npm run build
```

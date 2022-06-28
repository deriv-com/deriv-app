# `@deriv/cashier`

## Description

This repository is a workspace of [deriv-app](../../README.md) monorepo and covers the [cashier](https://app.deriv.com/cashier/) page in app.deriv.com. (You need to be logged in to see the page.)

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
    │   ├── ...
    |   ├── utility.js
    │
    ├── components
    ├── config
    ├── constants
    |   |──routes-config.js
    ├── containers
    ├── pages
    ├── ...
    ├── stores
    ├── ...
    ├── utils
    │   ├── Validator
    |   |   ├──...
    |   |   ├── validator.js


```

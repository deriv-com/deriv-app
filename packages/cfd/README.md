# CFD (contract for difference)

This repository is a workspace of [deriv-app](../../README.md) monorepo and contains the static HTML, Javascript, CSS, and images content of the [Deriv](http://app.deriv.com) website.
This workspace covers the [DMT5](https://app.deriv.com/mt5) and [Deriv X](https://app.deriv.com/derivx) platforms.

## How to Install the Project

You need to follow the instructions [here](../../README.md).

## How To Work With This Project

To run and work on this workspace you need to use `npm run serve cfd` command along with `npm run serve core`.
Webpack will watch changes in `cfd` so that if you made any changes in this package, it will automatically rebuild `cfd` and recompile `core`.

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
    ├── Components
    ├── Constants
    ├── Containers
    ├── Helpers
    ├── Modules
    |   |──Page404
    ├── ...
    ├── Store
    ├── ...
    ├── Utils
    │   ├── Validator
    |   |   ├──...
    |   |   ├── validator.js


```

## Troubleshooting

-   **Icon missing:** If the icons are missing, you only need to build this project. You can do this by running the build command:

```console
npm run build

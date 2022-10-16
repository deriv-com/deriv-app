# CFD (contract for difference)

This repository is a workspace of [deriv-app](../../README.md) monorepo and contains the static HTML, Javascript, CSS, and images content of the [Deriv](http://app.deriv.com) website.
This workspace covers [DMT5](https://app.deriv.com/mt5) and [Deriv X](https://app.deriv.com/derivx) platforms.

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

**Components:** This folder contains all the reusable components we need for developing the project.

**Constants:** We add the static data structures needed for the project here.
We have a separate folder for each component.

**Containers:** This folder contains the wrappers we use for the whole project.

**Modules:** This folder contains the 404 page component.

**Stores:** We use Mobx as state management tool in cfd, and this is the place for putting the relevant store files. Also, for each store file we have a test file in **tests** folder.

**templates:** includes two different styles of loading component which are used in the whole workspace

**Helpers and Utils:** We place all the common and helper methods which are required for the project in this folder.

## Troubleshooting

-   **Icon missing:** If the icons are missing, you only need to build this project. You can do this by running the build command from the root directory (`/deriv-app`):

```console
npm run build
```

# `@deriv/core`

`core/dist` is the place where we build the main bundle at

**In this document**

-   [Other documents](#other-documents)
-   [Description](#description)
-   [How to work with this workspace](#how-to-work-with-this-workspace)
    -   [Adding domain to your machine hosts config](#adding-domain-to-your-machine-hosts-config)
    -   [Run this workspace](#run-this-workspace)
    -   [Deploy to your gh-pages for the first time](#deploy-to-your-gh-pages-for-the-first-time)
    -   [Deploy to the root of gh-pages](#deploy-to-the-root-of-gh-pages)
    -   [Clean root and deploy to it](#clean-root-and-deploy-to-it)
    -   [Deploy to test folder](#deploy-to-test-folder)
-   [Folder Structure](#folder-structure)
-   [Troubleshooting](#troubleshooting)
-   [Miscellaneous](#miscellaneous)

## Other documents

-   [Modules docs](docs/Modules/README.md) - Contains implementation guides (i.e., scaffolding help, etc.)

## Description

This workspace is the "app instance". It contains singleton services (such as the WS, and base/common stores), as well as singleton UI components.

## How to work with this workspace

-   To preview your changes locally for the first time, run `npm start`:
    -   It will run all tests, compile all CSS, and JS/JSX as well as watch for further `js/jsx/css` changes and rebuild on every change you make.
-   To preview your changes locally without any tests, run `npm run serve`
    -   It will watch for js/jsx/css changes and rebuild on every change you make.
-   To run all tests, run `npm run test`

### Run this workspace

To run and work on this workspace you need to use `npm run serve core` command.

### Deploy to your gh-pages for the first time

1.  Register your application [here](https://developers.binary.com/applications/). This will give you the ability to redirect back to your Github pages after login. Use `https://YOUR_GITHUB_USERNAME.github.io/deriv-app/` for the Redirect URL and `https://YOUR_GITHUB_USERNAME.github.io/deriv-app/en/redirect` for the Verification URL. If you're using a custom domain, replace the Github URLs above with your domain and remove the `deriv-app` base path.

2.  In `src/config.js`: Insert the `Application ID` of your registered application in `user_app_id`.

    -   **NOTE:** To avoid accidentally committing personal changes to this file, use `git update-index --assume-unchanged src/javascript/config.js`

3.  Set `NODE_ENV` to `development` with `export NODE_ENV=development`

4.  Run `npm run deploy:clean`

### Deploy to the root of gh-pages

This will overwrite modified files and only clear the content of `js` folder before pushing changes. It will leave other folders as they are.

```
npm run deploy
```

### Clean root and deploy to it

This removes all files and folders and deploys your `dist` folder to the root.

```sh
npm run deploy:clean
```

### Deploy to test folder

This will add all your changes to the test folder specified.
Please ensure it is prefixed with `br_`.

```
npm run deploy:folder "br_my_test_folder"
```

## Folder Structure

```
build
    ├── ...
    ├── webpack-config-test.js
docs
    ├── Modules
    |   |── README.md
src
    ├── _common
    ├── App
    |   |── Components
    |   |── Constants
    |   |── Containers
    ├── Assets
    ├── Constants
    ├── Modules
    ├── public
    ├── root_files
    ├── sass
    ├── Services
    ├── Stores
    ├── templates
    ├── Utils
    |   |── Language
    |   |── pwa
    |   |── Validator
    |   |   |──...
    |   |   |── validator.js
```

## Troubleshooting

-   **Icon missing:** If the icons are missing, you only need to build this workspace. You can do this by running the build command from the root directory (`/deriv-app`):

```
npm run build
```

## Miscellaneous

-   In Webstorm, right-click on `src`, hover over `Mark directory as`, and click `Resource root` to enable import alias resolution.

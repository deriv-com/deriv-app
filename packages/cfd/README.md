# Deriv App

This repository is a workspace of [deriv-app](../../README.md) monorepo and contains the static HTML, Javascript, CSS, and images content of the [Deriv](http://app.deriv.com) website.
[DMT5](https://app.deriv.com/mt5) and [Deriv X](https://app.deriv.com/derivx) are parts of this workspace.

## How To Work With This Project

To run and work with this workspace you need to run `npm run serve cfd` command along with `npm run serve core`.
It will watch `cfd` so after you made some changes in your code it will automatically rebuild `cfd` and recompile `core`.

## Troubleshooting

-   **Icon missing:** If the icons are missing, you only need to build this project. Built files can be found in `./build` folder.

## Typescipt declerations

All typescript declarations can be found in `./globals.d.ts`.

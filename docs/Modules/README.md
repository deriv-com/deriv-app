# Creating new packages

In order to create and add a new package to this project/repo, please follow the guideline below:

1. Make sure your new package name is prefixed with `@deriv/`.
2. Make sure the Webpack config has `IS_RELEASE` flag, as well as conditional source-maps based on "if IS_RELEASE".
3. To link the new package with the previous packages that we already have, you need to run `npm run bootstrap:dev` to link it with the others.
4. Make sure your webpack configs are working as expected.
5. You need to install the newly created package inside core package or other packages that need access to its store, components, etc.

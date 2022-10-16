# Generate and push Deriv API TypeScript types

This action takes Deriv API's JSON schema (published at https://github.com/binary-com/websockets/tree/gh-pages/config/v3) and converts it into consumable TypeScript types.

If the action detects the contents of the generated `index.d.ts` file has changed, it will attempt to publish a new version of `@deriv/api-types` to the NPM registry (https://www.npmjs.com/package/@deriv/api-types).

After a new version has been published the action will automatically create a PR to the `master` branch of the Deriv.app repo which should then be manually merged by the FE team.

**Please note**: The action is dumb, e.g. when something goes wrong between publishing and creating a PR, the action will not recover from this and a manual PR will have to be created.

Required GitHub secrets:

-   `NPM_ACCESS_TOKEN`: To allow for automatic publishing of new version of `@deriv/api-types`

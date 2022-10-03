# Push and pull Crowdin translations

This action will automatically extract strings from the Deriv.app repo and upload them to Crowdin. It will also check whether Crowdin has new translations available, and if so, it will automatically download these translations and create a PR to Deriv.app's `master` branch to merge them in.

Required GitHub secrets:

-   `NPM_ACCESS_TOKEN`: To allow for automatic publishing of new version of `@deriv/api-types`
-   `CROWDIN_API_TOKEN`: To allow us to download and upload new language files to and from Crowdin.

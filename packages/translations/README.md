# `Deriv-translations`
>
* Extract new string translations to crowdin
* Staging / dev branch is the source of truth for strings that should be translated.
* React i18next configuration and translation components
>


## Extracting translations
### Setup: add the crowdin API key to your ~/.bash_profile
```sh
   $ echo "export DERIV_CROWDIN_API_KEY='apikeyhere'" >> ~/.bash_profile
   $ source ~/.bash_profile
```
### To update strings to be translated in crowdin
```sh
   $ npm run update translations
```

## Project translations
* This project uses [react-i18next](https://react.i18next.com)

### Setup
* initialize translations in root app.jsx by importing i18n.js
* in `app.jsx`
```jsx
    import 'deriv-translations/src/components/localize';
```
### Usage
* For strings use either `localize(...)` or `<Localize />`
* [`<Localize />`](https://react.i18next.com/latest/trans-component) example:
```jsx
    import Localize from 'deriv-translations/src/';

    <Localize i18n_default_text='You cannot use your real money account with {{website_name}} at this time.' values={{ website_name }} />
```
* localize example:
```jsx
    import { localize } from 'deriv-translations/src/i18next/i18n';

    <h4 className='drawer__notifications-header'>{localize('all notifications')}</h4>
```



>
## FAQ:
* Includes all Crowdin configuration
* Crowdin source translation file --> crowdin/messages.json
* Source for the translated strings in the project --> src/translations/fr|en|id....json
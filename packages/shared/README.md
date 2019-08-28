# `deriv-shared`
> Responsible for the shared utilities and styles for all packages.

##Commands:
setup :
  ```sh 
  lerna bootstrap
  ```
serve : 
  ```sh 
  npm run serve
  ```
build : 
  ```sh 
  npm run build
  ```
test  :
  ```sh 
  npm run test
  ```

## Usage

### Base styles

#### Fonts, Constants, Mixins, Themes, Devices:
Run `npm i sass-resources-loader --save-dev` and add the following in your webpack css loader

```js {
    loader: 'sass-resources-loader',
    options: {
        resources: require('deriv-shared/utils/index.js'),
    }
}
```

#### Browser css reset:
```scss
@import deriv-shared/src/styles/reset.scss
```

#### Google fonts:
```scss
@import deriv-shared/src/styles/google-fonts.scss
```

### Utility functions
```js
import { toMomemt } 'deriv-shared/utils/date'
```
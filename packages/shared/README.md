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
Run `npm i sass-resources-loader --save-dev` and add the following in your webpack css loader

```js {
    loader: 'sass-resources-loader',
    options: {
        resources: require('deriv-shared/utils/index.js'),
    }
}
```

### Utility functions
```js
import { toMomemt } 'deriv-shared/utils/date'
```
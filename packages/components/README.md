## Index

- [General](docs/README.md) - Contains general philosophy and overview of this package
- [Modules docs](docs/Modules/README.md) - Contains implementation guides (i.e., scaffolding, code usage)

# `component`
> Reusable UI components for Deriv.

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

storybook: 
  ```shell script
  npm run storybook
  ```
storybook:build:
  ```
  npm run storybook:build
  ```
storybook:deploy:
  ```
  npm run storybook:deploy br_storybook
  ```
## Usage
You can import individual components with ES6 named imports.
 ```jsx
import { Button } from '@deriv/components';

const SomeComponent = () => (
    <Button is_disabled primary>
      Hello World
    </Button>
  );
```

> NOTE: While developing new components, be mindful that import the direct .jsx file, instead of referencing `../component/index.js`. This will make sure there won't be a style bleed
>When it is imported from other packages. 
## Components

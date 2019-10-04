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

## Usage
You can import individual components on demand and import style manually:
```jsx
import Button from 'deriv-components/lib/Button';
import 'deriv-components/lib/button.css';
const SomeComponent = () => (
    <Button is_disabled primary>
      Hello World
    </Button>
  );
```
 Or you can use deriv-components-loader to import components from deriv-components without having to manually import the corresponding stylesheet. The deriv-components-loader will automatically import stylesheets.

 ```jsx
import { Button } from 'deriv-components';
const SomeComponent = () => (
    <Button is_disabled primary>
      Hello World
    </Button>
  );
```
## Components

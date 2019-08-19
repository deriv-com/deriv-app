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

## Usage
we can import individual components on demand and import style manually:
```jsx
import Button from 'deriv-components/lib/Button';
import 'deriv-components/lib/button.css';
const SomeComponent = () => (
    <Button is_disabled primary>
      Hello World
    </Button>
  );
```
 or we can use deriv-components-loader to import components from antd without having to manually import the corresponding stylesheet. The antd loader will automatically import stylesheets.

 ```jsx
import { Button } from 'deriv-components';
const SomeComponent = () => (
    <Button is_disabled primary>
      Hello World
    </Button>
  );
```
## Components

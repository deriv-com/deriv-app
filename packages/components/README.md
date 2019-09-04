# `component`
> Reusable UI components for Deriv.

# Commands
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
storybook: 
  ```shell script
    npm run storybook
  ```

# Usage
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
 Or you can use `deriv-components-loader` to import components from deriv-components without having to manually import the corresponding stylesheet. The `deriv-components-loader` will automatically import stylesheets.

 ```jsx
import { Button } from 'deriv-components';
const SomeComponent = () => (
    <Button is_disabled primary>
      Hello World
    </Button>
  );
```
# Components
## Icon
### Basic
You can use `deriv-components-loader` to import individual icons:
```jsx
import { IconDeriv } from 'deriv-components';
```


### API

props         | description | type  | default
------------- |-------------| ----- | -------
className     | Add classnames to parent element | `string` | -
customColors  | Sets custom colors to the icon | `object` | -
theme         | Sets the icon theme. `twoTone` renders two-tone icons. `none` renders the icons without theming. |   `twoTone | outline | none` | `outline` 

By default, the icon's `<path>` are injected with `.color1-fill` or `.color1-stroke` to support theming. You can customize the icon's theme colors by replacing the default theming classnames using the `customColors` props. `customColors` props accepts [element|&attr=classname] key-value pair.

### Example
```jsx
import { IconDeriv } from 'deriv-components';

const customColors = {
  // element: classname
  'circle': 'new-circle-color',
  // or &attr: classname
  '&fill': 'new-path-color',
  // or target specific path by specifiying the fill value
  '&fill="#454545"': 'new-path-color'
};

// renders custom color icons
<IconDeriv customColors={customColors} />
```
```jsx
import { IconDeriv } from 'deriv-components';
// renders two-tone icons
<IconDeriv theme='twoTone' />
```
```jsx
import { IconDeriv } from 'deriv-components';
// renders icons without theming
<IconDeriv theme='none' />
```

### Adding icons to the library

1. Naming convention

Please make sure your SVGs filename are prefixed with `icon-`. When building the icons, the icon component filenames are automatically converted to PascalCase. e.g.: `icon-heaven.svg` -> `IconHeaven.jsx`.

If you want to rename a bunch of SVG files, you can use the `rename.js` script in the scripts folder by running the command below.
```sh
node rename.js path/to/directory 'string-to-search' 'string-to-replace'
```


2. Building the icons

Add `.svg` files to `components/icon/svg` folder, then rebuild all the icons by:
```sh
npm run build:icons
```

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
  ```
storybook: 
  ```sh 
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

props     | description | type  | default
----------|-------------| ----- | -------
className | Add classnames to parent element | `string` | -
colors    | Sets custom colors to the icon | `object {[element]/&[attribute]: classname}` | -
theme     | Sets the icon theme. `twoTone` renders two-tone icons. `none` renders the icons without theming. |   `twoTone | outline | none` | `outline` 

By default, the SVG's `<path>` are injected with `.color1-fill` or `.color1-stroke` to support theming. You can customize the icon's theme colors by replacing the default theming classnames using the `customColors` props. `colors` props accepts [element|&attr=classname] key-value pair.

### Example
```jsx
import { IconDeriv } from 'deriv-components';

const customColors = {
  // [element]: classname
  'circle': 'new-circle-color',
  // or &[attribute name]: classname
  '&fill': 'new-path-color',
  // or you can target specific path by specifiying the fill value
  '&fill="#454545"': 'new-path-color'
};

// renders custom color icons
<IconDeriv colors={customColors} />
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


2. For SVG elements that doesn't need to be themed, you can add `data-theme="none"` manually to the element attribute.
```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <g fill="none" fill-rule="evenodd">
    <rect width="24" height="24" fill="#191C31" fill-rule="nonzero" rx="4"/>
    <path fill="#F93" data-theme="none" d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/> // prevent theming on this element
    <path fill="#191C31" fill-rule="nonzero" d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
  </g>
</svg>
```
3. Building the icons

Add `.svg` files to the `components/icon/svg` folder, then rebuild all the icons by:
  ```sh
  npm run build:icons
  ```
Some icons like country flags and currencies doesn't need to be themed. Add those `.svg` files to the `components/icon/svg-no-theme` folder.
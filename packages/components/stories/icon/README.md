## **Usage**
1. Using icons within the Components package

    ```jsx
    import Icon from '../icon'; // please import the relative path in Components

    const App = () => (
        <Icon icon='IcBrandDtrader' />
    );
    ```

2. Using icons as a UI component library (in Trader or Bot)

    ```jsx
    import { Icon } from '@deriv/components';

    const App = () => (
        <Icon icon='IcBrandDbot' />
    );
    ```


## **Props**

|Name | Type | Default | Description
|--|---|--|--|
| size   | `number | string` | `16` | Sets the width and height of the icon
| height | `number | string` | `16` | Sets the height of the icon
| width  | `number | string` | `16` | Sets the width of the icon
| color  | `'active' |` `'disabled' |` `'secondary' |` `'red' |` `'green' |` `'brand' `| primary fill color: ```var(--text-general)```  <br/> secondary fill color: ```var(--text-less-prominent)``` <br/>tertiary fill color: ```var(--general-section-1)```| Sets the icon color with our current theme colors palette
| custom_color | `string (hex color or CSS variable)` | - | Sets the icon custom color (on the primary fill color only)
| onClick | `function` | - | Adds onClick event handler
| onMouseEnter | `function` | - | Adds onMouseEnter event handler
| onMouseLeave | `function` | - | Adds onMouseLeave event handler


#### Example:

```jsx
import { Icon } from '@deriv/components';

const App = () => (
    <>
        <Icon icon='IcBell' height={32} width={48} /> // icon with different width and height
        <Icon icon='IcBell' size={128} />   // icon with the same width and height
        <Icon icon='IcBell' color='active' />
        <Icon icon='IcBell' custom_color='#dedede' />
    </>
);
```

## **Adding new icon**
1. Add an `.svg` icon file under one of the svg folders (or add a new folder) in `components/icon` folder.
2. Make sure the icon file name is in  `kebab-case` and is prefix with `ic-`. The icon file name will be converted to a `PascalCase` as the icon name.

    - Example:

    ```sh
    ic-hello-world.svg --> IcHelloWord
    ```

    - then you can pass the icon name to render the icon:

    ```jsx
    <Icon icon='IcHelloWorld' />
    ```

3. Run `svgo` with the `--enable=sortAttrs` flag to clean and sort the icon attributes (for readibility).

    ```sh
    svgo src/components/icon/**/**.svg --enable=sortAttrs
    ```

4. Run `npm run build` to rebuild the Icon component.

    - Note: Running `npm run build` command will run the `npm run build:icons`. This command will then rewrite `icons.js` file and `stories/icon/icons.js` files with the newly added icon imports.
    - Tips: Run `npm run storybook` to check whether the newly added icon is added.

5. If you happen to have a bunch of svg files to rename, you can use the `utils/rename.js` script to rename them.

    ```sh
    node rename.js path/to/directory 'string-to-search' 'string-to-replace'
    ```

## **Theming icon**
1. Theming has to be done manually for now. You need add CSS variables to each path that needs to be themed.
2. Rules:
    - replace primary `<path />` fill or stroke color with `var(--fill-color1)`
    - replace secondary `<path />` fill or stroke color with `var(--fill-color2)`
    - replace background `<rect />` or `<circle />` fill color with `var(--fill-color3)`

    Example:

    ```svg
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <g>
            <path fill="var(--fill-color1)" d="..." />
            <path stroke="var(--fill-color2)" d="..." />
            <rect fill="var(--fill-color3)" d="..." />
        </g>
    </svg>
    ```

## **Adding new SVG sprite**
1. Configure webpack to create new SVG sprite:

    ```js
    {
        loader : 'svg-sprite-loader',
        options: {
            extract       : true,
            spriteFilename: svgPath => {
                ...
                if (svgPath.includes('components/icon/new_category')) {
                    return 'new_category.svg'; // Webpack will add new_category.svg to public/images/sprite
                }
                ...
            },
            publicPath: '/icon/sprite/',
        },
    },
    ```

2. Configure Icon component to read from the new SVG sprite:

    ```jsx
    const Icon = ({
        ...
    }) => {
        ...
        let filename = 'common';
        const filenames = /Currency|Tradetype|Mt5|Flag|Underlying|NewCategory/g.exec(icon); // add here
        if (filenames) {
            filename = getKebabCase(filenames[0]);
        }
        ...
    };
    ```

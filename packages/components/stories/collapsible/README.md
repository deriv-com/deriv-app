# Collapsible component

Renders a collapsible component on a list of children.
Can also be used dynamically in situations where there might be no collapsible item. In that case, it will just renders a static box.

#### Supported Gestures:

-   DragUp
-   DragDown
-   SwipeUp
-   SwipeDown

## Usage

```jsx
import { Collapsible } from 'deriv-components';

const DummyComponent = props => (
    <Collapsible>
        <div>Always shown component.</div>
        <div data-collapsible='true'>This will be collapsed</div>
    </Collapsible>
);
```

## Props

| Name                     | Type              | Default  | Description                                                                                                              |
| ------------------------ | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| position `*optional`     | {string} top `    | ` bottom | top                                                                                                                      | Set where to put the arrow button. |
| as `*optional`           | {string} tag name | div      | Use this prop to shape the container. Div is fine in most cases, but you may want to use ol, ul, or dl in certain areas. |
| is_collapsed `*optional` | {boolean}         | false    | Set whether the collapsible should be closed by default.                                                                 |
| title                    | {string}          | false    | Adds title besides the arrow button to the container. Shows only arrow button by default.                                |

## Full example:

```jsx
import { Collapsible } from 'deriv-components';

const TodoList = props => (
    <Collapsible as='ol' position='bottom' is_collapsed>
        <li>Got Apple?</li>
        <li collapsed>Human music</li>
    </Collapsible>
);
```

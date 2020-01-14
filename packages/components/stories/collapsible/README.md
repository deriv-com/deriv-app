# Collapsible component

## Usage
 
```jsx
import { Collapsible } from 'deriv-components';

const DummyComponent = (props) => (
    <Collapsible>
        <div>Always shown component.</div>
        <div collapsible>This will be collapsed</div>
    </Collapsible>
)
```

## Props

| Name                     | Type                   | Default | Description                                                                                                              |
|--------------------------|------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
| position `*optional`     | {string} top `|` bottom  | top     | Set where to put the arrow button.                                                                                       |
| as `*optional`           | {string} tag name      | div     | Use this prop to shape the container. Div is fine in most cases, but you may want to use ol, ul, or dl in certain areas. |
| is_collapsed `*optional` | {boolean}              | false   | Set whether the collapsible should be closed by default.                                                                 |



## Full example:

```jsx
import { Collapsible } from 'deriv-components';

const TodoList = (props) => (
    <Collapsible
        as='ol'
        position='bottom'
        is_collapsed
    >
        <li>Got Apple?</li>
        <li collapsed>Human music</li>
    </Collapsible>
);
```

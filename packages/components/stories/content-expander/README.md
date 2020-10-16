# Content Expander component
Renders a content section that can be expanded and collapsed from toggling.

## Usage
 
```jsx
import { ContentExpander } from 'deriv-components';

const DummyComponent = (props) => (
    <ContentExpander header='Title' is_visible={true}>
        <p>Expanded Content Here...</p>
    </ContentExpander>
)
```

## Props

| Name                     | Type                   | Default | Description                                                                                                              |
|--------------------------|------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
| className `*optional`     | {string} |    | Set a custom className component                                                                                     |
| headerClassName `*optional` | {string} | | Set a custom className for the header title
| is_visible `*optional` | {boolean}              | false   | Set whether the component should be expanded by default.                                                                 |
| header                    | {string}               | false   | Adds title besides the arrow button to the container. Shows only arrow button by default.                                |



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

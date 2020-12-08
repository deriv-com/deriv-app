# ThemedScrollbar component
Wrap an element to have a custom scrollbar for it.

#### Supported events:
- onScroll

## Usage
 
```jsx
import { ThemedScrollbars } from 'deriv-components';

const DummyComponent = (props) => (
    <ThemedScrollbars 
        height={300}
    >
        <div>A long content ...</div>
    </ThemedScrollbars>
)
```

## Props

| Name                           | Type                   | Default            | Description                                                                                                              |
|--------------------------------|------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| height                         | {string}               | 100%               | Scroll Component height                                                                                                  |
| width                          | {string}               | none               | Scroll Component width                                                                                                   |
| autohide                       | {boolean}              | true               | Hide scrollbar if component is not hovered                                                                               |
| is\_bypassed                   | {boolean}              | null               | Set it to 'true' if you want to disable the custom scrollbar component                                                   |
| is\_only\_horizontal           | {boolean}              | null               | Set it to 'true' if you want to disable the vertical scrollbar                                                           |
| is\_only\_horizontal\_overlay  | {boolean}              | null               | It's same as 'is\_only\_horizontal' but using 'overflow-x: overlay' style.                                              |
| has\_horizontal                | {boolean}              | null               | If you want to have vertical and horizontal scrollbars set it to 'true'.                                                  |
| onScroll                       | {function}             | null               | Call back function for scrolling event.                                                                                  |
| refSetter                      | {object} React ref     | null               | Ref object that component uses to handle the hover event.                                                             |


## Full example:

```jsx
import { ThemedScrollbars } from 'deriv-components';

const DummyComponent = (props) => (
    <ThemedScrollbars 
        height={300}
        width={300}
        is_bypassed={props.is_bypassed}
        has_horizontal={true}
        onScroll={props.onScroll}
    >
        <div>A long content ...</div>
    </ThemedScrollbars>
)
```

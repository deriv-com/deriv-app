# Popover component

Used this component to have a popover message on hover an element.

#### Supported events:

-   onBubbleOpen
-   onBubbleClose

## Usage

```jsx
import { Popover } from 'deriv-components';

const DummyComponent = props => (
    <Popover message='Network status: Connecting to server'>
        <div>Hover me</div>
    </Popover>
);
```

## Props

| Name                          | Type                   | Default | Description                                                                                                                                  |
| ----------------------------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| alignment                     | {string}               | null    | Choose where you want to show popover. `left`, `top`, `right` or `bottom`                                                                    |
| classNameBubble               | {string}               | null    | Class name for popover container                                                                                                             |
| classNameTarget               | {string}               | null    | Class name for element which is wrapped by popover component                                                                                 |
| classNameTargetIcon           | {string}               | null    | Class name for the icon                                                                                                                      |
| icon                          | {string}               | null    | Choose which Icon you want to have next to the element that is wrapped with popover component. One of `info`, `question`, `dot` or `counter` |
| counter                       | {number}               | null    | A number that will be shown instead of an icon next to the element that is wrapped with popover component. The `icon` prop must be `counter` |
| disable_message_icon          | {boolean}              | null    | If set it to false and icon is `info` you will have an info icon inside the popover                                                          |
| disable_target_icon           | {boolean}              | null    | If is true there will be no icon next to the element that is wrapped with popover component                                                  |
| has_error                     | {string}               | null    | If is true popover will have error styles                                                                                                    |
| id                            | {string}               | null    | An id for popover container                                                                                                                  |
| is_open                       | {boolean}              | null    | Set it to true to open the popover                                                                                                           |
| margin                        | {number}               | null    | Space between popover and wrapped element                                                                                                    |
| message                       | {node\|object\|string} | null    | The text for popover                                                                                                                         |
| zIndex                        | {number}               | null    | Z-index for popover container                                                                                                                |
| relative_render               | {boolean}              | null    | Set it true if you want to have popover dom next to the wrapped element                                                                      |
| should_disable_pointer_events | {boolean}              | null    | Set it true if you want to disable all events of popover container                                                                           |
| onBubbleOpen                  | {function}             | null    |                                                                                                                                              |
| onBubbleClose                 | {function}             | null    |                                                                                                                                              |

## Full example:

```jsx
import { Popover } from 'deriv-components';

const DummyComponent = props => (
    <Popover
        alignment='left'
        className='my-class'
        classNameBubble='my-popover-class'
        classNameTarget='my-content-class'
        classNameTargetIcon='my-icon-class'
        counter={30}
        disable_message_icon
        disable_target_icon
        has_error
        icon='counter'
        id='my-id'
        is_open={props.is_open}
        margin={15}
        message={<span>Popover text to show</span>}
        zIndex={100}
        relative_render
        should_disable_pointer_events
    >
        <div>Hover me</div>
    </Popover>
);
```

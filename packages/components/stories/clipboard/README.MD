# Clipboard component

Renders clipboard icon with capabilities to copy text to client clipboard

#### Supported Gestures:

-   Click

## Usage

```jsx
import { Clipboard } from 'deriv-components';

const DummyComponent = props => (
    <Clipboard text_copy='Copy me' info_message='Click here to copy' success_message='Text copied!' />
);
```

## Props

| Name                         | Type     | Default                 | Description                                         |
| ---------------------------- | -------- | ----------------------- | --------------------------------------------------- |
| text_copy `*required`        | {string} | null                    | Text to copy                                        |
| info_message `*required`     | {string} | null                    | Message as a hint to copy                           |
| success_message `*required`  | {string} | null                    | Message that will appear after text has been copied |
| className `*optional`        | {string} | dc-clipboard            | Default className to icon element                   |
| popoverClassName `*optional` | {string} | dc-clipboard\_\_popover | Default className to popover element                |

## Full example:

```jsx
import { Clipboard } from 'deriv-components';

const DummyComponent = props => (
    <Clipboard
        text_copy='Copy me'
        info_message='Click here to copy'
        success_message='Text copied!'
        className='my-classname__cb'
        popoverClassName='my-classname__cb--popover'
    />
);
```

# ReadMore component

Renders a `ReadMore` component which is used to collapse and expand long text.

#### Supported Gestures:

-   Click

## Usage

```jsx
import { ReadMore } from 'deriv-components';

const DummyComponent = props => 
    <ReadMore 
        expand_text={'See more'} 
        text={'long text which you want to show by read more' }
        collapse_length= {20}
        className= {'ClassName'}
    />;
```

## Props

| Name            | Type      | Default | Description                                                         |
| ----------------| --------- | ------- | ------------------------------------------------------------------- |
| className       | {string}  | `''`    | custom class name for read more component                           |
| expand_text     | {string}  | `''`    | label for `read more` button                                         |
| text            | {string}  | `''`    | full text for the component                                         |
| collapse_length | {number}  | `null`  | maximum characters to show                                          |

## Full example:

```jsx
import { ReadMore } from 'deriv-components';

const DummyComponent = props => (
    <ReadMore 
        expand_text={'See more'} 
        text={'long text which you want to show by read more' }
        collapse_length= {20}
        className= {'ClassName'}
    />
);
```

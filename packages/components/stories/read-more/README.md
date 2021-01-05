# ReadMore component

Renders a `ReadMore` component which is used to collapse and expand long text.

#### Supported Gestures:

-   Click

## Usage

```jsx
import { ReadMore } from 'deriv-components';

const DummyComponent = props => <ReadMore 
                                    expand_text={'See more'} 
                                    text={'long text which you want to show by read more' }
                                    collapse_length= {20}
                                    className= {'ClassName'}
                                />;
```

## Props

| Name            | Type      | Default | Description                                                         |
| ----------------| --------- | ------- | ------------------------------------------------------------------- |
| expand_text     | {string}  | null    |                                                                     |
| text            | {string}  | null    |                                                                     |
| collapse_length | {number}  | null    |                                                                     |

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

# HintBox Component

Renders a `HintBox` component.


## Usage

```jsx
import HintBox from 'Components/hint-box';

const DummyComponent = props => (
    <HintBox
        icon={'IcAlertInfo'}
        is_info
        message={'This is an info hint message'}
    />
);
```

## Props

| Name       | Type       | Default  | Description                                        |
| ---------- | ---------- | -------- | -------------------------------------------------- |
| icon       | {string}   | null     | Icon name for the hint box                         |
| message    | {string}   | null     | Message of the hint box                            |
| is_info    | {boolean}  | null     | Defints whether the message is an info or not      |
| className  | {string}   | null     | `className` for the main container                 |



# Full example:

```jsx
import React from 'react';
import HintBox from 'Components/hint-box';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <HintBox
                icon={'IcAlertInfo'}
                is_info
                message={'This is an info hint message'}
            />
        </React.Fragment>
    );
}
```

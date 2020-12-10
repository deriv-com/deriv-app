# HintBox Component

A styles message. Two available styles are `info` and `not_info`.


## Usage

```jsx
import HintBox from 'deriv-components';

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
| is_info    | {boolean}  | null     | Defines whether the message is an info or not      |
| className  | {string}   | null     | `className` for the main container                 |



# Full example:

```jsx
import React from 'react';
import HintBox from 'deriv-components';

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

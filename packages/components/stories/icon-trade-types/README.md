# IconTradeTypes Component

Icon for trade types.


## Usage

```jsx
import IconTradeTypes from 'deriv-components';

const DummyComponent = props => (
    <IconTradeTypes type={'asiand'} size={16} />
);
```

## Props


| Name          | Type       | Default  | Description                           |
| ------------- | ---------- | -------- | ------------------------------------- |
| type          | {string}   | null     | Type of the trade                     |
| className     | {string}   | null     | `className` for the main container    |


# Full example:

```jsx
import React from 'react';
import IconTradeTypes from 'deriv-components';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <IconTradeTypes type={'asiand'} size={16} />
        </React.Fragment>
    );
}
```

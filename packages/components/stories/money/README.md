# Money Component

A component to format money and append currency to it.


## Usage

```jsx
import Money from 'deriv-components';

const DummyComponent = props => (
    <Money 
        amount={1423602.2}
        currency={'USD'}
        should_format
        show_currency
    />
);
```

## Props

| Name          | Type               | Default  | Description                                       |
| ------------- | ------------------ | -------- | ------------------------------------------------- |
| amount        | {string \| number} | null     | The amount of money to show                       |
| currency      | {string}           | `'USD'`  | The currency of the money                         |
| has_sign      | {boolean}          | null     | Defines whether to show the sign or not              |
| should_format | {boolean}          | `true`   | Defines whether to format the money string or not    |
| show_currency | {boolean}          | `false`  | Defines whether to show the currency or not          |
| className     | {string}           | null     | `className` for the main container                |


# Full example:

```jsx
import React from 'react';
import Money from 'deriv-components';

const DummyComponent = props => {

    return (
        <React.Fragment>
            <Money 
                amount={1423602.2}
                currency={'USD'}
                should_format
                show_currency
            />
        </React.Fragment>
    )
}
```

# VirtualWalletCard Component

VirtualWalletCard shows real wallet information.

#### Supported Gestures:

-   Click
-   Hover

## Usage

```jsx
import VirtualWalletCard from 'deriv-components';
const DummyComponent = props => (
    <VirtualWalletCard amount={100} currency='USD' is_actions_footer={true} wallet_name='Credit/Debit USD Wallet' />
);
```

## Props

| Name                | Type       | Default | Description                                                               |
| ------------------- | ---------- | ------- | ------------------------------------------------------------------------- |
| amount              | {number}   | null    | Amount shown on the card.                                                 |
| currency            | {string}   | null    | Currency linked to the card.                                              |
| getWalletLabels     | {function} | null    | Constants used in the card.                                               |
| has_footer          | {boolean}  | true    | Defines whether the card has a footer.                                    |
| has_no_funds        | {boolean}  | false   | Defines whether the wallet has no funds.                                  |
| is_actions_footer   | {boolean}  | false   | Defines whether the footer should show hover actions.                     |
| is_topup_footer     | {boolean}  | false   | Defines whether the footer should show top-up button.                     |
| onClickReset        | {function} | null    | Function triggers when user clicks on `Reset` badge in the footer.        |
| onClickTransactions | {function} | null    | Function triggers when user clicks on `Transactions` badge in the footer. |
| wallet_name         | {string}   | null    | Wallet name shown on the card.                                            |
| width               | {string}   | `280`   | Width of the wallet card.                                                 |

# Full example:

```jsx
import React from 'react';
import VirtualWalletCard from 'deriv-components';
const DummyComponent = props => {
    return (
        <VirtualWalletCard
            amount={100}
            currency='USD'
            getWalletLabels={getWalletLabels}
            has_footer={true}
            has_no_funds={false}
            is_actions_footer={true}
            is_topup_footer={false}
            onClickReset={() => {
                console.log('Reset clicked!');
            }}
            onClickTransactions={() => {
                console.log('Transactions clicked!');
            }}
            wallet_name='Virtual USD Wallet'
            width='280'
        />
    );
};
```

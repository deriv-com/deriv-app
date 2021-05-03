# RealWalletCard Component

RealWalletCard shows real wallet information.

#### Supported Gestures:

-   Click
-   Hover

## Usage

```jsx
import RealWalletCard from 'deriv-components';
const DummyComponent = props => (
    <RealWalletCard amount={100} currency='USD' is_actions_footer={true} wallet_name='Credit/Debit USD Wallet' />
);
```

## Props

| Name                       | Type       | Default | Description                                                               |
| -------------------------- | ---------- | ------- | ------------------------------------------------------------------------- |
| amount                     | {number}   | null    | Amount shown on the card.                                                 |
| currency                   | {string}   | null    | Currency linked to the card.                                              |
| getWalletLabels            | {function} | null    | Constants used in the card.                                               |
| has_footer                 | {boolean}  | true    | Defines whether the card has a footer.                                    |
| has_no_funds               | {boolean}  | false   | Defines whether the wallet has no funds.                                  |
| is_actions_footer          | {boolean}  | false   | Defines whether the footer should show hover actions.                     |
| is_deposit_footer          | {boolean}  | false   | Defines whether the footer should show deposit button.                    |
| is_linked                  | {boolean}  | false   | Defines whether the wallet is linked to an app.                           |
| is_selected                | {boolean}  | false   | Defines whether the wallet is selected.                                   |
| is_temporarily_unavailable | {boolean}  | false   | Defines whether the wallet is temporarily unavailable.                    |
| onClickDeposit             | {function} | null    | Function triggers when user clicks on `Deposit` badge in the footer.      |
| onClickSettings            | {function} | null    | Function triggers when user clicks on `Settings` badge in the footer.     |
| onClickTransactions        | {function} | null    | Function triggers when user clicks on `Transactions` badge in the footer. |
| onClickTransfer            | {function} | null    | Function triggers when user clicks on `Transfer` badge in the footer.     |
| onClickWithdrawal          | {function} | null    | Function triggers when user clicks on `Withdrawal` badge in the footer.   |
| wallet_name                | {string}   | null    | Wallet name shown on the card.                                            |
| width                      | {string}   | `280`   | Width of the wallet card.                                                 |

# Full example:

```jsx
import React from 'react';
import RealWalletCard from 'deriv-components';
const DummyComponent = props => {
    return (
        <RealWalletCard
            amount={100}
            currency='USD'
            getWalletLabels={getWalletLabels}
            has_footer={true}
            has_no_funds={false}
            is_actions_footer={true}
            is_deposit_footer={false}
            is_linked={false}
            is_selected={false}
            is_temporarily_unavailable={false}
            onClickDeposit={() => {
                console.log('Deposit clicked!');
            }}
            onClickSettings={() => {
                console.log('Settings clicked!');
            }}
            onClickTransactions={() => {
                console.log('Transactions clicked!');
            }}
            onClickTransfer={() => {
                console.log('Transfer clicked!');
            }}
            onClickWithdrawal={() => {
                console.log('Withdrawal clicked!');
            }}
            wallet_name='Credit/Debit USD Wallet'
            width='280'
        />
    );
};
```

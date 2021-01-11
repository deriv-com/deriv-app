# AppCard Component

Show detailed information of apps in the form of cards. There are 3 variants of `AppCards`:

-   `default`: Default size with all details.
-   `mini`: Mini version of AppCard with reduced size.
-   `micro`: Micro version of AppCard with reduced size and essential details only.

#### Supported Gestures:

-   Hover
-   Click

## Usage

```jsx
import AppCard from 'deriv-components';

const DummyComponent = props => (
    <AppCard
        amount='0.00'
        app_icon='IcBrandDtrader'
        app_name='Deriv Apps'
        broker='Deriv Limited'
        currency='USD'
        is_virtual={true}
        linked_wallet='Virtual USD Wallet'
        login_id='7926972'
        server='Deriv Server'
        show_footer={true}
        show_hover_actions={true}
        variant='default'
    />
);
```

## Props

| Name                | Type       | Default   | Description                                                |
| ------------------- | ---------- | --------- | ---------------------------------------------------------- |
| amount              | {string}   | null      | Amount to be shown on the AppCard.                         |
| app_icon            | {string}   | null      | Icon name for the AppCard.                                 |
| app_name            | {string}   | null      | App name to be shown on the AppCard                        |
| broker              | {string}   | null      | Broker name to be shown on the AppCard                     |
| currency            | {string}   | null      | Currency linked to the AppCard.                            |
| getCardLabels       | {function} | null      | Function returns the labels to show in the card.           |
| is\_swap\_free        | {boolean}  | null      | Defines whether the AppCard is Swap-Free or not.           |
| is_virtual          | {boolean}  | null      | Defines whether the AppCard is virtual or not.             |
| linked_wallet       | {string}   | null      | Linked wallet name to be shown on the AppCard.             |
| login_id            | {string}   | null      | Login ID to be shown on the AppCard                        |
| onAddRealClick      | {function} | null      | Function triggers when user clicks on `Add Real` badge.    |
| onDepositClick      | {function} | null      | Function triggers when user clicks on `Deposit` icon.      |
| onPlayClick         | {function} | null      | Function triggers when user clicks on `Play` icon.         |
| onSettingsClick     | {function} | null      | Function triggers when user clicks on `Settings` icon.     |
| onTransactionsClick | {function} | null      | Function triggers when user clicks on `Transactions` icon. |
| onWithdrawClick     | {function} | null      | Function triggers when user clicks on `Withdraw` icon.     |
| server              | {string}   | null      | Server name to be shown on the AppCard.                    |
| show_footer         | {boolean}  | null      | Define whether the AppCard should render Footer.           |
| show\_hover\_actions  | {boolean}  | null      | Define whether the AppCard should show Actions on hover.   |
| variant             | {string}   | `default` | The variant to use.                                        |

# Full example:

```jsx
import React from 'react';
import AppCard from 'deriv-components';

const DummyComponent = props => {
    return (
        <React.Fragment>
            <AppCard
                amount='0.00'
                app_icon='IcBrandDtrader'
                app_name='Deriv Apps'
                broker='Deriv Limited'
                currency='USD'
                is_swap_free={true}
                is_virtual={true}
                linked_wallet='Virtual USD Wallet'
                login_id='7926972'
                onAddRealClick={() => {
                    console.log('Add real clicked!');
                }}
                onDepositClick={() => {
                    console.log('Deposit clicked!');
                }}
                onPlayClick={() => {
                    console.log('Play clicked!');
                }}
                onSettingsClick={() => {
                    console.log('Settings clicked!');
                }}
                onTransactionsClick={() => {
                    console.log('Transactions clicked!');
                }}
                onWithdrawClick={() => {
                    console.log('Withdraw clicked!');
                }}
                server='Deriv Server'
                show_footer={true}
                show_hover_actions={true}
                variant='default'
            />
        </React.Fragment>
    );
};
```

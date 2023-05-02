import React from 'react';
import { localize } from '@deriv/translations';
import AccountTransfer from '@deriv/cashier/src/pages/account-transfer';

export type TWalletType = 'real' | 'demo' | 'p2p' | 'payment_agent';

export const getCashierOptions = (type: TWalletType) => {
    switch (type) {
        case 'real':
            return [
                //Remove AccountTransfer after QA testing (testing scroll behaviour)
                {
                    icon: 'IcAdd',
                    label: localize('Deposit'),
                    content: (
                        <>
                            <AccountTransfer />
                            <AccountTransfer />
                        </>
                    ),
                },
                { icon: 'IcMinus', label: localize('Withdraw'), content: <p>Withdraw Real</p> },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: <p>Transactions Real</p>,
                },
            ];
        case 'demo':
            return [
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: <p>Transfer Demo</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: <p>Transactions Demo</p>,
                },
                {
                    icon: 'IcAdd',
                    label: localize('Reset balanace'),
                    content: <p>Reset balanace</p>,
                },
            ];
        case 'p2p':
            return [
                {
                    icon: 'IcAdd',
                    label: localize('Buy/Sell'),
                    content: <p>Buy/Sell</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Orders'),
                    content: <p>Orders P2P</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('My ads'),
                    content: <p>My ads P2P</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('My profile'),
                    content: <p>My profile P2P</p>,
                },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: <p>Transfer P2P</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: <p>Transactions P2P</p>,
                },
            ];
        case 'payment_agent':
            return [
                { icon: 'IcAdd', label: localize('Deposit'), content: <p>Deposit PA</p> },
                { icon: 'IcMinus', label: localize('Withdraw'), content: <p>Withdraw PA</p> },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: <p>Transfer PA</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: <p>Transactions PA</p>,
                },
            ];
        default:
            return [];
    }
};

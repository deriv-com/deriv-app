import React from 'react';
import { localize } from '@deriv/translations';
import DemoResetBalance from 'Components/demo-reset-balance';
import TransactionList from 'Components/transaction-list';
import WalletDeposit from 'Components/wallet-deposit';
import WalletTransfer from 'Components/wallet-transfer';
import WalletWithdrawal from '../../wallet-withdrawal';

export type TWalletType = 'real' | 'demo' | 'p2p' | 'payment_agent';

export const getCashierOptions = (type: TWalletType) => {
    switch (type) {
        case 'real':
            return [
                {
                    icon: 'IcAdd',
                    label: localize('Deposit'),
                    content: () => <WalletDeposit />,
                },
                { icon: 'IcMinus', label: localize('Withdraw'), content: () => <WalletWithdrawal /> },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: (props: React.ComponentProps<typeof WalletTransfer>) => <WalletTransfer {...props} />,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <TransactionList />,
                },
            ];
        case 'demo':
            return [
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: (props: React.ComponentProps<typeof WalletTransfer>) => <WalletTransfer {...props} />,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <TransactionList />,
                },
                {
                    icon: 'IcAdd',
                    label: localize('Reset balance'),
                    content: (props: React.ComponentProps<typeof DemoResetBalance>) => <DemoResetBalance {...props} />,
                },
            ];
        case 'p2p':
            return [
                {
                    icon: 'IcAdd',
                    label: localize('Buy/Sell'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Orders'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('My ads'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('My profile'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <p>Transfer Real</p>,
                },
            ];
        case 'payment_agent':
            return [
                { icon: 'IcAdd', label: localize('Deposit'), content: () => <p>Transfer Real</p> },
                { icon: 'IcMinus', label: localize('Withdraw'), content: () => <p>Transfer Real</p> },
                {
                    icon: 'IcAccountTransfer',
                    label: localize('Transfer'),
                    content: () => <p>Transfer Real</p>,
                },
                {
                    icon: 'IcStatement',
                    label: localize('Transactions'),
                    content: () => <p>Transfer Real</p>,
                },
            ];
        default:
            return [];
    }
};

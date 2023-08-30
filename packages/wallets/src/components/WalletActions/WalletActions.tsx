import React from 'react';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import { useWalletAccountsList } from '@deriv/api';
import './WalletActions.scss';

const getWalletHeaderButtons = (is_demo: boolean, handleAction?: () => void) => {
    const buttons = [
        {
            name: 'Deposit',
            text: is_demo ? 'Reset balance' : 'Deposit',
            icon: <IcCashierAdd />,
        },
        {
            name: 'Withdraw',
            text: 'Withdraw',
            icon: <IcCashierWithdrawal />,
        },
        {
            name: 'Transfer',
            text: 'Transfer',
            icon: <IcCashierTransfer />,
        },
        {
            name: 'Transactions',
            text: 'Transactions',
            icon: <IcCashierStatement />,
        },
    ];

    // Filter out the "Withdraw" button when is_demo is true
    const filteredButtons = is_demo ? buttons.filter(button => button.name !== 'Withdraw') : buttons;

    return filteredButtons.map(button => ({
        ...button,
        action: () => handleAction?.(),
    }));
};

const WalletHeaderActions = ({
    account,
}: {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
}) => {
    const is_demo = account.is_virtual;
    return (
        <div className='wallet-header__actions'>
            {getWalletHeaderButtons(is_demo).map(button => (
                <button key={button.name} className='wallet-header__button' onClick={button.action}>
                    {button.icon}
                </button>
            ))}
        </div>
    );
};

export default WalletHeaderActions;

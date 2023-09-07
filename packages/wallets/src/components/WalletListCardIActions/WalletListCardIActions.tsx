import React from 'react';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import './WalletListCardIActions.scss';

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

type TProps = {
    account?: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
    is_desktop_wallet?: boolean;
};

const WalletListCardIActions: React.FC<TProps> = ({ account, is_desktop_wallet = 'true' }) => {
    const { data: active_wallet } = useActiveWalletAccount();
    const is_demo = !!active_wallet?.is_virtual;

    if (!is_desktop_wallet)
        return (
            <div className='wallets-mobile-actions'>
                {getWalletHeaderButtons(is_demo).map(button => (
                    <React.Fragment key={button.name}>
                        <div className='wallets-mobile-actions-content'>
                            <button
                                key={button.name}
                                className='wallets-mobile-actions-content-icon'
                                onClick={button.action}
                            >
                                {button.icon}
                            </button>
                            <div className='wallets-mobile-actions-content-text'>{button.text}</div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        );

    return (
        <div className='wallets-header__actions'>
            {getWalletHeaderButtons(!!account?.is_virtual).map(button => (
                <button key={button.name} className='wallets-header__button' onClick={button.action}>
                    {button.icon}
                </button>
            ))}
        </div>
    );
};

export default WalletListCardIActions;

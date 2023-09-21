import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import './WalletListCardIActions.scss';

const getWalletHeaderButtons = (isDemo: boolean, handleAction?: () => void) => {
    const buttons = [
        {
            icon: <IcCashierAdd />,
            name: 'Deposit',
            text: isDemo ? 'Reset balance' : 'Deposit',
        },
        {
            icon: <IcCashierWithdrawal />,
            name: 'Withdraw',
            text: 'Withdraw',
        },
        {
            icon: <IcCashierTransfer />,
            name: 'Transfer',
            text: 'Transfer',
        },
        {
            icon: <IcCashierStatement />,
            name: 'Transactions',
            text: 'Transactions',
        },
    ];

    // Filter out the "Withdraw" button when is_demo is true
    const filteredButtons = isDemo ? buttons.filter(button => button.name !== 'Withdraw') : buttons;

    return filteredButtons.map(button => ({
        ...button,
        action: () => handleAction?.(),
    }));
};

type TProps = {
    isDemo: boolean;
};

const WalletListCardIActions: React.FC<TProps> = ({ isDemo }) => {
    const { isMobile } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const is_demo = !!activeWallet?.is_virtual;

    if (isMobile)
        return (
            <div className='wallets-mobile-actions__container'>
                <div className='wallets-mobile-actions'>
                    {getWalletHeaderButtons(is_demo).map(button => (
                        <React.Fragment key={button.name}>
                            <div className='wallets-mobile-actions-content'>
                                <button
                                    className='wallets-mobile-actions-content-icon'
                                    key={button.name}
                                    onClick={button.action}
                                >
                                    {button.icon}
                                </button>
                                <div className='wallets-mobile-actions-content-text'>{button.text}</div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );

    return (
        <div className='wallets-header__actions'>
            {getWalletHeaderButtons(isDemo).map(button => (
                <button
                    className='wallets-header__button'
                    key={`wallets-header-button-${button.name}`}
                    onClick={button.action}
                >
                    {button.icon}
                </button>
            ))}
        </div>
    );
};

export default WalletListCardIActions;

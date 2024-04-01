import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import { IconButton, WalletButton, WalletText } from '../Base';
import './WalletListCardActions.scss';

const getWalletHeaderButtons = (isDemo?: boolean) => {
    const buttons = [
        {
            icon: <IcCashierAdd />,
            name: isDemo ? 'reset-balance' : 'deposit',
            text: isDemo ? 'Reset balance' : 'Deposit',
        },
        {
            icon: <IcCashierWithdrawal />,
            name: 'withdraw',
            text: 'Withdraw',
        },
        {
            icon: <IcCashierTransfer />,
            name: 'transfer',
            text: 'Transfer',
        },
        {
            icon: <IcCashierStatement />,
            name: 'transactions',
            text: 'Transactions',
        },
    ] as const;

    // Filter out the "Withdraw" button when is_demo is true
    const filteredButtons = isDemo ? buttons.filter(button => button.name !== 'withdraw') : buttons;

    const orderForDemo = ['reset-balance', 'transfer', 'transactions'];

    const sortedButtons = isDemo
        ? [...filteredButtons].sort((a, b) => orderForDemo.indexOf(a.name) - orderForDemo.indexOf(b.name))
        : filteredButtons;

    return sortedButtons;
};

const WalletListCardActions = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();

    const isActive = activeWallet?.is_active;
    const isDemo = activeWallet?.is_virtual;

    if (isMobile)
        return (
            <div className='wallets-mobile-actions__container'>
                <div className='wallets-mobile-actions'>
                    {getWalletHeaderButtons(isDemo).map(button => (
                        <div className='wallets-mobile-actions-content' key={button.name}>
                            <IconButton
                                aria-label={button.name}
                                className='wallets-mobile-actions-content-icon'
                                color='transparent'
                                icon={button.icon}
                                isRound
                                onClick={() => {
                                    history.push(`/wallets/cashier/${button.name}`);
                                }}
                                size='lg'
                            />
                            <WalletText size='sm'>{button.text}</WalletText>
                        </div>
                    ))}
                </div>
            </div>
        );

    return (
        <div className='wallets-header__actions'>
            {getWalletHeaderButtons(isDemo).map(button => (
                <WalletButton
                    ariaLabel={button.name}
                    icon={button.icon}
                    key={button.name}
                    onClick={() => {
                        history.push(`/wallets/cashier/${button.name}`);
                    }}
                    rounded='md'
                    variant='outlined'
                >
                    {isActive ? button.text : ''}
                </WalletButton>
            ))}
        </div>
    );
};

export default WalletListCardActions;

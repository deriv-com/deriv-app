import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useAuthorize } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import { THooks } from '../../types';
import { IconButton, WalletButton, WalletText } from '../Base';
import './WalletListCardActions.scss';

const getWalletHeaderButtons = (isDemo: boolean, handleAction?: () => void) => {
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

    const orderForDemo = ['transfer', 'transactions', 'reset-balance'];

    const sortedButtons = isDemo
        ? [...filteredButtons].sort((a, b) => orderForDemo.indexOf(a.name) - orderForDemo.indexOf(b.name))
        : filteredButtons;

    return sortedButtons.map(button => ({
        ...button,
        action: () => handleAction?.(),
    }));
};

type TProps = {
    isActive: THooks.WalletAccountsList['is_active'];
    isDemo: THooks.WalletAccountsList['is_virtual'];
    loginid: THooks.WalletAccountsList['loginid'];
};

const WalletListCardActions: React.FC<TProps> = ({ isActive, isDemo, loginid }) => {
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();

    if (isMobile)
        return (
            <div className='wallets-mobile-actions__container'>
                <div className='wallets-mobile-actions'>
                    {getWalletHeaderButtons(isDemo).map(button => (
                        <div className='wallets-mobile-actions-content' key={button.name}>
                            <IconButton
                                className='wallets-mobile-actions-content-icon'
                                color='transparent'
                                icon={button.icon}
                                isRound
                                onClick={() => {
                                    if (activeWallet?.loginid !== loginid) {
                                        switchAccount(loginid);
                                    }
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
                    icon={button.icon}
                    key={button.name}
                    onClick={() => {
                        switchAccount(loginid);
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

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthorize } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import { WalletButton, WalletText } from '../Base';
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

    return filteredButtons.map(button => ({
        ...button,
        action: () => handleAction?.(),
    }));
};

type TProps = {
    isActive: boolean;
    isDemo: boolean;
    loginid: string;
};

const WalletListCardActions: React.FC<TProps> = ({ isActive, isDemo, loginid }) => {
    const { switchAccount } = useAuthorize();
    const { isMobile } = useDevice();
    const history = useHistory();

    if (isMobile)
        return (
            <div className='wallets-mobile-actions__container'>
                <div className='wallets-mobile-actions'>
                    {getWalletHeaderButtons(isDemo).map(button => (
                        <div className='wallets-mobile-actions-content' key={button.name}>
                            <button
                                className='wallets-mobile-actions-content-icon'
                                key={button.name}
                                onClick={() => {
                                    history.push(`/wallets/cashier/${button.name}`);
                                }}
                            >
                                {button.icon}
                            </button>
                            <WalletText lineHeight='3xs' size='2xs'>
                                {button.text}
                            </WalletText>
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
                    isRounded
                    key={button.name}
                    onClick={() => {
                        switchAccount(loginid);
                        history.push(`/wallets/cashier/${button.name}`);
                    }}
                    text={isActive ? button.text : undefined}
                    variant='outlined'
                />
            ))}
        </div>
    );
};

export default WalletListCardActions;

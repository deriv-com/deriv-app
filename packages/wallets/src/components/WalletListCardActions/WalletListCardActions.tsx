import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useAuthorize } from '@deriv/api';
import useCashierParam, { TCashierTabs } from '../../hooks/useCashierParam';
import useDevice from '../../hooks/useDevice';
import IcCashierAdd from '../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../public/images/ic-cashier-withdrawal.svg';
import './WalletListCardActions.scss';

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
    isActive: boolean;
    isDemo: boolean;
    loginid: string;
};

const WalletListCardActions: React.FC<TProps> = ({ isActive, isDemo, loginid }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { switchAccount } = useAuthorize();
    const { getCashierParam } = useCashierParam();
    const { isMobile } = useDevice();
    const history = useHistory();

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
                    key={loginid}
                    onClick={async () => {
                        await switchAccount(loginid);
                        history.push(
                            `/appstore/traders-hub?${getCashierParam(button.name.toLowerCase() as TCashierTabs)}`
                        );
                    }}
                >
                    {button.icon}
                    <span
                        className={`wallets-header__actions-label ${
                            isActive ? 'wallets-header__actions-label--active' : ''
                        }`}
                    >
                        {button.name}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default WalletListCardActions;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
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
            link: '?&active-cashier-tab=deposit',
        },
        {
            name: 'Withdraw',
            text: 'Withdraw',
            icon: <IcCashierWithdrawal />,
            link: '?&active-cashier-tab=withdraw',
        },
        {
            name: 'Transfer',
            text: 'Transfer',
            icon: <IcCashierTransfer />,
            link: '?&active-cashier-tab=transfer',
        },
        {
            name: 'Transactions',
            text: 'Transactions',
            icon: <IcCashierStatement />,
            link: '?&active-cashier-tab=transactions',
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
};

const WalletListCardIActions: React.FC<TProps> = ({ account }) => {
    const { data: active_wallet } = useActiveWalletAccount();
    const { is_mobile } = useDevice();
    const history = useHistory();

    const is_demo = !!active_wallet?.is_virtual;

    if (is_mobile)
        return (
            <div className='wallets-mobile-actions__container'>
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
            </div>
        );

    return (
        <div className='wallets-header__actions'>
            {getWalletHeaderButtons(!!account?.is_virtual).map(button => (
                <button
                    key={`wallets-header-button-${button.name}`}
                    className='wallets-header__button'
                    onClick={() => {
                        history.push(`/appstore/traders-hub${button.link}`);
                    }}
                >
                    {button.icon}
                    <span
                        className={`wallets-header__actions-label ${
                            account?.is_active ? 'wallets-header__actions-label--active' : ''
                        }`}
                    >
                        {button.name}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default WalletListCardIActions;

import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { useActiveWalletAccount, useActiveWalletBalance } from '@deriv/api';
import { WalletCardIcon, WalletGradientBackground, WalletText } from '../../../../components';
import { WalletListCardBadge } from '../../../../components/WalletListCardBadge';
import useDevice from '../../../../hooks/useDevice';
import CloseIcon from '../../../../public/images/close-icon.svg';
import IcCashierDeposit from '../../../../public/images/ic-cashier-deposit.svg';
import IcCashierStatement from '../../../../public/images/ic-cashier-statement.svg';
import IcCashierTransfer from '../../../../public/images/ic-cashier-transfer.svg';
import IcCashierWithdrawal from '../../../../public/images/ic-cashier-withdrawal.svg';
import ResetBalance from '../../../../public/images/plus-thin.svg';
import i18n from '../../../../translations/i18n';
import './WalletCashierHeader.scss';

type TProps = {
    hideWalletDetails: boolean;
};

const realAccountTabs = [
    {
        icon: <IcCashierDeposit />,
        path: 'deposit',
        text: i18n.t('Deposit'),
    },
    {
        icon: <IcCashierWithdrawal />,
        path: 'withdraw',
        text: i18n.t('Withdraw'),
    },
    {
        icon: <IcCashierTransfer />,
        path: 'transfer',
        text: i18n.t('Transfer'),
    },
    {
        icon: <IcCashierStatement />,
        path: 'transactions',
        text: i18n.t('Transactions'),
    },
] as const;

const virtualAccountTabs = [
    {
        icon: <IcCashierTransfer />,
        path: 'transfer',
        text: i18n.t('Transfer'),
    },
    {
        icon: <IcCashierStatement />,
        path: 'transactions',
        text: i18n.t('Transactions'),
    },
    {
        icon: <ResetBalance />,
        path: 'reset-balance',
        text: i18n.t('Reset Balance'),
    },
] as const;

const WalletCashierHeader: React.FC<TProps> = ({ hideWalletDetails }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const activeTabRef = useRef<HTMLButtonElement>(null);
    const history = useHistory();
    const location = useLocation();
    const { displayBalance } = useActiveWalletBalance();

    const tabs = activeWallet?.is_virtual ? virtualAccountTabs : realAccountTabs;

    useEffect(() => {
        if (isMobile && activeTabRef.current) {
            activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'center' });
        }
    }, [location.pathname, isMobile]);

    return (
        <WalletGradientBackground
            currency={activeWallet?.currency_config?.display_code || 'USD'}
            device={isMobile ? 'mobile' : 'desktop'}
            isDemo={activeWallet?.is_virtual}
            theme='light'
            type='header'
        >
            <main className='wallets-cashier-header'>
                <section className='wallets-cashier-header__info'>
                    <div className='wallets-cashier-header__top-left-info'>
                        <div
                            className={classNames('wallets-cashier-header__details', {
                                'wallets-cashier-header__details--hide-details': hideWalletDetails,
                            })}
                        >
                            <WalletText
                                color={activeWallet?.is_virtual ? 'system-dark-2-general-text' : 'general'}
                                size='md'
                            >
                                {activeWallet?.currency} Wallet
                            </WalletText>
                            {activeWallet?.landing_company_name && (
                                <WalletListCardBadge
                                    isDemo={activeWallet?.is_virtual}
                                    label={activeWallet?.landing_company_name}
                                />
                            )}
                        </div>
                        <WalletText color={activeWallet?.is_virtual ? 'white' : 'general'} size='xl' weight='bold'>
                            {displayBalance}
                        </WalletText>
                    </div>
                    <div className='wallets-cashier-header__top-right-info'>
                        {activeWallet?.wallet_currency_type && (
                            <div
                                className={classNames('wallets-cashier-header__currency-icon', {
                                    'wallets-cashier-header__currency-icon--hide-currency-icon': hideWalletDetails,
                                })}
                            >
                                <WalletCardIcon size='xl' type={activeWallet?.wallet_currency_type} />
                            </div>
                        )}
                        <CloseIcon
                            className={classNames('wallets-cashier-header__close-icon', {
                                'wallets-cashier-header__close-icon--white': activeWallet?.is_virtual,
                            })}
                            onClick={() => history.push('/wallets')}
                        />
                    </div>
                </section>
                <section className='wallets-cashier-header__tabs'>
                    {tabs.map(tab => {
                        const isActiveTab =
                            location.pathname === `/wallets/cashier/on-ramp`
                                ? tab.path === 'deposit'
                                : location.pathname === `/wallets/cashier/${tab.path}`;
                        return (
                            <button
                                className={`wallets-cashier-header__tab ${
                                    isActiveTab ? 'wallets-cashier-header__tab--active' : ''
                                }`}
                                key={`cashier-tab-${tab.path}`}
                                onClick={() => history.push(`/wallets/cashier/${tab.path}`)}
                                ref={isActiveTab ? activeTabRef : null}
                            >
                                <div
                                    className={classNames('wallets-cashier-header__tab-icon', {
                                        'wallets-cashier-header__tab-icon--system-dark-2-general-text':
                                            activeWallet?.is_virtual && !isActiveTab,
                                    })}
                                >
                                    {tab.icon}
                                </div>
                                <WalletText
                                    color={
                                        activeWallet?.is_virtual && !isActiveTab
                                            ? 'system-dark-2-general-text'
                                            : 'general'
                                    }
                                    size='sm'
                                    weight={isActiveTab ? 'bold' : 'normal'}
                                >
                                    {tab.text}
                                </WalletText>
                            </button>
                        );
                    })}
                </section>
            </main>
        </WalletGradientBackground>
    );
};

export default WalletCashierHeader;

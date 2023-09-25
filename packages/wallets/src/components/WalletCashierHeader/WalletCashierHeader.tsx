import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import Close from '../../public/images/close.svg';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './WalletCashierHeader.scss';

const tabs = ['deposit', 'withdraw', 'transfer', 'transactions'] as const;

const WalletCashierHeader = () => {
    const { data } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();
    const { currency, currency_config, display_balance, landing_company_name, wallet_currency_type } = data || {};
    const location = useLocation();

    return (
        <WalletGradientBackground
            currency={currency_config?.display_code || 'USD'}
            device={isMobile ? 'mobile' : 'desktop'}
            theme='light'
            type='header'
        >
            <main className='wallets-cashier-header'>
                <section className='wallets-cashier-header__info'>
                    <div className='wallets-cashier-header__info__top-left'>
                        <div className='wallets-cashier-header__info__top-left__details'>
                            <h1 className='wallets-cashier-header__info__top-left__details__title'>
                                {currency} Wallet
                            </h1>
                            {landing_company_name && (
                                <WalletListCardBadge is_demo={data?.is_virtual} label={landing_company_name} />
                            )}
                        </div>
                        <p className='wallets-cashier-header__info__top-left__balance'>{display_balance}</p>
                    </div>
                    <div className='wallets-cashier-header__info__top-right'>
                        {wallet_currency_type && <WalletCardIcon size='lg' type={wallet_currency_type} />}
                        <button
                            className='wallets-cashier-header__close-button'
                            onClick={() => history.push('/appstore/traders-hub')}
                        >
                            <Close />
                        </button>
                    </div>
                </section>
                <section className='wallets-cashier-header__tabs'>
                    {tabs.map(tab => (
                        <button
                            className={`wallets-cashier-header__tabs__tab ${
                                location.pathname === `/appstore/traders-hub/cashier/${tab}`
                                    ? 'wallets-cashier-header__tabs__tab--active'
                                    : ''
                            }`}
                            key={`cashier-tab-${tab}`}
                            onClick={() => history.push(`/appstore/traders-hub/cashier/${tab}`)}
                        >
                            {tab}
                        </button>
                    ))}
                </section>
            </main>
        </WalletGradientBackground>
    );
};

export default WalletCashierHeader;

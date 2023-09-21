import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import useCashierParam, { TCashierTabs } from '../../hooks/useCashierParam';
import useDevice from '../../hooks/useDevice';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletCashierHeader.scss';

const tabs = ['Deposit', 'Withdraw', 'Transfer', 'Transactions'];

const WalletCashierHeader = () => {
    const { data } = useActiveWalletAccount();
    const { activeCashierTab, getCashierParam } = useCashierParam();
    const { is_mobile } = useDevice();
    const history = useHistory();
    const { currency, currency_config, display_balance, landing_company_name, wallet_currency_type } = data || {};

    const formattedLandingCompany =
        landing_company_name === 'virtual' ? 'Demo' : landing_company_name?.toUpperCase() || 'SVG';

    return (
        <WalletGradientBackground
            currency={currency_config?.display_code || 'USD'}
            device={is_mobile ? 'mobile' : 'desktop'}
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
                                <WalletListCardBadge is_demo={data?.is_virtual} label={formattedLandingCompany} />
                            )}
                        </div>
                        <p className='wallets-cashier-header__info__top-left__balance'>{display_balance}</p>
                    </div>
                    <div className='wallets-cashier-header__info__top-right'>
                        {wallet_currency_type && <WalletListCardIcon type={wallet_currency_type} />}
                        <button
                            className='wallets-cashier-header__close-button'
                            onClick={() => history.push('/appstore/traders-hub')}
                        >
                            x
                        </button>
                    </div>
                </section>
                <section className='wallets-cashier-header__tabs'>
                    {tabs.map(tab => (
                        <button
                            className={`wallets-cashier-header__tabs__tab ${
                                activeCashierTab === tab.toLowerCase()
                                    ? 'wallets-cashier-header__tabs__tab--active'
                                    : ''
                            }`}
                            key={`cashier-tab-${tab}`}
                            onClick={() =>
                                history.push(
                                    `/appstore/traders-hub?${getCashierParam(tab.toLowerCase() as TCashierTabs)}`
                                )
                            }
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

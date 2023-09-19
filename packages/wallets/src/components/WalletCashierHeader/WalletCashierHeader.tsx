import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletCashierHeader.scss';

type TProps = {
    data: ReturnType<typeof useActiveWalletAccount>['data'];
};

const tabs = [
    { name: 'deposit', link: '?&active-cashier-tab=deposit' },
    { name: 'withdraw', link: '?&active-cashier-tab=withdraw' },
    { name: 'transfer', link: '?&active-cashier-tab=transfer' },
    { name: 'transactions', link: '?&active-cashier-tab=transactions' },
];

const WalletCashierHeader: React.FC<TProps> = ({ data }) => {
    const { is_mobile } = useDevice();
    const history = useHistory();
    const { currency, currency_config, display_balance, landing_company_name, wallet_currency_type } = data || {};

    const formattedLandingCompany =
        landing_company_name === 'virtual' ? 'Demo' : landing_company_name?.toUpperCase() || 'SVG';

    const urlParams = new URLSearchParams(window.location.search);
    const activeCashierTab = urlParams.get('active-cashier-tab');

    return (
        <WalletGradientBackground
            currency={currency_config?.display_code || 'USD'}
            device={is_mobile ? 'mobile' : 'desktop'}
            theme='light'
            type='header'
        >
            <main className='wallets-cashier-header'>
                <button
                    className='wallets-cashier-header__close-button'
                    onClick={() => history.push('/appstore/traders-hub')}
                >
                    x
                </button>
                <section className='wallets-cashier-header__info'>
                    <div className='wallets-cashier-header__info__top-left'>
                        <div className='wallets-cashier-header__info__top-left__details'>
                            <h1 className='wallets-cashier-header__info__top-left__details__title'>
                                {currency} Wallet
                            </h1>
                            {landing_company_name && (
                                <WalletListCardBadge label={formattedLandingCompany} is_demo={data?.is_virtual} />
                            )}
                        </div>
                        <p className='wallets-cashier-header__info__top-left__balance'>
                            {display_balance} {currency}
                        </p>
                    </div>
                    {wallet_currency_type && <WalletListCardIcon type={wallet_currency_type} />}
                </section>
                <section className='wallets-cashier-header__tabs'>
                    {tabs.map(tab => (
                        <button
                            key={`cashier-tab-${tab.name}`}
                            className={`wallets-cashier-header__tabs__tab ${
                                activeCashierTab === tab.name ? 'wallets-cashier-header__tabs__tab--active' : ''
                            }`}
                            onClick={() => history.push(`/appstore/traders-hub${tab.link}`)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </section>
            </main>
        </WalletGradientBackground>
    );
};

export default WalletCashierHeader;

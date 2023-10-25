import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletCardIcon } from '../../../../components/WalletCardIcon';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import { WalletListCardBadge } from '../../../../components/WalletListCardBadge';
import useDevice from '../../../../hooks/useDevice';
import CloseIcon from '../../../../public/images/close-icon.svg';
import './WalletCashierHeader.scss';
import { WalletText } from '../../../../components';

const realAccountTabs = ['deposit', 'withdraw', 'transfer', 'transactions'];
const virtualAccountTabs = ['withdraw', 'transfer', 'transactions', 'reset-balance'];

const WalletCashierHeader = ({ hideWalletDetails }: { hideWalletDetails: boolean }) => {
    const { data } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();
    const location = useLocation();

    let tabs = realAccountTabs;
    if (data?.is_virtual) {
        tabs = virtualAccountTabs;
    }

    return (
        <WalletGradientBackground
            currency={data?.currency_config?.display_code || 'USD'}
            device={isMobile ? 'mobile' : 'desktop'}
            theme='light'
            type='header'
        >
            <div className='wallets-cashier-header__wrapper'>
                <main className='wallets-cashier-header'>
                    <section className='wallets-cashier-header__info'>
                        <div className='wallets-cashier-header__info__top-left'>
                            <div className='wallets-cashier-header__info__top-left__details'>
                                <WalletText>{data?.currency} Wallet</WalletText>
                                {data?.landing_company_name && (
                                    <WalletListCardBadge isDemo={data?.is_virtual} label={data?.landing_company_name} />
                                )}
                            </div>

                            <WalletText lineHeight='7xl' size='xl' weight='bold'>
                                {data?.display_balance}
                            </WalletText>
                        </div>
                        <div className='wallets-cashier-header__info__top-right'>
                            {data?.wallet_currency_type && (
                                <WalletCardIcon size='xl' type={data?.wallet_currency_type} />
                            )}
                            <button
                                className='wallets-cashier-header__close-button'
                                onClick={() => history.push('/wallets')}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </section>
                    <section className='wallets-cashier-header__tabs'>
                        {tabs.map(tab => (
                            <>
                                <button
                                    className={`wallets-cashier-header__tabs__tab ${
                                        location.pathname === `/wallets/cashier/${tab}`
                                            ? 'wallets-cashier-header__tabs__tab--active'
                                            : ''
                                    }`}
                                    key={`cashier-tab-${tab}`}
                                    onClick={() => history.push(`/wallets/cashier/${tab}`)}
                                >
                                    <WalletText
                                        size='sm'
                                        weight={location.pathname === `/wallets/cashier/${tab}` ? 'bold' : 'normal'}
                                    >
                                        {tab}
                                    </WalletText>
                                </button>
                            </>
                        ))}
                    </section>
                </main>
            </div>
        </WalletGradientBackground>
    );
};

export default WalletCashierHeader;

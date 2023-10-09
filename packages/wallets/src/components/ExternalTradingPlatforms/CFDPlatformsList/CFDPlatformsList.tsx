import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api';
import useDevice from '../../../hooks/useDevice';
import { CTraderList } from '../CTraderList';
import { MT5PlatformsList } from '../MT5PlatformsList';
import { OtherCFDPlatformsList } from '../OtherCFDPlatformsList';
import './CFDPlatformsList.scss';

const CFDPlatformsList = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: walletAccountsList } = useWalletAccountsList();
    const { isMobile } = useDevice();
    const history = useHistory();

    const fiatAccount = useMemo(
        () => walletAccountsList?.find(account => account.account_type === 'doughflow'),
        [walletAccountsList]
    );

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {!isMobile && (
                    <div className='wallets-cfd-list__header-title'>
                        <h1>CFDs</h1>
                    </div>
                )}
                <div className='wallets-cfd-list__header-description'>
                    <h1>
                        Trade with leverage and tight spreads for better returns on trades.{' '}
                        <a className='wallets-cfd-list__header-description__link' href='#'>
                            Learn more
                        </a>
                    </h1>
                </div>
            </section>
            {!activeWallet?.currency_config?.is_crypto && (
                <div>
                    <MT5PlatformsList />
                    {activeWallet?.is_virtual && <CTraderList />}
                    <OtherCFDPlatformsList />
                </div>
            )}
            {activeWallet?.currency_config?.is_crypto && (
                <div className='wallets-cfd-list__cfd-empty-state'>
                    <p className='wallets-cfd-list__cfd-empty-state__description'>
                        To trade CFDs, you’ll need to use your {fiatAccount?.wallet_currency_type} Wallet. Click
                        Transfer to move your BTC to your {fiatAccount?.wallet_currency_type} Wallet.
                    </p>
                    <button
                        className='wallets-cfd-list__cfd-empty-state__transfer-button'
                        onClick={() => history.push('/appstore/traders-hub/cashier/transfer')}
                    >
                        Transfer
                    </button>
                </div>
            )}
        </div>
    );
};

export default CFDPlatformsList;

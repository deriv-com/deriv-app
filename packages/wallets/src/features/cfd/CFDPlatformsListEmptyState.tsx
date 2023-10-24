import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api';
import './CFDPlatformsList.scss';

const CFDPlatformsListEmptyState = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: walletAccountsList } = useWalletAccountsList();
    const history = useHistory();

    const fiatAccount = useMemo(
        () => walletAccountsList?.find(account => account.account_type === 'doughflow'),
        [walletAccountsList]
    );

    return (
        <div className='wallets-cfd-list__cfd-empty-state'>
            <p className='wallets-cfd-list__cfd-empty-state__description'>
                To trade CFDs, you’ll need to use your {fiatAccount?.wallet_currency_type} Wallet. Click Transfer to
                move your {activeWallet?.currency} to your {fiatAccount?.wallet_currency_type} Wallet.
            </p>
            <button
                className='wallets-cfd-list__cfd-empty-state__transfer-button'
                onClick={() => history.push('/wallets/cashier/transfer')}
            >
                Transfer
            </button>
        </div>
    );
};

export default CFDPlatformsListEmptyState;

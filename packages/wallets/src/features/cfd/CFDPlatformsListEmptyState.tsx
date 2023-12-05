import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api';
import { WalletButton, WalletText } from '../../components/Base';
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
            <WalletText align='center' weight='bold'>
                To trade CFDs, you’ll need to use your {fiatAccount?.wallet_currency_type} Wallet. Click Transfer to
                move your {activeWallet?.currency} to your {fiatAccount?.wallet_currency_type} Wallet.
            </WalletText>
            <WalletButton color='primary-light' onClick={() => history.push('/wallets/cashier/transfer')} size='lg'>
                Transfer
            </WalletButton>
        </div>
    );
};

export default CFDPlatformsListEmptyState;

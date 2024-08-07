import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { Button, useDevice } from '@deriv-com/ui';
import { WalletText } from '../../components/Base';
import './CFDPlatformsList.scss';

const CFDPlatformsListEmptyState = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: walletAccountsList } = useWalletAccountsList();
    const history = useHistory();
    const { isDesktop } = useDevice();

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
            <Button
                color='primary-light'
                onClick={() =>
                    history.push('/wallet/account-transfer', {
                        shouldSelectDefaultWallet: true,
                    })
                }
                size='lg'
                textSize={isDesktop ? 'sm' : 'md'}
            >
                Transfer
            </Button>
        </div>
    );
};

export default CFDPlatformsListEmptyState;

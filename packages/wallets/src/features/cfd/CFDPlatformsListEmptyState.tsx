import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
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
                <Localize
                    i18n_default_text="To trade CFDs, you'll need to use your {{walletCurrencyType}} Wallet. Click Transfer to move your {{currency}} to your {{walletCurrencyType}} Wallet."
                    values={{ currency: activeWallet?.currency, walletCurrencyType: fiatAccount?.wallet_currency_type }}
                />
            </WalletText>
            <WalletButton
                color='primary-light'
                onClick={() =>
                    history.push('/wallet/account-transfer', {
                        shouldSelectDefaultWallet: true,
                    })
                }
                size='lg'
            >
                <Localize i18n_default_text='Transfer' />
            </WalletButton>
        </div>
    );
};

export default CFDPlatformsListEmptyState;

import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
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
            <button
                className='wallets-cfd-list__cfd-empty-state-button'
                data-testid='dt_cfd_empty_state_transfer_button'
                onClick={() => {
                    history.push('/wallet/account-transfer', {
                        shouldSelectDefaultWallet: true,
                    });
                }}
            >
                <LabelPairedArrowUpArrowDownSmBoldIcon />
            </button>
            <div className='wallets-cfd-list__cfd-empty-state-text'>
                <Text align='start' size={isDesktop ? 'md' : 'sm'} weight='bold'>
                    <Localize i18n_default_text='Transfer funds' />
                </Text>
                <Text align='start' size={isDesktop ? 'sm' : 'xs'}>
                    <Localize
                        i18n_default_text="To trade CFDs, you'll need to use your {{walletCurrencyType}} Wallet. Click Transfer to move your {{currency}} to your {{walletCurrencyType}} Wallet."
                        values={{
                            currency: activeWallet?.currency,
                            walletCurrencyType: fiatAccount?.wallet_currency_type,
                        }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default CFDPlatformsListEmptyState;

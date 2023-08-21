import React from 'react';
import { Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import { localize } from '@deriv/translations';
import WalletFiatMT5Content from './wallet-fiat-mt5-content';
import WalletOtherCFDContent from './wallet-other-cfds/wallet-other-cfd-content';

type TWalletFiatMT5 = {
    wallet_account: TWalletAccount;
};

const WalletFiatCFD = observer(({ wallet_account }: TWalletFiatMT5) => {
    const { traders_hub } = useStore();
    const { available_dxtrade_accounts } = traders_hub;

    return (
        <React.Fragment>
            <div className='cfd-full-row' style={{ paddingTop: '2rem' }}>
                <Text line_height='m' weight='bold' color='prominent'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
            <WalletFiatMT5Content />
            {available_dxtrade_accounts?.length > 0 && (
                <div className='cfd-full-row'>
                    <Text line_height='m' weight='bold' color='prominent'>
                        {localize('Other CFD Platforms')}
                    </Text>
                </div>
            )}
            <WalletOtherCFDContent wallet_account={wallet_account} />
        </React.Fragment>
    );
});

export default WalletFiatCFD;

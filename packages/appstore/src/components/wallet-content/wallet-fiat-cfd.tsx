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
    const {
        modules: { cfd },
        traders_hub,
        ui,
    } = useStore();
    const { available_dxtrade_accounts } = traders_hub;
    const { is_mobile } = ui;
    const { toggleCompareAccountsModal } = cfd;
    const accounts_sub_text =
        wallet_account.landing_company_name === 'svg' ? localize('Compare accounts') : localize('Account information');

    return (
        <React.Fragment>
            {is_mobile && (
                <div className='cfd-accounts__compare-table-title' onClick={toggleCompareAccountsModal}>
                    <Text size='xs' color='red' weight='bold' line_height='s'>
                        {accounts_sub_text}
                    </Text>
                </div>
            )}
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

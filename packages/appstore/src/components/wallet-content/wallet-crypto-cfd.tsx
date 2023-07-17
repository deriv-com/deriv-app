import React from 'react';
import { Text, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';

type TProps = {
    fiat_wallet_currency?: string;
};

const WalletCryptoCFD = observer(({ fiat_wallet_currency }: TProps) => {
    const { ui, traders_hub } = useStore();
    const { setIsWalletModalVisible } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;
    const wallet_account = useActiveWallet();
    const currency = wallet_account?.currency;

    return (
        <div className='wallet-content__cfd-crypto'>
            <Text
                size={isMobile ? 'xs' : 's'}
                weight='bold'
                line_height={isMobile ? 'xl' : 'xxl'}
                as='p'
                className='wallet-content__cfd-crypto-title'
            >
                <Localize
                    i18n_default_text='To trade CFDs, you’ll need to use your {{fiat_wallet_currency}} Wallet. Click Transfer to move your {{currency}} to your {{fiat_wallet_currency}} Wallet.'
                    values={{ fiat_wallet_currency, currency }}
                />
            </Text>
            <Button
                onClick={() => {
                    setWalletModalActiveTab('Transfer');
                    setIsWalletModalVisible(true);
                    setWalletModalActiveWalletID(wallet_account?.loginid);
                }}
                className='wallet-content__cfd-crypto-button'
                primary_light
            >
                {localize('Transfer')}
            </Button>
        </div>
    );
});

export default WalletCryptoCFD;

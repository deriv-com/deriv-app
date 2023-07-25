import React from 'react';
import { Text, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet, useWalletsList } from '@deriv/hooks';

const WalletCryptoCFD = observer(() => {
    const { ui, traders_hub } = useStore();
    const { setIsWalletModalVisible, is_mobile } = ui;
    const { setWalletModalActiveWalletID, setWalletModalActiveTab } = traders_hub;
    const wallet_account = useActiveWallet();
    const currency = wallet_account?.currency;
    const { data } = useWalletsList();
    const fiat_wallet_currency = data?.find(wallet => wallet.is_fiat)?.currency;

    return (
        <div className='wallet-content__cfd-crypto'>
            <Text
                size={is_mobile ? 'xs' : 's'}
                weight='bold'
                line_height={is_mobile ? 'xl' : 'xxl'}
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

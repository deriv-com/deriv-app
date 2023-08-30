import React from 'react';
import { useActiveWallet } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { Div100vhContainer } from '@deriv/components';
import WalletFiatDeposit from './components/wallet-fiat-deposit/wallet-fiat-deposit';
import WalletCryptoDeposit from './components/wallet-crypto-deposit/wallet-crypto-deposit';
import './wallet-deposit.scss';

const WalletDeposit = observer(() => {
    const { ui } = useStore();
    const active_wallet = useActiveWallet();
    const { is_mobile } = ui;

    return active_wallet?.currency_config?.type === 'fiat' ? (
        <Div100vhContainer height_offset={is_mobile ? '14rem' : '26.8rem'}>
            <WalletFiatDeposit />
        </Div100vhContainer>
    ) : (
        <WalletCryptoDeposit is_mobile={is_mobile} />
    );
});

export default WalletDeposit;

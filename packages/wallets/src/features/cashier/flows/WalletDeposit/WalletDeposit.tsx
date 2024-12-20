import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletLoader } from '../../../../components';
import { DepositCryptoModule, DepositFiatModule } from '../../modules';

const WalletDeposit = () => {
    const { data: activeWallet } = useActiveWalletAccount();

    if (!activeWallet?.currency_config) return <WalletLoader />;

    const isCryptoProvider = activeWallet.currency_config.platform.cashier.includes('crypto');

    return isCryptoProvider ? <DepositCryptoModule /> : <DepositFiatModule />;
};

export default WalletDeposit;

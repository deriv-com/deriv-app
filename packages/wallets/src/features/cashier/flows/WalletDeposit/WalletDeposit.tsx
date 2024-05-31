import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { DepositCryptoModule, DepositFiatModule } from '../../modules';

const WalletDeposit = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;

    return isCrypto ? <DepositCryptoModule /> : <DepositFiatModule />;
};

export default WalletDeposit;

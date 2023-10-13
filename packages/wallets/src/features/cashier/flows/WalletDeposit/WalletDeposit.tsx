import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletDepositCrypto, WalletDepositFiat } from '../../screens';

const WalletDeposit = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;

    if (isCrypto) {
        return <WalletDepositCrypto />;
    }

    return <WalletDepositFiat />;
};

export default WalletDeposit;

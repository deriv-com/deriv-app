import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletDepositCrypto } from '../WalletDepositCrypto';
import { WalletDepositFiat } from '../WalletDepositFiat';

const WalletDeposit = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;

    if (isCrypto) {
        return <WalletDepositCrypto />;
    }

    return <WalletDepositFiat />;
};

export default WalletDeposit;

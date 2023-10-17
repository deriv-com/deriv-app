import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletDepositCrypto, WalletDepositFiat } from '../../screens';

const WalletResetBalance = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;

    return <h1>WALLET RESET BALANCE!!!</h1>;
    // if (isCrypto) {
    //     return <WalletDepositCrypto />;
    // }
    //
    // return <WalletDepositFiat />;
};

export default WalletResetBalance;

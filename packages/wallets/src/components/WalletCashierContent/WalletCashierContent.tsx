import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import WalletDepositCrypto from '../WalletDepositCrypto/WalletDepositCrypto';
import WalletDepositFiat from '../WalletDepositFiat/WalletDepositFiat';

const WalletCashierContent = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;
    const isDeposit = useRouteMatch('/appstore/traders-hub/cashier/deposit');

    if (isDeposit) {
        if (isCrypto) {
            return <WalletDepositCrypto />;
        }

        return <WalletDepositFiat />;
    }

    return <p>In development</p>;
};

export default WalletCashierContent;

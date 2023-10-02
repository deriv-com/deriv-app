import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import WalletDepositCrypto from '../WalletDepositCrypto/WalletDepositCrypto';
import WalletDepositFiat from '../WalletDepositFiat/WalletDepositFiat';
import { WalletTransfer } from '../WalletTransfer';
import WalletWithdrawal from '../WalletWithdrawal/WalletWithdrawal';

const WalletCashierContent = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;
    const isDeposit = useRouteMatch('/appstore/traders-hub/cashier/deposit');
    const isTransfer = useRouteMatch('/appstore/traders-hub/cashier/transfer');
    const isWithdrawal = useRouteMatch('/appstore/traders-hub/cashier/withdraw');

    if (isDeposit) {
        if (isCrypto) {
            return <WalletDepositCrypto />;
        }

        return <WalletDepositFiat />;
    }

    if (isTransfer) {
        return <WalletTransfer />;
    }

    if (isWithdrawal) {
        return <WalletWithdrawal />;
    }

    return <p>In development</p>;
};

export default WalletCashierContent;

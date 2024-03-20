import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { CashierLocked, DepositCryptoModule, DepositFiatModule, DepositLocked } from '../../modules';

const WalletDeposit = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;

    return (
        <CashierLocked module='deposit'>
            <DepositLocked>{isCrypto ? <DepositCryptoModule /> : <DepositFiatModule />}</DepositLocked>
        </CashierLocked>
    );
};

export default WalletDeposit;

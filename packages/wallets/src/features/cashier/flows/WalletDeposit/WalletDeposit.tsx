import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { CashierLocked, DepositCryptoModule, DepositFiatModule, DepositLocked, SystemMaintenance } from '../../modules';

const WalletDeposit = () => {
    const { data } = useActiveWalletAccount();
    const isCrypto = data?.currency_config?.is_crypto;

    if (isCrypto) {
        return (
            <SystemMaintenance isDeposit>
                <CashierLocked>
                    <DepositLocked>
                        <DepositCryptoModule />
                    </DepositLocked>
                </CashierLocked>
            </SystemMaintenance>
        );
    }

    return (
        <SystemMaintenance isDeposit>
            <CashierLocked>
                <DepositLocked>
                    <DepositFiatModule />
                </DepositLocked>
            </CashierLocked>
        </SystemMaintenance>
    );
};

export default WalletDeposit;

import React from 'react';
import { useCashierLocked, useDepositLocked, useIsSystemMaintenance } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import WalletLocked from 'Components/wallet-locked';
import type { TWallet } from 'Components/modals/wallet-modal/wallet-modal';

type TWalletDeposit = {
    wallet: TWallet;
};

const WalletDeposit = observer(({ wallet }: TWalletDeposit) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const is_cashier_locked = useCashierLocked();
    const is_deposit_locked = useDepositLocked();
    const is_system_maintenance = useIsSystemMaintenance();

    if (is_system_maintenance) {
        if (is_cashier_locked || (is_deposit_locked && wallet.is_crypto)) {
            return <WalletLocked is_mobile={is_mobile} wallet={wallet} />;
        }
    }

    // Here we will DepositCryptoModule/DepositFiatModule
    return <div>Deposit Development Is In Progress</div>;
});

export default WalletDeposit;

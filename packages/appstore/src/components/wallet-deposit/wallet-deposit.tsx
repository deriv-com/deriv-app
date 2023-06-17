import React from 'react';
import { useIsSystemMaintenance } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import WalletLocked from 'Components/wallet-locked';
import type { TWallet } from 'Components/modals/wallet-modal/wallet-modal';

type TWalletDeposit = {
    wallet: TWallet;
};

const WalletDeposit = observer(({ wallet }: TWalletDeposit) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const is_system_maintenance = useIsSystemMaintenance();

    if (is_system_maintenance) {
        return <WalletLocked is_mobile={is_mobile} wallet={wallet} />;
    }

    // Here we are going to return  DepositCryptoModule/DepositFiatModule
    return null;
});

export default WalletDeposit;

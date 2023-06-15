import React from 'react';
import { useIsSystemMaintenance } from '@deriv/hooks';
import WalletLocked from 'Components/wallet-locked';
import type { TWallet } from 'Components/modals/wallet-modal/wallet-modal';

type TWalletDeposit = {
    wallet: TWallet;
};

const WalletDeposit = ({ wallet }: TWalletDeposit) => {
    const is_system_maintenance = useIsSystemMaintenance();

    if (true) {
        return <WalletLocked wallet={wallet} />;
    }

    // Here we are going to return  DepositCryptoModule/DepositFiatModule
    return null;
};

export default WalletDeposit;

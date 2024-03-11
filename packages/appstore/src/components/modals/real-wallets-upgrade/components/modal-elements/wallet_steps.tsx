import React from 'react';
import WhyWallets from '../why-wallets';
import { EndFooter, InitialFooter } from './wallets-upgrade-footer';
import ReadyToUpgradeWallets from '../ready-to-upgrade-wallets';
import { TWalletSteps } from 'Types';

const WalletSteps = ({
    handleBack,
    handleClose,
    handleNext,
    is_disabled,
    toggleCheckbox,
    upgradeToWallets,
}: TWalletSteps) => [
    {
        name: 'intro_wallets',
        component: <WhyWallets />,
        footer: <InitialFooter handleClose={handleClose} handleNext={handleNext} />,
    },
    {
        name: 'ready_to_upgrade',
        component: <ReadyToUpgradeWallets value={is_disabled} toggleCheckbox={toggleCheckbox} />,
        footer: <EndFooter handleBack={handleBack} is_disabled={is_disabled} upgradeToWallets={upgradeToWallets} />,
    },
];

export default WalletSteps;

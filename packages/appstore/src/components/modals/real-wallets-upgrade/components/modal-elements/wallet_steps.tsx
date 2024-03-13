import React from 'react';
import WhyWallets from '../why-wallets';
import { WhyWalletsFooter, ReadyToEnableWalletsFooter } from './wallets-upgrade-footer';
import ReadyToEnableWallets from '../ready-to-enable-wallets';
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
        name: 'why_wallets',
        component: <WhyWallets />,
        footer: <WhyWalletsFooter handleClose={handleClose} handleNext={handleNext} />,
    },
    {
        name: 'ready_to_enable_wallets',
        component: <ReadyToEnableWallets value={is_disabled} toggleCheckbox={toggleCheckbox} />,
        footer: (
            <ReadyToEnableWalletsFooter
                handleBack={handleBack}
                is_disabled={is_disabled}
                upgradeToWallets={upgradeToWallets}
            />
        ),
    },
];

export default WalletSteps;

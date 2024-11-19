import React, { useState } from 'react';

import { useWalletMigration } from '@deriv/hooks';

import IntroducingWalletsEuModal from './wallets-introducing-eu-modal';
import WalletsReadyToEnableEuModal from './wallets-ready-to-enable-eu-modal';

const WalletsEUUpgradeModal = () => {
    const [isReadyToEnableWallets, setIsReadyToEnableWallets] = useState(false);
    const [isMigrationStarted, setIsMigrationStarted] = useState(false);
    const { startMigration } = useWalletMigration();

    const handleIntroducingWalletsButtonClick = () => {
        setIsReadyToEnableWallets(true);
    };

    const handleReadyToEnableWalletsButtonClick = () => {
        setIsMigrationStarted(true);
        setIsReadyToEnableWallets(false);
        startMigration();
    };

    if (isReadyToEnableWallets) {
        return (
            <WalletsReadyToEnableEuModal
                is_open={isReadyToEnableWallets}
                onClickHandler={handleReadyToEnableWalletsButtonClick}
            />
        );
    }

    return (
        <IntroducingWalletsEuModal
            is_open={!isMigrationStarted && !isReadyToEnableWallets}
            onClickHandler={handleIntroducingWalletsButtonClick}
        />
    );
};

export default WalletsEUUpgradeModal;

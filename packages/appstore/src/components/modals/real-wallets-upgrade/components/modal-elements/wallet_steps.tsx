import React from 'react';
import { WalletsIntro } from '../wallets-intro';
import { EndFooter, InitialFooter } from './wallets-upgrade-footer';
import WalletLinkingStep from '../wallet-linking-step/wallet-linking-step';
import ReadyToUpgradeWallets from '../ready-to-upgrade-wallets';
import getMockWalletMigrationResponse from 'Constants/mock_wallet_migration_response';
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
        component: <WalletsIntro current_step={0} />,
        footer: <InitialFooter handleClose={handleClose} handleNext={handleNext} />,
    },
    {
        name: 'intro_wallets',
        component: <WalletsIntro current_step={1} />,
    },
    {
        name: 'intro_wallets',
        component: <WalletsIntro current_step={2} />,
    },
    {
        name: 'linking_step',
        component: <WalletLinkingStep data={getMockWalletMigrationResponse()[0]} />,
    },
    {
        name: 'linking_step',
        component: <WalletLinkingStep data={getMockWalletMigrationResponse()[1]} />,
    },
    {
        name: 'linking_step',
        component: <WalletLinkingStep data={getMockWalletMigrationResponse()[2]} />,
    },
    {
        name: 'ready_to_upgrade',
        component: <ReadyToUpgradeWallets value={is_disabled} toggleCheckbox={toggleCheckbox} />,
        footer: <EndFooter handleBack={handleBack} is_disabled={is_disabled} upgradeToWallets={upgradeToWallets} />,
    },
];

export default WalletSteps;

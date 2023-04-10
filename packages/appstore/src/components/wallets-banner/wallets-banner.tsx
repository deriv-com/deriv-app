import React from 'react';
import { TWalletsMigrationStatus } from 'Types';
import WalletsBannerUpgrade from './wallets-banner-upgrade';
import WalletsBannerUpgrading from './wallets-banner-upgrading';
import WalletsBannerReady from './wallets-banner-ready';

const WalletsBanner = () => {
    // 'ineligible' | 'eligible' | 'in_progress' | 'migrated' | 'failed';
    const migration_status: TWalletsMigrationStatus = 'eligible';

    // the user can upgrade to the wallets
    if (migration_status === 'eligible') return <WalletsBannerUpgrade />;

    // the wallets upgrading is in progress
    // if (migration_status === 'in_progress') return <WalletsBannerUpgrading />;

    // // the wallets upgrading completed
    // if (migration_status === 'migrated') return <WalletsBannerReady />;

    // the user can't upgrade to the wallets (migration_status === 'ineligible')
    return null;
};

export default WalletsBanner;

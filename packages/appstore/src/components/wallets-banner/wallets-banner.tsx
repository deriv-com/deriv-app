import React from 'react';
import WalletsBannerUpgrade from './wallets-banner-upgrade';

type TWalletsMigrationStatus = 'ineligible' | 'eligible' | 'in_progress' | 'migrated' | 'failed';

const WalletsBanner = () => {
    const migration_status: TWalletsMigrationStatus = 'eligible';

    // the user can upgrade to the wallets
    if (migration_status === 'eligible') return <WalletsBannerUpgrade />;

    // the user can't upgrade to the wallets (migration_status === 'ineligible')
    return null;
};

export default WalletsBanner;

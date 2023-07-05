import React from 'react';
import WalletsBannerUpgrade from './wallets-banner-upgrade';
import WalletsBannerUpgrading from './wallets-banner-upgrading';
import WalletsBannerReady from './wallets-banner-ready';
import { useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

const WalletsBanner = observer(() => {
    const { status } = useWalletMigration();
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;

    switch (status) {
        // the user can upgrade to the wallets
        case 'eligible':
        case 'failed':
            return <WalletsBannerUpgrade />;
        // the wallets upgrading is in progress
        case 'in_progress':
            return <WalletsBannerUpgrading is_eu={is_eu_user} />;
        // the wallets upgrading completed
        case 'migrated':
            return <WalletsBannerReady is_eu={is_eu_user} />;
        // the user can't upgrade to the wallets
        default:
            return null;
    }
});

export default WalletsBanner;

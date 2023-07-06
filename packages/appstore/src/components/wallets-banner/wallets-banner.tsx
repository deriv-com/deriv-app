import React from 'react';
import WalletsBannerUpgrade from './wallets-banner-upgrade';
import WalletsBannerUpgrading from './wallets-banner-upgrading';
import WalletsBannerReady from './wallets-banner-ready';
import { useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

const WalletsBanner = observer(() => {
    const { is_eligible, is_failed, is_in_progress, is_ineligible } = useWalletMigration();
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;

    if (is_ineligible) return null;

    if (is_eligible || is_failed) return <WalletsBannerUpgrade />;

    if (is_in_progress) return <WalletsBannerUpgrading is_eu={is_eu_user} />;

    return <WalletsBannerReady is_eu={is_eu_user} />;
});

export default WalletsBanner;

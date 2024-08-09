import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { useGrowthbookGetFeatureValue, useWalletMigration } from '@deriv/hooks';
import BookBanner from 'Components/banners/book-banner';

const WalletsBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(/* webpackChunkName: "Components_banners_wallets-banner" */ 'Components/banners/wallets-banner')
        ),
    () => <Loading />
)();

const RealAccountCreationBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "Components_banners_real-account-creation-banner" */ 'Components/banners/real-account-creation-banner'
                )
        ),
    () => <Loading />
)();

const TradersHubBanners = observer(() => {
    const { client, traders_hub } = useStore();
    const { is_landing_company_loaded, has_any_real_account, is_eu } = client;
    const { is_real } = traders_hub;

    const [ff_real_account_creation_banner] = useGrowthbookGetFeatureValue({
        featureFlag: 'traders-hub-real-account-banner',
        defaultValue: false,
    });

    const { is_eligible, is_in_progress, is_migrated, is_failed } = useWalletMigration();
    const should_show_wallets_banner = is_eligible || is_in_progress || is_migrated || is_failed;
    const should_show_real_account_creation_banner =
        ff_real_account_creation_banner && !has_any_real_account && !is_eu && is_landing_company_loaded;
    const should_add_empty_div_for_get_started_trading_banner_clever_tap = has_any_real_account && is_real;

    return (
        <React.Fragment>
            {should_add_empty_div_for_get_started_trading_banner_clever_tap && (
                <div className='get-started-trading-banner-ct' />
            )}
            {should_show_real_account_creation_banner && <RealAccountCreationBanner />}
            <BookBanner />
            {should_show_wallets_banner && <WalletsBanner />}
        </React.Fragment>
    );
});

export default TradersHubBanners;

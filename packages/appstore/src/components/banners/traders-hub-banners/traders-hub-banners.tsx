import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { useGrowthbookGetFeatureValue, useStoreHasAccountDeposited } from '@deriv/hooks';
import BookBanner from 'Components/banners/book-banner';
import WalletsBanner from 'Components/banners/wallets-banner';
// import DepositNowBanner from 'Components/banners/deposit-now-banner';

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

const DepositNowBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "Components_banners_deposit-now-banner" */ 'Components/banners/deposit-now-banner'
                )
        ),
    () => <Loading />
)();

const TradersHubBanners = observer(() => {
    const { client } = useStore();
    const { is_landing_company_loaded, has_any_real_account, is_eu } = client;
    const { hasDeposited, hasTransferred } = useStoreHasAccountDeposited();

    // ff: traders-hub-real-account-banner
    // banner_name: real_account_cta
    // banner_type: with_cta,

    const [ff_real_account_creation_banner] = useGrowthbookGetFeatureValue({
        featureFlag: 'traders-hub-real-account-banner',
        defaultValue: false,
    });

    // ff: traders-hub-deposit-now-banner
    // banner_name: first_deposit_cta
    // banner_type: with_cta,

    const [ff_first_deposit_banner] = useGrowthbookGetFeatureValue({
        featureFlag: 'traders_hub_first_deposit_banner',
        defaultValue: false,
    });

    const should_add_empty_div_for_get_started_trading_banner_clever_tap = has_any_real_account;
    const should_show_real_account_creation_banner =
        ff_real_account_creation_banner && !has_any_real_account && !is_eu && is_landing_company_loaded;
    // const should_show_deposit_now_banner = ff_first_deposit_banner && !hasDeposited && !hasTransferred;
    const should_show_deposit_now_banner = !hasDeposited && !hasTransferred;

    return (
        <React.Fragment>
            {should_add_empty_div_for_get_started_trading_banner_clever_tap && (
                <div className='get-started-trading-banner-ct' />
            )}
            {should_show_real_account_creation_banner && <RealAccountCreationBanner />}
            {should_show_deposit_now_banner && <DepositNowBanner />}
            <BookBanner />
            <WalletsBanner />
        </React.Fragment>
    );
});

export default TradersHubBanners;

import React from 'react';
import { Analytics } from '@deriv/analytics';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import {
    getMT5AccountTitle,
    JURISDICTION_MARKET_TYPES,
    Jurisdiction,
    getFormattedJurisdictionMarketTypes,
    getCFDPlatformNames,
    CFD_PLATFORMS,
} from '@deriv/shared';
import TradersHubBannerImage from './traders-hub-banner-image';
import { platform } from 'os';

const MigrationBanner = observer(() => {
    const {
        ui,
        modules: { cfd },
    } = useStore();
    const { is_mobile, toggleMT5MigrationModal } = ui;
    const { setMT5MigrationError } = cfd;

    const { has_derived_mt5_to_migrate, has_derived_and_financial_mt5 } = useMT5SVGEligibleToMigrate();

    const image = is_mobile ? 'migrate_mobile' : 'migrate_desktop';
    const size = 'xs';

    const openMT5MigrationModal = () => {
        setMT5MigrationError('');
        Analytics.trackEvent('ce_upgrade_mt5_banner', {
            action: 'push_cta_upgrade',
        });
        toggleMT5MigrationModal();
    };

    return (
        <div className='traders-hub-banner__container traders-hub-banner__migrate-banner'>
            <div className='traders-hub-banner__migrate-banner-description'>
                <div className='traders-hub-banner__migrate-banner-description__text'>
                    {!has_derived_and_financial_mt5 ? (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='Upgrade your <0>{{account_1}}</0> <1/>and <0>{{account_2}} {{platform}} </0> account(s)'
                                values={{
                                    account_1: getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.DERIVED),
                                    account_2: getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.FINANCIAL),
                                    platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                                }}
                                components={[<strong key={0} />, <br key={1} />]}
                            />
                        </Text>
                    ) : (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='Upgrade your <1/><0>{{account_title}} {{platform}} </0> account(s)'
                                values={{
                                    account_title: getFormattedJurisdictionMarketTypes(
                                        has_derived_mt5_to_migrate
                                            ? JURISDICTION_MARKET_TYPES.DERIVED
                                            : JURISDICTION_MARKET_TYPES.FINANCIAL
                                    ),
                                    platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                                }}
                                components={[<strong key={0} />, <br key={1} />]}
                            />
                        </Text>
                    )}
                </div>
                <Button primary_light onClick={openMT5MigrationModal}>
                    <Localize i18n_default_text='Upgrade' />
                </Button>
            </div>
            <TradersHubBannerImage image={image} class_name='traders-hub-banner__image' />
        </div>
    );
});

export default MigrationBanner;

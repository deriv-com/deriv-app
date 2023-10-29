import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import {
    CFD_PLATFORMS,
    getCFDPlatformNames,
    Jurisdiction,
    getFormattedJurisdictionMarketTypes,
    getFormattedJurisdictionCode,
    JURISDICTION_MARKET_TYPES,
} from '@deriv/shared';
import AppstoreBannerImage from './appstore-banner-image';

const SVGMigrationBanner = observer(() => {
    const {
        ui,
        modules: { cfd },
    } = useStore();
    const {
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    } = useMT5SVGEligibleToMigrate();
    const { is_mobile, toggleMT5MigrationModal } = ui;
    const { setMT5MigrationError } = cfd;
    const has_derived_mt5_to_migrate = eligible_svg_to_bvi_derived_accounts || eligible_svg_to_vanuatu_derived_accounts;
    const has_financial_mt5_to_migrate =
        eligible_svg_to_bvi_financial_accounts || eligible_svg_to_vanuatu_financial_accounts;
    const has_derived_and_financial_mt5 = has_derived_mt5_to_migrate && has_financial_mt5_to_migrate;
    const image = is_mobile ? 'svg_migrate_mobile' : 'svg_migrate_desktop';
    const size: string = is_mobile ? 'xs' : 'm';

    const getAccountTitle = (account_to_migrate: typeof Jurisdiction[keyof typeof Jurisdiction]) =>
        `${getCFDPlatformNames(CFD_PLATFORMS.MT5)} ${getFormattedJurisdictionMarketTypes(
            account_to_migrate
        )} ${getFormattedJurisdictionCode(Jurisdiction.SVG)}`;

    const openMT5MigrationModal = () => {
        setMT5MigrationError('');
        toggleMT5MigrationModal();
    };

    return (
        <div className='appstore-banner__container appstore-banner__svg-migrate-banner'>
            <div className='appstore-banner__svg-migrate-banner-description'>
                <div className='appstore-banner__svg-migrate-banner-description__text'>
                    {!has_derived_and_financial_mt5 ? (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='We’re upgrading your <0>{{account_1}}</0> and <0>{{account_2}} </0> account.'
                                values={{
                                    account_1: getAccountTitle(JURISDICTION_MARKET_TYPES.DERIVED),
                                    account_2: getAccountTitle(JURISDICTION_MARKET_TYPES.FINANCIAL),
                                }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    ) : (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='We’re upgrading your <0>{{account_title}}</0> account.'
                                values={{
                                    account_title: getAccountTitle(
                                        has_derived_mt5_to_migrate
                                            ? JURISDICTION_MARKET_TYPES.DERIVED
                                            : JURISDICTION_MARKET_TYPES.FINANCIAL
                                    ),
                                }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    )}
                </div>
                <Button
                    className='appstore-banner__svg-migrate-banner-button'
                    primary
                    large
                    onClick={openMT5MigrationModal}
                >
                    <Localize i18n_default_text='Upgrade now' />
                </Button>
            </div>
            <div className='appstore-banner__svg-migrate-banner-overlay' />
            <AppstoreBannerImage image={image} class_name='appstore-banner__image' />
        </div>
    );
});

export default SVGMigrationBanner;

import React from 'react';
import { Analytics } from '@deriv/analytics';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { getMT5AccountTitle, JURISDICTION_MARKET_TYPES, Jurisdiction } from '@deriv/shared';
import TradersHubBannerImage from './traders-hub-banner-image';

const MigrationBanner = observer(() => {
    const {
        ui,
        modules: { cfd },
    } = useStore();
    const { is_mobile, toggleMT5MigrationModal } = ui;
    const { setMT5MigrationError } = cfd;

    const { has_derived_mt5_to_migrate, has_derived_and_financial_mt5 } = useMT5SVGEligibleToMigrate();

    const image = is_mobile ? 'migrate_mobile' : 'migrate_desktop';
    const size = is_mobile ? 'xs' : 'm';

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
                    {has_derived_and_financial_mt5 ? (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='We’re upgrading your <0>{{account_1}}</0> and <0>{{account_2}} </0> accounts.'
                                values={{
                                    account_1: getMT5AccountTitle({
                                        account_type: JURISDICTION_MARKET_TYPES.DERIVED,
                                        jurisdiction: Jurisdiction.SVG,
                                    }),
                                    account_2: getMT5AccountTitle({
                                        account_type: JURISDICTION_MARKET_TYPES.FINANCIAL,
                                        jurisdiction: Jurisdiction.SVG,
                                    }),
                                }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    ) : (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='We’re upgrading your <0>{{account_title}}</0> account.'
                                values={{
                                    account_title: getMT5AccountTitle({
                                        account_type: has_derived_mt5_to_migrate
                                            ? JURISDICTION_MARKET_TYPES.DERIVED
                                            : JURISDICTION_MARKET_TYPES.FINANCIAL,
                                        jurisdiction: Jurisdiction.SVG,
                                    }),
                                }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    )}
                </div>
                <Button
                    className='traders-hub-banner__migrate-banner-button'
                    primary
                    large
                    onClick={openMT5MigrationModal}
                >
                    <Localize i18n_default_text='Upgrade now' />
                </Button>
            </div>
            <TradersHubBannerImage image={image} class_name='traders-hub-banner__image' />
        </div>
    );
});

export default MigrationBanner;

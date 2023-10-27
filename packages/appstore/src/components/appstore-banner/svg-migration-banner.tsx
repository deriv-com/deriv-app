import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import AppstoreBannerImage from './appstore-banner-image';

const SVGMigrationBanner = observer(() => {
    const {
        ui,
        modules: { cfd },
    } = useStore();
    const { is_mobile, toggleMT5MigrationModal } = ui;
    const { setMT5MigrationError } = cfd;

    const { has_derived_mt5_to_migrate, has_derived_and_financial_mt5 } = useMT5SVGEligibleToMigrate();

    const image = is_mobile ? 'svg_migrate_mobile' : 'svg_migrate_desktop';
    const size = is_mobile ? 'xs' : 'm';

    const getAccountTitle = () => {
        return has_derived_mt5_to_migrate ? 'MT5 Derived SVG' : 'MT5 Financial SVG';
    };

    const openMT5MigrationModal = () => {
        setMT5MigrationError('');
        toggleMT5MigrationModal();
    };

    return (
        <div className='appstore-banner__container appstore-banner__svg-migrate-banner'>
            <div className='appstore-banner__svg-migrate-banner-description'>
                <div className='appstore-banner__svg-migrate-banner-description__text'>
                    {has_derived_and_financial_mt5 ? (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='We’re upgrading your <0>MT5 Derived SVG</0> and <0>MT5 Financial SVG</0> account.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    ) : (
                        <Text size={size}>
                            <Localize
                                i18n_default_text='We’re upgrading your <0>{{account_title}}</0> account.'
                                values={{
                                    account_title: getAccountTitle(),
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

import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import AppstoreBannerImage from './appstore-banner-image';

const SVGMigrationBanner = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    //TODO: Will add condition check for svg deriv mt5 and svg financial mt5 when API is ready
    const is_deriv_mt5 = true;
    const is_financial_mt5 = true;
    const is_deriv_financial_mt5 = is_deriv_mt5 && is_financial_mt5;
    const image = is_mobile ? 'svg_migrate_mobile' : 'svg_migrate_desktop';
    const size: string = is_mobile ? 'xs' : 'm';

    const getAccountTitle = () => {
        return is_deriv_mt5 ? 'MT5 Derived SVG' : 'MT5 Financial SVG';
    };

    return (
        <div className='appstore-banner__container appstore-banner__svg-migrate-banner'>
            <div className='appstore-banner__svg-migrate-banner-description'>
                <div className='appstore-banner__svg-migrate-banner-description__text'>
                    {is_deriv_financial_mt5 ? (
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
                <Button className='appstore-banner__svg-migrate-banner-button' primary large onClick={() => null}>
                    <Localize i18n_default_text='Upgrade now' />
                </Button>
            </div>
            <AppstoreBannerImage image={image} className='appstore-banner__image' />
        </div>
    );
});

export default SVGMigrationBanner;

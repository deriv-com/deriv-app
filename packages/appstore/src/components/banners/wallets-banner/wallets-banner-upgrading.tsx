import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import { cacheTrackEvents } from '@deriv/shared';

const WalletsBannerUpgrading = observer(() => {
    const { traders_hub, common } = useStore();
    const { is_demo } = traders_hub;
    const { current_language } = common;
    const { isDesktop, isMobile, isTablet } = useDevice();
    let titleFontSize, descriptionFontSize, iconHeight, iconWidth;

    if (isTablet) {
        titleFontSize = 's';
        descriptionFontSize = 'xxs';
        iconHeight = 98;
        iconWidth = 234;
    } else if (isDesktop) {
        titleFontSize = 'sm';
        descriptionFontSize = 'xs';
        iconHeight = 154;
        iconWidth = 368;
    } else {
        titleFontSize = 'xs';
        descriptionFontSize = 'xxxs';
        iconHeight = 138;
        iconWidth = 156;
    }

    React.useEffect(() => {
        cacheTrackEvents.loadEvent([
            {
                event: {
                    name: 'ce_tradershub_banner',
                    properties: {
                        action: 'open',
                        form_name: 'ce_tradershub_banner',
                        account_mode: is_demo ? 'demo' : 'real',
                        banner_name: 'setting_up_wallets_step_2',
                        banner_type: 'without_url',
                    },
                },
            },
        ]);
    }, [is_demo]);

    return (
        <div className='wallets-banner wallets-banner-upgrading' key={`wallets-banner__${current_language}--upgrading`}>
            <div className='wallets-banner__content wallets-banner-upgrading__content'>
                <div className='wallets-banner-upgrading__loading' data-testid='dt_wallets_loading_dots'>
                    <span className='wallets-banner-upgrading__dot' />
                    <span className='wallets-banner-upgrading__dot' />
                    <span className='wallets-banner-upgrading__dot' />
                </div>
                <Localize
                    i18n_default_text="<0>We're setting up your Wallets</0>"
                    components={[
                        <Text key={0} line_height={!isMobile ? 'm' : 's'} size={titleFontSize} weight='bold' />,
                    ]}
                />
                <Localize
                    i18n_default_text='<0>This may take up to 2 minutes. During this time, some services may be unavailable.</0>'
                    components={[
                        <Text
                            className='wallets-banner-upgrading__description'
                            key={0}
                            line_height='s'
                            size={descriptionFontSize}
                        />,
                    ]}
                />
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${isMobile ? '' : 'Horizontal'}`}
                width={iconWidth}
                height={iconHeight}
                className='wallets-banner-upgrading__image'
                data_testid={`dt_wallets_upgrade_coins${isMobile ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrading;

import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const WalletsBannerUpgrading = observer(() => {
    const { isDesktop, isMobile, isTablet } = useDevice();
    let titleFontSize, descriptionFontSize, iconHeight, iconWidth;

    if (isMobile) {
        titleFontSize = 'xs';
        descriptionFontSize = 'xxxs';
        iconHeight = 196;
        iconWidth = 196;
    } else if (isTablet) {
        titleFontSize = 's';
        descriptionFontSize = 'xxs';
        iconHeight = 110;
        iconWidth = 268;
    } else if (isDesktop) {
        titleFontSize = 'sm';
        descriptionFontSize = 'xs';
        iconHeight = 148;
        iconWidth = 360;
    }

    return (
        <div className='wallets-banner wallets-banner-upgrading'>
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

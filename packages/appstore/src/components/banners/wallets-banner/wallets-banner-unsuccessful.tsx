import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const WalletsBannerUnsuccessful = observer(() => {
    const { traders_hub } = useStore();
    const { isDesktop, isMobile, isTablet } = useDevice();
    const { toggleWalletsUpgrade } = traders_hub;
    let titleFontSize, descriptionFontSize, iconHeight, iconWidth;

    if (isMobile) {
        titleFontSize = 'xs';
        descriptionFontSize = 'xxxs';
        iconHeight = '100%';
        iconWidth = 216;
    } else if (isTablet) {
        titleFontSize = 's';
        descriptionFontSize = 'xxs';
        iconHeight = 110;
        iconWidth = 220;
    } else if (isDesktop) {
        titleFontSize = 'sm';
        descriptionFontSize = 'xs';
        iconHeight = 148;
        iconWidth = 360;
    }

    return (
        <div className='wallets-banner wallets-banner-unsuccessful'>
            <div className='wallets-banner__content wallets-banner-unsuccessful__content'>
                <Localize
                    i18n_default_text='<0>Setup unsuccessful</0>'
                    components={[
                        <Text key={0} line_height={!isMobile ? 'm' : 's'} size={titleFontSize} weight='bold' />,
                    ]}
                />
                <div>
                    <Localize
                        i18n_default_text='<0>We’re unable to upgrade you to Wallets at this time and are working to get this fixed as soon as we can. Please </0><1>try again</1><0>.</0>'
                        components={[
                            <Text key={0} line_height='s' size={descriptionFontSize} />,
                            <Text
                                key={1}
                                className='wallets-banner-unsuccessful__clickable-text'
                                color='red'
                                line_height='s'
                                size={descriptionFontSize}
                                weight='bold'
                                onClick={() => toggleWalletsUpgrade(true)}
                            />,
                        ]}
                    />
                </div>
            </div>
            <Icon
                icon='IcAppstoreWalletsUpgradeUnsuccessful'
                width={iconWidth}
                height={iconHeight}
                className='wallets-banner-unsuccessful__image'
                data_testid='dt_wallets_upgrade_unsuccessful'
            />
        </div>
    );
});

export default WalletsBannerUnsuccessful;

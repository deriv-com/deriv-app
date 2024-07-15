import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const WalletsBannerUpgrade = observer(() => {
    const { traders_hub } = useStore();
    const { isDesktop, isMobile, isTablet } = useDevice();
    const { toggleWalletsUpgrade } = traders_hub;
    let titleFontSize, iconHeight, iconWidth;

    if (isMobile) {
        titleFontSize = 'xs';
        iconHeight = 196;
        iconWidth = 196;
    } else if (isTablet) {
        titleFontSize = 'xsm';
        iconHeight = 110;
        iconWidth = 268;
    } else if (isDesktop) {
        titleFontSize = 'm';
        iconHeight = 148;
        iconWidth = 360;
    }

    return (
        <div className='wallets-banner wallets-banner-upgrade'>
            <div className='wallets-banner__content wallets-banner-upgrade__content'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[
                            <Text key={0} weight='bold' size={titleFontSize} />,
                            <Text key={1} size={titleFontSize} />,
                        ]}
                    />
                </div>
                <Button
                    className='wallets-banner-upgrade__button'
                    text={localize("Let's go")}
                    primary
                    large
                    onClick={() => toggleWalletsUpgrade(true)}
                />
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${isMobile ? '' : 'Horizontal'}`}
                width={iconWidth}
                height={iconHeight}
                className='wallets-banner-upgrade__image'
                data_testid={`dt_wallets_upgrade_coins${isMobile ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrade;

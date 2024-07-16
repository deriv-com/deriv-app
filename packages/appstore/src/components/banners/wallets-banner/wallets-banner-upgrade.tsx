import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

type TStyles = {
    titleFontSize: string;
    iconHeight: number;
    iconWidth: number;
};

const WalletsBannerUpgrade = observer(() => {
    const { traders_hub } = useStore();
    const { isMobile, isTablet } = useDevice();
    const { toggleWalletsUpgrade } = traders_hub;

    const styles: TStyles = {
        titleFontSize: 'm',
        iconHeight: 148,
        iconWidth: 360,
    };

    if (isMobile) {
        styles.titleFontSize = 'xs';
        styles.iconHeight = 196;
        styles.iconWidth = 196;
    } else if (isTablet) {
        styles.titleFontSize = 'xsm';
        styles.iconHeight = 110;
        styles.iconWidth = 268;
    }

    return (
        <div className='wallets-banner wallets-banner-upgrade'>
            <div className='wallets-banner__content wallets-banner-upgrade__content'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[
                            <Text key={0} weight='bold' size={styles.titleFontSize} />,
                            <Text key={1} size={styles.titleFontSize} />,
                        ]}
                    />
                </div>
                <Button
                    className='wallets-banner-upgrade__button'
                    primary
                    large
                    onClick={() => toggleWalletsUpgrade(true)}
                >
                    <Localize i18n_default_text="Let's go" />
                </Button>
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${isMobile ? '' : 'Horizontal'}`}
                width={styles.iconWidth}
                height={styles.iconHeight}
                className='wallets-banner-upgrade__image'
                data_testid={`dt_wallets_upgrade_coins${isMobile ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrade;

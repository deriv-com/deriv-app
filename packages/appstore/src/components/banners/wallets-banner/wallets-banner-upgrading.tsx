import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

type TStyles = {
    titleFontSize: string;
    descriptionFontSize: string;
    iconHeight: number | string;
    iconWidth: number;
};

const WalletsBannerUpgrading = observer(() => {
    const { isMobile, isTablet } = useDevice();
    const styles: TStyles = {
        titleFontSize: 'sm',
        descriptionFontSize: 'xs',
        iconHeight: 148,
        iconWidth: 360,
    };

    if (isMobile) {
        styles.titleFontSize = 'xs';
        styles.descriptionFontSize = 'xxxs';
        styles.iconHeight = 196;
        styles.iconWidth = 196;
    } else if (isTablet) {
        styles.titleFontSize = 's';
        styles.descriptionFontSize = 'xxs';
        styles.iconHeight = 110;
        styles.iconWidth = 268;
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
                        <Text key={0} line_height={!isMobile ? 'm' : 's'} size={styles.titleFontSize} weight='bold' />,
                    ]}
                />
                <Localize
                    i18n_default_text='<0>This may take up to 2 minutes. During this time, some services may be unavailable.</0>'
                    components={[
                        <Text
                            className='wallets-banner-upgrading__description'
                            key={0}
                            line_height='s'
                            size={styles.descriptionFontSize}
                        />,
                    ]}
                />
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${isMobile ? '' : 'Horizontal'}`}
                width={styles.iconWidth}
                height={styles.iconHeight}
                className='wallets-banner-upgrading__image'
                data_testid={`dt_wallets_upgrade_coins${isMobile ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrading;

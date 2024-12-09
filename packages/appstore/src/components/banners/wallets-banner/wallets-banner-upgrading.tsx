import React from 'react';
import classNames from 'classnames';

import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

const getIconName = (is_eu: boolean, is_mobile: boolean, is_rtl: boolean) => {
    if (is_eu) {
        if (is_mobile) {
            return is_rtl ? 'IcAppstoreWalletsEuUpgradeCoinsRtl' : 'IcAppstoreWalletsEuUpgradeCoinsLtr';
        }
        return 'IcAppstoreWalletsEuUpgradeCoinsHorizontal';
    }

    return is_mobile ? 'IcAppstoreWalletsUpgradeCoins' : 'IcAppstoreWalletsUpgradeCoinsHorizontal';
};

const getDataTestId = (is_eu: boolean, is_mobile: boolean, is_rtl: boolean) => {
    if (is_eu) {
        if (is_mobile) {
            return is_rtl ? 'dt_wallets_eu_upgrade_coins_rtl' : 'dt_wallets_eu_upgrade_coins_ltr';
        }
        return 'dt_wallets_eu_upgrade_coins_horizontal';
    }
    return is_mobile ? 'dt_wallets_upgrade_coins' : 'dt_wallets_upgrade_coins_horizontal';
};

const WalletsBannerUpgrading = observer(() => {
    const { traders_hub, client, common } = useStore();
    const { is_demo } = traders_hub;
    const { current_language } = common;
    const { is_eu } = client;
    const { isDesktop, isMobile, isTablet } = useDevice();
    const { instance: i18n } = useTranslations();
    const is_rtl = i18n.dir(i18n.language?.toLowerCase()) === 'rtl';

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
        Analytics.trackEvent('ce_tradershub_banner', {
            action: 'open',
            form_name: 'ce_tradershub_banner',
            account_mode: is_demo ? 'demo' : 'real',
            banner_name: 'setting_up_wallets_step_2',
            banner_type: 'without_url',
        });
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
                icon={getIconName(is_eu, isMobile, is_rtl)}
                width={iconWidth}
                height={iconHeight}
                className={classNames('wallets-banner-upgrading__image', {
                    'wallets-banner-upgrading__image--eu': is_eu,
                })}
                data_testid={getDataTestId(is_eu, isMobile, is_rtl)}
            />
        </div>
    );
});

export default WalletsBannerUpgrading;

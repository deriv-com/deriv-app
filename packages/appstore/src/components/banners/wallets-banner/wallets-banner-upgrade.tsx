import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const trackAnalyticsEvent = (
    action: TEvents['ce_tradershub_banner']['action'],
    account_mode: TEvents['ce_tradershub_banner']['account_mode']
) => {
    Analytics.trackEvent('ce_tradershub_banner', {
        action,
        form_name: 'ce_tradershub_banner',
        account_mode,
        banner_name: 'lets_go_wallets_step_1_2',
        banner_type: 'with_cta',
    });
};

type TProps = {
    is_upgrading: boolean;
};

const WalletsBannerUpgrade: React.FC<TProps> = observer(({ is_upgrading }) => {
    const { traders_hub, common } = useStore();
    const { isDesktop, isMobile, isTablet } = useDevice();
    const { is_demo, toggleWalletsUpgrade } = traders_hub;
    const { current_language } = common;
    const account_mode = is_demo ? 'demo' : 'real';
    let titleFontSize, iconHeight, iconWidth;

    if (isTablet) {
        titleFontSize = 'xsm';
        iconHeight = 98;
        iconWidth = 234;
    } else if (isDesktop) {
        titleFontSize = 'm';
        iconHeight = 154;
        iconWidth = 368;
    } else {
        titleFontSize = 'xs';
        iconHeight = 138;
        iconWidth = 156;
    }

    React.useEffect(() => {
        trackAnalyticsEvent('open', account_mode);
    }, [account_mode]);

    const onWalletsUpgradeHandler = () => {
        toggleWalletsUpgrade(true);
        trackAnalyticsEvent('click_cta', account_mode);
    };

    return (
        <div className='wallets-banner wallets-banner-upgrade' key={`wallets-banner__${current_language}--upgrade`}>
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
                    is_disabled={is_upgrading}
                    text={localize("Let's go")}
                    primary
                    large
                    onClick={onWalletsUpgradeHandler}
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

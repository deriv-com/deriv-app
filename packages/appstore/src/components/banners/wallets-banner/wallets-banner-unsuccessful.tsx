import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const trackAnalyticsEvent = (
    action: TEvents['ce_tradershub_banner']['action'],
    account_mode: TEvents['ce_tradershub_banner']['account_mode']
) => {
    Analytics.trackEvent('ce_tradershub_banner', {
        action,
        form_name: 'ce_tradershub_banner',
        account_mode,
        banner_name: 'setup_unsuccessful_wallets_step_3_2',
        banner_type: 'with_cta',
    });
};

const WalletsBannerUnsuccessful = observer(() => {
    const { traders_hub, common } = useStore();
    const { isDesktop, isMobile, isTablet } = useDevice();
    const { is_demo, toggleWalletsUpgrade } = traders_hub;
    const { current_language } = common;
    const account_mode = is_demo ? 'demo' : 'real';
    let titleFontSize, descriptionFontSize, iconHeight, iconWidth;

    if (isTablet) {
        titleFontSize = 's';
        descriptionFontSize = 'xxs';
        iconHeight = 112;
        iconWidth = 192;
    } else if (isDesktop) {
        titleFontSize = 'sm';
        descriptionFontSize = 'xs';
        iconHeight = 142;
        iconWidth = 242;
    } else {
        titleFontSize = 'xs';
        descriptionFontSize = 'xxxs';
        iconHeight = 112;
        iconWidth = 192;
    }

    React.useEffect(() => {
        trackAnalyticsEvent('open', account_mode);
    }, [account_mode]);

    const onWalletsUpgradeHandler = () => {
        toggleWalletsUpgrade(true);
        trackAnalyticsEvent('click_cta', account_mode);
    };

    return (
        <div
            className='wallets-banner wallets-banner-unsuccessful'
            key={`wallets-banner__${current_language}--unsuccessful`}
        >
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
                                onClick={onWalletsUpgradeHandler}
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

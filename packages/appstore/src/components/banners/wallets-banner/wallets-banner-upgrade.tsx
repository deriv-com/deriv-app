import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

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
    const { traders_hub, ui } = useStore();
    const { is_desktop, is_mobile } = ui;
    const { is_demo, toggleWalletsUpgrade } = traders_hub;
    const account_mode = is_demo ? 'demo' : 'real';

    React.useEffect(() => {
        trackAnalyticsEvent('open', account_mode);
    }, [account_mode]);

    const onWalletsUpgradeHandler = () => {
        toggleWalletsUpgrade(true);
        trackAnalyticsEvent('click_cta', account_mode);
    };

    return (
        <div className='wallets-banner wallets-banner-upgrade'>
            <div className='wallets-banner__content wallets-banner-upgrade__content'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[
                            <Text key={0} weight='bold' size={is_desktop ? 'm' : 'xs'} />,
                            <Text key={1} size={is_desktop ? 'm' : 'xs'} />,
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
                icon={`IcAppstoreWalletsUpgradeCoins${is_desktop ? 'Horizontal' : ''}`}
                width={is_desktop ? 448 : 220}
                height={is_desktop ? '100%' : 220}
                className='wallets-banner-upgrade__image'
                data_testid={`dt_wallets_upgrade_coins${is_mobile ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrade;

import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Button, Text, Icon } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import TrustpilotWidget from 'Components/trustpilot-widget';
import './get-started-trading-banner.scss';

const GetStartedTradingBanner = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='get-started-trading-banner'>
            <div className='wallets-banner__container wallets-banner-upgrade'>
                <div className='wallets-banner__content wallets-banner-upgrade__content'>
                    <div>
                        <Text key={0} size={is_mobile ? 'xs' : 'm'}>
                            <Localize i18n_default_text='Join over 2.5 million traders' />
                        </Text>
                    </div>
                    <Button
                        className='wallets-banner-upgrade__button'
                        text={localize('Get Started')}
                        primary
                        large
                        // onClick={() => {}}
                    />
                </div>
                {/* packages/components/src/components/icon/appstore/ic-appstore-logged-out-non-eu-coins-desktop.svg */}
                <Icon
                    icon={`IcAppstoreLoggedOutNonEuCoins${is_mobile ? 'Responsive' : 'Desktop'}`}
                    width={is_mobile ? 220 : 448}
                    height={is_mobile ? 220 : '100%'}
                    className='wallets-banner-upgrade__image'
                    // data_testid={`dt_wallets_upgrade_coins${is_mobile ? '' : '_horizontal'}`}
                />
            </div>
            <TrustpilotWidget />
        </div>
    );
});

export default GetStartedTradingBanner;

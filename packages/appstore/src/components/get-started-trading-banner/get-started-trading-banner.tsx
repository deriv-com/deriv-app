import React from 'react';
import { getLanguage, Localize, localize } from '@deriv/translations';
import { Button, Text, Icon } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { redirectToLogin } from '@deriv/shared';
import TrustpilotWidget from 'Components/trustpilot-widget';
import './get-started-trading-banner.scss';

const GetStartedTradingBanner = observer(() => {
    const { ui, traders_hub } = useStore();
    const { is_mobile } = ui;
    const { is_eu_user } = traders_hub;

    const desktopWidth = is_eu_user ? 326 : 445;
    const desktopHeight = is_eu_user ? 174 : 176;
    const responsiveWidth = 180;
    const responsiveHeight = 116;

    return (
        <div className='get-started-trading-banner'>
            <div className='get-started-trading-banner__content'>
                <div className='get-started-trading-banner__description'>
                    <Text size={is_mobile ? 'xs' : 'xm'} color='prominent'>
                        <Localize i18n_default_text='Join over 2.5 million traders' />
                    </Text>
                    <Button
                        className='get-started-trading-banner__button'
                        text={localize('Get Started')}
                        black
                        large
                        onClick={() => redirectToLogin(false, getLanguage())}
                    />
                </div>
                <Icon
                    icon={`IcAppstoreLoggedOut${is_eu_user ? 'Eu' : 'NonEu'}Coins${
                        is_mobile ? 'Responsive' : 'Desktop'
                    }`}
                    width={is_mobile ? responsiveWidth : desktopWidth}
                    height={is_mobile ? responsiveHeight : desktopHeight}
                    className='get-started-trading-banner__image'
                    data_testid={`dt_logged_out_${is_eu_user ? 'eu' : 'non_eu'}_coins_${
                        is_mobile ? 'responsive' : 'desktop'
                    }`}
                />
            </div>
            <TrustpilotWidget />
        </div>
    );
});

export default GetStartedTradingBanner;

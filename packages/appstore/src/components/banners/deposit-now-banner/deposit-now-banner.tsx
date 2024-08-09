import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';
import { Button, Text, Icon } from '@deriv/components';
// import { useStore, observer } from '@deriv/stores';
import { routes } from '@deriv/shared';
import './deposit-now-banner.scss';

const DepositNowBanner = () => {
    const { isDesktop } = useDevice();
    const history = useHistory();

    // const desktopWidth = is_eu_user ? 326 : 445;
    // const desktopHeight = is_eu_user ? 174 : 176;
    // const responsiveWidth = 180;
    // const responsiveHeight = 116;

    const desktopWidth = 368;
    const desktopHeight = 154;
    const responsiveWidth = 156;
    const responsiveHeight = 138;

    return (
        <div className='deposit-now-banner'>
            <div className='deposit-now-banner__content'>
                <div className='deposit-now-banner__description'>
                    <Text size={!isDesktop ? 'xs' : 'm'} color='prominent'>
                        <Localize i18n_default_text='Make your first deposit to start trading' />
                    </Text>
                    <Button
                        className='deposit-now-banner__button'
                        // black
                        large
                        primary
                        onClick={() => history.push(routes.cashier_deposit)}
                    >
                        <Localize i18n_default_text='Deposit now' />
                    </Button>
                </div>
                <Icon
                    icon={`IcAppstoreLoggedOut${'NonEu'}Coins${!isDesktop ? 'Responsive' : 'Desktop'}`}
                    width={!isDesktop ? responsiveWidth : desktopWidth}
                    height={!isDesktop ? responsiveHeight : desktopHeight}
                    className='deposit-now-banner__image'
                    data_testid={`dt_logged_out_${'non_eu'}_coins_${!isDesktop ? 'responsive' : 'desktop'}`}
                />
            </div>
        </div>
    );
};

export default DepositNowBanner;

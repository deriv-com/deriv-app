import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';
import { Button, Text, Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import './deposit-now-banner.scss';

const DepositNowBanner = observer(() => {
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;

    // const desktopWidth = is_eu_user ? 326 : 445;
    // const desktopHeight = is_eu_user ? 174 : 176;
    // const responsiveWidth = 180;
    // const responsiveHeight = 116;

    const desktopWidth = 368;
    const desktopHeight = 154;
    const responsiveWidth = 115;
    const responsiveHeight = 112;

    return (
        <div className='deposit-now-banner'>
            <div className='deposit-now-banner__content'>
                <div className='deposit-now-banner__description'>
                    <Text size={!isDesktop ? 'xs' : 'm'} color='prominent'>
                        <Localize i18n_default_text='Make your first deposit to start trading' />
                    </Text>
                    <Button
                        className='deposit-now-banner__button'
                        large
                        primary
                        onClick={() => history.push(routes.cashier_deposit)}
                    >
                        <Localize i18n_default_text='Deposit now' />
                    </Button>
                </div>
                <Icon
                    icon={`IcAppstoreDepositNow${is_eu_user ? 'Eu' : 'NonEu'}Coins${
                        isDesktop ? 'Desktop' : 'Responsive'
                    }`}
                    width={isDesktop ? desktopWidth : responsiveWidth}
                    height={isDesktop ? desktopHeight : responsiveHeight}
                    className='deposit-now-banner__image'
                    data_testid={`dt_deposit_now_${is_eu_user ? 'eu' : 'non_eu'}_coins_${
                        isDesktop ? 'desktop' : 'responsive'
                    }`}
                />
            </div>
        </div>
    );
});

export default DepositNowBanner;

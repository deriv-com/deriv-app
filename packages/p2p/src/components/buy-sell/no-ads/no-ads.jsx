import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './no-ads.scss';

const NoAds = () => {
    const { buy_sell_store, my_ads_store } = useStores();

    return (
        <div className='no-ads'>
            <Icon className='no-ads__icon' icon='IcCashierNoAds' size={128} />
            <Text align='center' className='no-ads__text' color='general' line_height='m' size='s' weight='bold'>
                <Localize i18n_default_text='No ads here at the moment.' />
            </Text>
            <Text align='center' color='general' line_height='m' size='s'>
                {buy_sell_store.is_buy ? (
                    <Localize i18n_default_text='Looking to sell USD? Create a Sell ad for others to buy USD from you. Hit the button below to create your ad.' />
                ) : (
                    <Localize i18n_default_text='Looking to buy USD? Create a Buy ad for others to sell USD from you. Hit the button below to create your ad.' />
                )}
            </Text>
            <Button className='no-ads__button' primary large onClick={() => my_ads_store.setShowAdForm(true)}>
                <Localize i18n_default_text='Create ad' />
            </Button>
        </div>
    );
};

export default NoAds;

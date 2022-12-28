import React from 'react';
import { Button, DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './no-ads.scss';

const NoAds = () => {
    const { buy_sell_store, general_store, my_ads_store } = useStores();

    return (
        <div className='no-ads'>
            <Icon icon='IcCashierNoAds' size={128} />
            <Text align='center' className='no-ads__title' color='general' line_height='m' size='s' weight='bold'>
                <Localize i18n_default_text='No ads here at the moment.' />
            </Text>
            <DesktopWrapper>
                <Text className='no-ads__message' align='center' color='general' line_height='m' size='s'>
                    {buy_sell_store.is_buy ? (
                        <Localize i18n_default_text='Looking to sell USD? Create a Sell ad for others to buy USD from you.' />
                    ) : (
                        <Localize i18n_default_text='Looking to buy USD? Create a Buy ad for others to sell USD from you' />
                    )}
                </Text>
            </DesktopWrapper>
            <MobileWrapper>
                <Text className='no-ads__message' align='center' color='general' line_height='m' size='s'>
                    {buy_sell_store.is_buy ? (
                        <Localize i18n_default_text='Looking to sell USD? Create a Sell ad for others to buy USD from you. Hit the button below to create your ad.' />
                    ) : (
                        <Localize i18n_default_text='Looking to buy USD? Create a Buy ad for others to sell USD from you. Hit the button below to create your ad.' />
                    )}
                </Text>
            </MobileWrapper>
            <Button
                className='no-ads__button'
                primary
                large
                onClick={() => {
                    general_store.handleTabClick(2);
                    setTimeout(my_ads_store.setShowAdForm(true), 5000);
                }}
            >
                <Localize i18n_default_text='Create ad' />
            </Button>
        </div>
    );
};

export default NoAds;

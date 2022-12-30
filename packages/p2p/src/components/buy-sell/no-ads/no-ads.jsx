import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './no-ads.scss';

const NoAds = () => {
    const { buy_sell_store, general_store, my_ads_store } = useStores();

    const is_default_currency = buy_sell_store.local_currencies.filter(
        currency =>
            currency.text.toLowerCase() === buy_sell_store.selected_local_currency.toLowerCase() && currency.is_default
    ).length;

    return (
        <div className='no-ads'>
            <Icon icon='IcCashierNoAds' size={128} />
            {is_default_currency ? (
                <React.Fragment>
                    <Text
                        align='center'
                        className='no-ads__title'
                        color='general'
                        line_height='m'
                        size='s'
                        weight='bold'
                    >
                        <Localize i18n_default_text='No ads for this currency the moment 😔' />
                    </Text>
                    <Text className='no-ads__message' align='center' color='general' line_height='m' size='s'>
                        {buy_sell_store.is_buy ? (
                            <Localize i18n_default_text='Looking to sell USD? Create a Sell ad for others to buy USD from you.' />
                        ) : (
                            <Localize i18n_default_text='Looking to buy USD? Create a Buy ad for others to sell you USD.' />
                        )}
                    </Text>
                    <Button
                        className='no-ads__button'
                        primary
                        large
                        onClick={() => {
                            general_store.handleTabClick(2);
                            if (buy_sell_store.is_buy) buy_sell_store.setCreateSellAdFromNoAds(true);
                            my_ads_store.setShowAdForm(true);
                        }}
                    >
                        <Localize i18n_default_text='Create ad' />
                    </Button>
                </React.Fragment>
            ) : (
                <Text align='center' className='no-ads__title' color='general' line_height='m' size='s' weight='bold'>
                    <Localize i18n_default_text='No ads for this currency 😔' />
                </Text>
            )}
        </div>
    );
};

export default NoAds;

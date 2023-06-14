import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';

const BuySellTableNoAds = () => {
    const { buy_sell_store, general_store, my_ads_store } = useStores();
    const { is_buy, local_currencies, selected_local_currency, setCreateSellAdFromNoAds } = buy_sell_store;
    const { handleTabClick, is_barred } = general_store;
    const { setShowAdForm } = my_ads_store;
    const is_default_currency = local_currencies.filter(
        currency => currency.text.toLowerCase() === selected_local_currency.toLowerCase() && currency.is_default
    ).length;

    return (
        <div className='no-ads'>
            <Icon icon='IcCashierNoAds' size={128} />
            {is_default_currency ? (
                <React.Fragment>
                    <Text align='center' className='buy-sell-table-no-ads__title' weight='bold'>
                        <Localize i18n_default_text='No ads for this currency 😞' />
                    </Text>
                    <Text className='no-ads__message' align='center'>
                        <Localize i18n_default_text='Looking to buy or sell USD? You can post your own ad for others to respond.' />
                    </Text>
                    <Button
                        className='buy-sell-table-no-ads__button'
                        disabled={is_barred}
                        primary
                        large
                        onClick={() => {
                            if (!is_barred) {
                                handleTabClick(2);
                                if (is_buy) setCreateSellAdFromNoAds(true);
                                setShowAdForm(true);
                            }
                        }}
                    >
                        <Localize i18n_default_text='Create ad' />
                    </Button>
                </React.Fragment>
            ) : (
                <Text align='center' className='buy-sell-table-no-ads__title' weight='bold'>
                    <Localize i18n_default_text='No ads for this currency at the moment 😞' />
                </Text>
            )}
        </div>
    );
};

export default observer(BuySellTableNoAds);

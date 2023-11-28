import React from 'react';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './no-ads.scss';

const NoAds = ({ is_ads_page = false }) => {
    const { buy_sell_store, general_store, my_ads_store } = useStores();
    const { handleTabClick, is_barred } = general_store;
    const { is_buy, local_currencies, selected_local_currency, setCreateSellAdFromNoAds } = buy_sell_store;
    const { setShowAdForm } = my_ads_store;
    const history = useHistory();

    const is_default_currency = local_currencies.filter(
        currency => currency.text.toLowerCase() === selected_local_currency?.toLowerCase() && currency.is_default
    ).length;

    const onClickButton = () => {
        if (!is_ads_page) handleTabClick(2);
        if (is_buy && !is_ads_page) setCreateSellAdFromNoAds(true);
        setShowAdForm(true);
        history.push(routes.p2p_my_ads);
    };

    return (
        <div className={classNames('no-ads', { 'ads-page': is_ads_page })}>
            <Icon icon='IcCashierNoAds' size={128} />
            {is_default_currency || is_ads_page ? (
                <React.Fragment>
                    <Text align='center' className='no-ads__title' weight='bold'>
                        {is_ads_page ? (
                            <Localize i18n_default_text='You have no ads.' />
                        ) : (
                            <Localize i18n_default_text='No ads for this currency 😞' />
                        )}
                    </Text>
                    <Text className='no-ads__message' align='center'>
                        <Localize i18n_default_text='Looking to buy or sell USD? You can post your own ad for others to respond.' />
                    </Text>
                    <Button className='no-ads__button' disabled={is_barred} primary large onClick={onClickButton}>
                        {is_ads_page ? (
                            <Localize i18n_default_text='Create new ad' />
                        ) : (
                            <Localize i18n_default_text='Create ad' />
                        )}
                    </Button>
                </React.Fragment>
            ) : (
                <Text align='center' className='no-ads__title' weight='bold'>
                    <Localize i18n_default_text='No ads for this currency at the moment 😞' />
                </Text>
            )}
        </div>
    );
};

export default observer(NoAds);

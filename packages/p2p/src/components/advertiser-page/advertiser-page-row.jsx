import PropTypes from 'prop-types';
import React from 'react';
import { Button, Table, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import './advertiser-page.scss';

const AdvertiserPageRow = observer(({ row: advert, showAdPopup }) => {
    const { advertiser_page_store, buy_sell_store, general_store } = useStores();
    const { currency } = general_store.client;
    const { local_currency, max_order_amount_limit_display, min_order_amount_limit_display, price_display } = advert;

    const is_buy_advert = advertiser_page_store.counterparty_type === buy_sell.BUY;
    const is_my_advert = advertiser_page_store.advertiser_details_id === general_store.advertiser_id;

    const showAdForm = () => {
        buy_sell_store.setSelectedAdState(advert);
        showAdPopup(advert);
    };

    return (
        <Table.Row className='advertiser-page__adverts-table_row'>
            <Table.Cell>{`${min_order_amount_limit_display}-${max_order_amount_limit_display} ${currency}`}</Table.Cell>
            <Table.Cell className='advertiser-page__adverts-price'>
                <Text color='profit-success' line-height='m' size='xs' weight='bold'>
                    {price_display} {local_currency}
                </Text>
            </Table.Cell>
            {is_my_advert ? (
                <Table.Cell />
            ) : (
                <Table.Cell className='advertiser-page__adverts-button'>
                    <Button is_disabled={general_store.is_barred} onClick={showAdForm} primary small>
                        {is_buy_advert ? localize('Buy') : localize('Sell')} {currency}
                    </Button>
                </Table.Cell>
            )}
        </Table.Row>
    );
});

AdvertiserPageRow.displayName = 'AdvertiserPageRow';
AdvertiserPageRow.propTypes = {
    advert: PropTypes.object,
    showAdPopup: PropTypes.func,
};

export default AdvertiserPageRow;

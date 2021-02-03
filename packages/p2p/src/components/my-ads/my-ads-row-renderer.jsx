import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, ProgressIndicator } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';

const MyAdsRowRenderer = observer(({ row: advert }) => {
    const { general_store, my_ads_store } = useStores();
    const {
        account_currency,
        amount,
        amount_display,
        id,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        price_display,
        remaining_amount,
        remaining_amount_display,
        type,
    } = advert;

    return (
        <Table.Row className='p2p-my-ads__table-row'>
            <Table.Cell>
                {type === buy_sell.BUY ? (
                    <Localize i18n_default_text='Buy {{ id }}' values={{ id }} />
                ) : (
                    <Localize i18n_default_text='Sell {{ id }}' values={{ id }} />
                )}
            </Table.Cell>
            <Table.Cell>
                {min_order_amount_display}-{max_order_amount_display} {account_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-price'>
                {price_display} {local_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-available'>
                <ProgressIndicator
                    className={'p2p-my-ads__table-available-progress'}
                    value={remaining_amount}
                    total={amount}
                />
                <div className='p2p-my-ads__table-available-value'>
                    {remaining_amount_display}/{amount_display} {account_currency}
                </div>
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-delete'>
                <Icon
                    icon='IcDelete'
                    color={general_store.is_barred && 'disabled'}
                    size={16}
                    onClick={() => !general_store.is_barred && my_ads_store.onClickDelete(advert.id)}
                />
            </Table.Cell>
        </Table.Row>
    );
});

MyAdsRowRenderer.displayName = 'MyAdsRowRenderer';
MyAdsRowRenderer.propTypes = {
    advert: PropTypes.object,
};

export default MyAdsRowRenderer;

import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteDataList, Loading, Table } from '@deriv/components';
import { isMobile, useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import BuySellRow from './buy-sell-row.jsx';
import { buy_sell } from '../../constants/buy-sell';

const BuySellTable = observer(({ is_buy, setSelectedAdvert, showAdvertiserPage }) => {
    const { general_store } = useStores();
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [items, setItems] = React.useState([]);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            loadMoreItems({ startIndex: 0 });
        }
    }, [is_buy]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadMoreItems = ({ startIndex }) => {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: is_buy ? buy_sell.BUY : buy_sell.SELL,
                offset: startIndex,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { list } = response.p2p_advert_list;
                        setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);
                        setItems(items.concat(list));
                    } else {
                        setApiErrorMessage(response.error.message);
                    }
                    setIsLoading(false);
                }

                resolve();
            });
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    const BuySellRowRenderer = row_props => (
        <BuySellRow
            {...row_props}
            is_buy={is_buy}
            setSelectedAdvert={setSelectedAdvert}
            showAdvertiserPage={showAdvertiserPage}
        />
    );
    if (items.length) {
        return (
            <Table className='buy-sell__table'>
                {!isMobile() && (
                    <Table.Header>
                        <Table.Row className='buy-sell__table-header'>
                            <Table.Head>{localize('Advertisers')}</Table.Head>
                            <Table.Head>{localize('Limits')}</Table.Head>
                            <Table.Head>
                                {localize('Rate (1 {{currency}})', { currency: general_store.client.currency })}
                            </Table.Head>
                            <Table.Head>{''}</Table.Head>
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body className='buy-sell__table-body'>
                    <InfiniteDataList
                        data_list_className='buy-sell__data-list'
                        items={items}
                        rowRenderer={BuySellRowRenderer}
                        loadMoreRowsFn={loadMoreItems}
                        has_more_items_to_load={has_more_items_to_load}
                        keyMapperFn={item => item.id}
                    />
                </Table.Body>
            </Table>
        );
    }

    return <Empty className='buy-sell__empty' has_tabs icon='IcCashierNoAds' title={localize('No ads found')} />;
});

BuySellTable.displayName = 'BuySellTable';
BuySellTable.propTypes = {
    is_buy: PropTypes.bool,
    setSelectedAdvert: PropTypes.func,
    showAdvertiserPage: PropTypes.func,
};

export default BuySellTable;

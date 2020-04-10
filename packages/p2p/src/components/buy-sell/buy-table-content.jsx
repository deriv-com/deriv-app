import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { RowComponent, BuySellRowLoader } from './row.jsx';

const BuySellTableContent = ({ is_buy, setSelectedAd }) => {
    let item_offset = 0;
    const { list_item_limit } = useContext(Dp2pContext);
    const [is_mounted, setIsMounted] = useState(false);
    const [has_more_items_to_load, setHasMoreItemsToLoad] = useState(false);
    const [api_error_message, setApiErrorMessage] = useState('');
    const [is_loading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        loadMoreItems(item_offset, list_item_limit);
    }, [is_mounted]);

    const loadMoreItems = start_idx => {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: is_buy ? 'buy' : 'sell',
                offset: start_idx,
                limit: list_item_limit,
            }).then(response => {
                if (is_mounted) {
                    if (!response.error) {
                        setHasMoreItemsToLoad(response.length >= list_item_limit);
                        setIsLoading(false);
                        setItems(items.concat(response));
                        item_offset += response.length;
                    } else {
                        setApiErrorMessage(response.api_error_message);
                    }
                    resolve();
                }
            });
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    const Row = props => <RowComponent {...props} is_buy={is_buy} setSelectedAd={setSelectedAd} />;

    if (items.length) {
        return (
            <InfiniteLoaderList
                // screen size - header size - footer size - page overlay header - page overlay content padding -
                // tabs height - padding+margin of tab content - toggle height - table header height
                initial_height={'calc(100vh - 48px - 36px - 41px - 2.4rem - 36px - 3.2rem - 40px - 52px)'}
                items={items}
                RenderComponent={Row}
                RowLoader={BuySellRowLoader}
                has_more_items_to_load={has_more_items_to_load}
                loadMore={loadMoreItems}
            />
        );
    }

    return (
        <div className='deriv-p2p__empty'>{localize("No ads yet. If someone posts an ad, you'll see it here.")}</div>
    );
};

BuySellTableContent.propTypes = {
    setSelectedAd: PropTypes.func,
};

export default BuySellTableContent;

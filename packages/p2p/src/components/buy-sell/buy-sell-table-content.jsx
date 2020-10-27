import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { useStores } from 'Stores';
import { RowComponent, BuySellRowLoader } from './row.jsx';
import { BuySellTable } from './buy-sell-table.jsx';

const BuySellTableContent = observer(() => {
    const { buy_sell_store } = useStores();

    React.useEffect(() => {
        buy_sell_store.setIsLoading(true);
        buy_sell_store.loadMoreItems();
    }, [buy_sell_store.is_buy]);

    if (buy_sell_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (buy_sell_store.api_error_message) {
        return <TableError message={buy_sell_store.api_error_message} />;
    }

    const Row = props => (
        <RowComponent
            {...props}
            is_buy={buy_sell_store.is_buy}
            setSelectedAdvert={buy_sell_store.setSelectedAdvert}
            showAdvertiserPage={buy_sell_store.showAdvertiserPage}
        />
    );

    if (buy_sell_store.items.length) {
        return (
            <BuySellTable>
                <InfiniteLoaderList
                    autosizer_height={`calc(${buy_sell_store.height_values.join(' - ')})`}
                    items={buy_sell_store.items}
                    item_size={buy_sell_store.item_height}
                    RenderComponent={Row}
                    RowLoader={BuySellRowLoader}
                    has_more_items_to_load={buy_sell_store.has_more_items_to_load}
                    loadMore={buy_sell_store.loadMoreItems}
                />
            </BuySellTable>
        );
    }

    return <Empty has_tabs icon='IcCashierNoAds' title={localize('No ads found')} />;
});

BuySellTableContent.propTypes = {
    api_error_message: PropTypes.string,
    has_more_items_to_load: PropTypes.bool,
    height_values: PropTypes.array,
    is_buy: PropTypes.bool,
    is_loading: PropTypes.bool,
    item_height: PropTypes.number,
    items: PropTypes.array,
    loadMoreItems: PropTypes.func,
    setIsLoading: PropTypes.func,
    setSelectedAdvert: PropTypes.func,
    showAdvertiserPage: PropTypes.func,
};

export default BuySellTableContent;

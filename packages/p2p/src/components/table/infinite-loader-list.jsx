import React from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export const InfiniteLoaderList = ({
    autosizer_height,
    items,
    // TODO: use with API later
    // eslint-disable-next-line no-unused-vars
    // is_loading_more_items,
    loadMore,
    has_more_items_to_load,
    item_size,
    RenderComponent,
    row_actions,
    RowLoader,
}) => {
    const RowRenderer = ({ index, style }) => {
        if (!items[index]) return null;
        const is_loading = index === items.length;

        if (is_loading) {
            return (
                <div style={style}>
                    <RowLoader />
                </div>
            );
        }

        return <RenderComponent data={items[index]} num={index} style={style} row_actions={row_actions} />;
    };

    RowRenderer.propTypes = {
        index: PropTypes.number,
        style: PropTypes.object,
    };

    const item_count = has_more_items_to_load ? items.length + 1 : items.length;
    return (
        <AutoSizer style={{ height: autosizer_height }}>
            {({ height, width }) => (
                <InfiniteLoader
                    isItemLoaded={index => index < items.length}
                    itemCount={item_count}
                    loadMoreItems={loadMore}
                >
                    {({ onItemsRendered, ref }) => (
                        <List
                            height={height}
                            width={width}
                            itemCount={item_count}
                            itemSize={item_size || 56}
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                        >
                            {RowRenderer}
                        </List>
                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
};

InfiniteLoaderList.propTypes = {
    children: PropTypes.node,
    has_more_items_to_load: PropTypes.bool,
    height: PropTypes.number,
    is_loading_more_items: PropTypes.bool,
    item_size: PropTypes.number,
    items: PropTypes.array,
    loadMore: PropTypes.func,
    RenderComponent: PropTypes.any,
    row_actions: PropTypes.object,
    RowLoader: PropTypes.any,
};

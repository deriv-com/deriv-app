import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export const InfiniteLoaderList = ({
    items,
    // I think we'll need this in the future
    // eslint-disable-next-line no-unused-vars
    is_loading_more_items,
    loadMore,
    has_more_items_to_load,
    RowComponent,
    height,
    width,
}) => {
    const RowRenderer = ({ index, style }) => (
        <RowComponent data={items[index]} num={index} style={style} loading={index === items.length} />
    );
    RowRenderer.propTypes = {
        index: PropTypes.number,
        style: PropTypes.object,
    };

    const itemCount = has_more_items_to_load ? items.length + 1 : items.length;

    return (
        <InfiniteLoader
            isItemLoaded={index => index < items.length}
            itemCount={itemCount}
            loadMoreItems={loadMore}
        >
            {({ onItemsRendered, ref }) => (
                <List
                    height={height || 500}
                    width={width || 960}
                    itemCount={itemCount}
                    itemSize={80}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                >
                    {RowRenderer}
                </List>
            )}
        </InfiniteLoader>
    );
};

InfiniteLoaderList.propTypes = {
    items                 : PropTypes.array,
    is_loading_more_items : PropTypes.bool,
    has_more_items_to_load: PropTypes.bool,
    loadMore              : PropTypes.func,
    RowComponent          : PropTypes.any,
    children              : PropTypes.node,
    height                : PropTypes.number,
    width                 : PropTypes.number,
};

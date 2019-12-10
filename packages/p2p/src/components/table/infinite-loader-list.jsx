import React                     from 'react';
import PropTypes                 from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader            from 'react-window-infinite-loader';

export const InfiniteLoaderList = ({
    items,
    // TODO: use with API later
    // eslint-disable-next-line no-unused-vars
    is_loading_more_items,
    loadMore,
    has_more_items_to_load,
    item_size,
    RenderComponent,
    RowLoader,
    height,
    width,
}) => {
    const RowRenderer = ({ index, style }) => {
        const is_loading = index === items.length;

        if (is_loading) {
            return (
                <div style={style}>
                    <RowLoader width={width} />
                </div>
            );
        }

        return <RenderComponent data={items[index]} num={index} style={style} />;
    };
    RowRenderer.propTypes = {
        index: PropTypes.number,
        style: PropTypes.object,
    };

    const item_count = has_more_items_to_load ? items.length + 1 : items.length;

    return (
        <InfiniteLoader
            isItemLoaded={index => index < items.length}
            itemCount={item_count}
            loadMoreItems={loadMore}
        >
            {({ onItemsRendered, ref }) => (
                <List
                    height={height || 452}
                    width={width || 960}
                    itemCount={item_count}
                    itemSize={item_size || 56}
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
    item_size             : PropTypes.number,
    loadMore              : PropTypes.func,
    RenderComponent       : PropTypes.any,
    RowLoader             : PropTypes.any.isRequired,
    children              : PropTypes.node,
    height                : PropTypes.number,
    width                 : PropTypes.number,
};

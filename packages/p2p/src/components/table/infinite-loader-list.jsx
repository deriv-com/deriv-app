import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

// const ReportsTableRowLoader = ({ speed }) => (
//     <ContentLoader
//         height={64}
//         width={992}
//         speed={speed}
//         primaryColor={'var(--general-hover)'}
//         secondaryColor={'var(--general-active)'}
//     >
//         <rect x='16' y='16' rx='0' ry='0' width='32' height='32' />
//         <rect x='52' y='16' rx='0' ry='0' width='32' height='32' />
//         <rect x='132' y='28' rx='0' ry='0' width='101' height='8' />
//         <rect x='273' y='28' rx='0' ry='0' width='120' height='8' />
//         <rect x='460' y='28' rx='0' ry='0' width='46' height='8' />
//         <rect x='593' y='28' rx='0' ry='0' width='46' height='8' />
//         <rect x='726' y='28' rx='0' ry='0' width='64' height='8' />
//         <rect x='906' y='28' rx='0' ry='0' width='64' height='8' />
//     </ContentLoader>
// );

export const InfiniteLoaderList = ({
    items,
    // I think we'll need this in the future
    // eslint-disable-next-line no-unused-vars
    is_loading_more_items,
    loadMore,
    has_more_items_to_load,
    item_size,
    RowComponent,
    height,
    width,
}) => {
    const RowRenderer = ({ index, style }) => {
        const is_loading = index === items.length;

        if (is_loading) return <div style={style}>loading...</div>;
        return <RowComponent data={items[index]} num={index} style={style} />;
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
                    height={height || 500}
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
    RowComponent          : PropTypes.any,
    children              : PropTypes.node,
    height                : PropTypes.number,
    width                 : PropTypes.number,
};

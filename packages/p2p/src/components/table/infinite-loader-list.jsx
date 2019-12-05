import React                     from 'react';
import PropTypes                 from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader            from 'react-window-infinite-loader';
import ContentLoader             from 'react-content-loader';

// TODO: we probably need a separate skeleton loader for each table
const SkeletonLoader = ({ width }) => (
    <ContentLoader
        height={64}
        width={900 || width}
        speed={2}
        primaryColor={'var(--general-hover)'}
        secondaryColor={'var(--general-active)'}
    >
        <rect x="1" y="20" rx="5" ry="5" width="90" height="10" />
        <rect x="150" y="20" rx="5" ry="5" width="90" height="10" />
        <rect x="300" y="20" rx="5" ry="5" width="90" height="10" />
        <rect x="446" y="20" rx="5" ry="5" width="55" height="10" />
        <rect x="600" y="20" rx="5" ry="5" width="75" height="10" />
        <rect x="750" y="20" rx="5" ry="5" width="45" height="18" />
        <rect x="805" y="20" rx="5" ry="5" width="50" height="18" />
    </ContentLoader>
);

SkeletonLoader.propTypes = {
    width: PropTypes.number,
};

export const InfiniteLoaderList = ({
    items,
    // I think we'll need this in the future
    // eslint-disable-next-line no-unused-vars
    is_loading_more_items,
    loadMore,
    has_more_items_to_load,
    item_size,
    RenderComponent,
    height,
    width,
}) => {
    const RowRenderer = ({ index, style }) => {
        const is_loading = index === items.length;

        if (is_loading) {
            return (
                <div style={style}>
                    <SkeletonLoader width={width} />
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
                    height={height || 400}
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
    children              : PropTypes.node,
    height                : PropTypes.number,
    width                 : PropTypes.number,
};

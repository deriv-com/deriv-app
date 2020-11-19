import React from 'react';
import PropTypes from 'prop-types';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import DataList from '../data-list/data-list.jsx';

const InfiniteDataList = ({
    className,
    data_list_className,
    has_more_items_to_load,
    items,
    keyMapperFn,
    loadMoreRowsFn,
    onScroll,
    rowRenderer,
}) => {
    const item_count = has_more_items_to_load ? items.length + 1 : items.length;
    const isRowLoaded = ({ index }) => !!items[index];

    return (
        <InfiniteLoader
            className={className}
            isRowLoaded={isRowLoaded}
            rowCount={item_count}
            loadMoreRows={loadMoreRowsFn}
        >
            {({ onRowsRendered, registerChild }) => (
                <DataList
                    className={data_list_className}
                    data_source={items}
                    rowRenderer={rowRenderer}
                    setListRef={registerChild}
                    onRowsRendered={onRowsRendered}
                    onScroll={onScroll}
                    keyMapper={keyMapperFn}
                />
            )}
        </InfiniteLoader>
    );
};

InfiniteDataList.propTypes = {
    className: PropTypes.string,
    data_list_className: PropTypes.string,
    has_more_items_to_load: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    keyMapperFn: PropTypes.func.isRequired,
    loadMoreRowsFn: PropTypes.func.isRequired,
    rowRenderer: PropTypes.func.isRequired,
};

export default InfiniteDataList;

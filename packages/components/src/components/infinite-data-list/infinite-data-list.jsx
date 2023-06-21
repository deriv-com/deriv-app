import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteLoader } from 'react-virtualized';
import DataList from '../data-list/data-list';

const InfiniteDataList = ({
    className,
    data_list_className,
    has_filler, // Can be used as a top offset.
    has_more_items_to_load,
    items,
    keyMapperFn,
    loadMoreRowsFn,
    onScroll,
    rowRenderer,
    overscanRowCount,
    getRowSize,
}) => {
    const item_count = has_filler ? items.length - 1 : items.length;
    const row_count = has_more_items_to_load ? item_count + 1 : item_count;

    const isRowLoaded = ({ index }) => {
        const data_items = has_filler ? items.slice(1) : items;
        return index < data_items.length ? !!data_items[index] : false;
    };

    return (
        <InfiniteLoader
            className={className}
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRowsFn}
            rowCount={row_count}
        >
            {({ onRowsRendered, registerChild }) => (
                <DataList
                    className={data_list_className}
                    data_source={items}
                    getRowSize={getRowSize}
                    keyMapper={keyMapperFn}
                    onRowsRendered={onRowsRendered}
                    onScroll={onScroll}
                    overscanRowCount={overscanRowCount}
                    rowRenderer={rowRenderer}
                    setListRef={registerChild}
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
    onScroll: PropTypes.func,
    rowRenderer: PropTypes.func.isRequired,
    has_filler: PropTypes.bool,
    overscanRowCount: PropTypes.number,
    getRowSize: PropTypes.func,
};

export default InfiniteDataList;

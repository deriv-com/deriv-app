import React from 'react';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import DataList from '../data-list/data-list.jsx';

type InfiniteDataListProps = {
    className: string;
    data_list_className: string;
    has_more_items_to_load: boolean;
    items: unknown;
    keyMapperFn: () => void;
    loadMoreRowsFn: () => void;
    onScroll: () => void;
    rowRenderer: () => void;
};

const InfiniteDataList = ({
    className,
    data_list_className,

    // Can be used as a top offset.
    has_filler,

    has_more_items_to_load,
    items,
    keyMapperFn,
    loadMoreRowsFn,
    onScroll,
    rowRenderer,
    overscanRowCount,
    getRowSize,
}: InfiniteDataListProps) => {
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

export default InfiniteDataList;

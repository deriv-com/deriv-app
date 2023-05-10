import React from 'react';
import { InfiniteLoader as _InfiniteLoader, InfiniteLoaderProps, Index, IndexRange } from 'react-virtualized';
import DataList, { TRow, TRowRenderer } from '../data-list/data-list';

const InfiniteLoader = _InfiniteLoader as unknown as React.FC<InfiniteLoaderProps>;
type TInfiniteDatalist = {
    className: string;
    data_list_className: string;
    has_more_items_to_load: boolean;
    items: TRow[];
    keyMapperFn?: (row: TRow) => number | string;
    loadMoreRowsFn: <T>(params: IndexRange) => Promise<T>;
    onScroll: () => void;
    rowRenderer: TRowRenderer;
    has_filler: boolean;
    overscanRowCount: number;
    getRowSize?: (params: { index: number }) => number;
};

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
}: TInfiniteDatalist) => {
    const item_count = has_filler ? items.length - 1 : items.length;
    const row_count = has_more_items_to_load ? item_count + 1 : item_count;

    const isRowLoaded = ({ index }: Index) => {
        const data_items = has_filler ? items.slice(1) : items;
        return index < data_items.length ? !!data_items[index] : false;
    };

    return (
        <>
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
        </>
    );
};

export default InfiniteDataList;

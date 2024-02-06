import React, { memo, useRef } from 'react';
import clsx from 'clsx';
import { useFetchMore } from '@/hooks';
import { ColumnDef, getCoreRowModel, getGroupedRowModel, GroupingState, useReactTable } from '@tanstack/react-table';
import './Table.scss';

type TProps<T> = {
    columns?: ColumnDef<T>[];
    data: T[];
    groupBy?: GroupingState;
    isFetching: boolean;
    loadMoreFunction: () => void;
    rowClassname: string;
    rowGroupRender?: (data: T) => JSX.Element;
    rowRender: (data: T) => JSX.Element;
    tableClassname: string;
};

const Table = <T,>({
    columns = [],
    data,
    isFetching,
    loadMoreFunction,
    rowClassname,
    rowRender,
    tableClassname,
}: TProps<T>) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel<T>(),
        getGroupedRowModel: getGroupedRowModel<T>(),
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const { fetchMoreOnBottomReached } = useFetchMore({
        loadMore: loadMoreFunction,
        ref: tableContainerRef,
        isFetching,
    });

    return (
        <div
            className={clsx('p2p-v2-table', tableClassname)}
            onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
            ref={tableContainerRef}
        >
            {table.getRowModel().rows.map(row => (
                <div className={rowClassname} key={row.id}>
                    {rowRender(row.original)}
                </div>
            ))}
        </div>
    );
};

export default memo(Table);

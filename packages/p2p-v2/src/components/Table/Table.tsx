import React, { Fragment, memo, useRef } from 'react';
import clsx from 'clsx';
import { ColumnDef, GroupingState, getCoreRowModel, getGroupedRowModel, useReactTable } from '@tanstack/react-table';
import { Text } from '@deriv-com/ui/dist/components/Text';
import useFetchMore from '../../hooks/useFetchMore';
import './Table.scss';
import { useDevice } from '../../hooks';

type TProps<T> = {
    columns?: ColumnDef<T>[];
    data: T[];
    groupBy?: GroupingState;
    isFetching: boolean;
    loadMoreFunction: () => void;
    rowClassname: string;
    headerRender?: (data: T) => JSX.Element;
    rowRender: (data: T) => JSX.Element;
    tableClassname: string;
};

const Table = <T,>({
    columns = [],
    data,
    headerRender = () => <div></div>,
    isFetching,
    loadMoreFunction,
    rowClassname,
    rowRender,
    tableClassname,
}: TProps<T>) => {
    const { isDesktop } = useDevice();
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
        <div>
            {isDesktop && columns.length > 0 && (
                <div className='p2p-v2-table__header' style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
                    {table.getFlatHeaders().map(header => (
                        <Text key={header.id} className='p2p-v2-table__header-items' weight='bold' size='sm'>
                            {headerRender(header.column.columnDef.header as T)}
                        </Text>
                    ))}
                </div>
            )}
            <div
                className={clsx('p2p-v2-table__content', tableClassname)}
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}
            >
                {table.getRowModel().rows.map(row => (
                    <div className={rowClassname} key={row.id}>
                        {rowRender(row.original)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(Table);

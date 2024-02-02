import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ColumnDef, GroupingState, getCoreRowModel, getGroupedRowModel, useReactTable } from '@tanstack/react-table';
import { Text } from '@deriv-com/ui';
import useFetchMore from '../../hooks/useFetchMore';
import { useDevice } from '../../hooks';
import './Table.scss';

type TProps<T> = {
    columns?: ColumnDef<T>[];
    data: T[];
    groupBy?: GroupingState;
    headerRender?: (data: string) => JSX.Element;
    isFetching: boolean;
    loadMoreFunction: () => void;
    rowRender: (data: T) => JSX.Element;
    tableClassname: string;
};

const Table = <T,>({
    columns = [],
    data,
    headerRender = () => <div />,
    isFetching,
    loadMoreFunction,
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
    const headerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (headerRef?.current) {
            const topPosition = headerRef.current.getBoundingClientRect().bottom;
            setHeight(window.innerHeight - topPosition);
        }
    }, [headerRef?.current]);

    const { fetchMoreOnBottomReached } = useFetchMore({
        loadMore: loadMoreFunction,
        ref: tableContainerRef,
        isFetching,
    });

    return (
        <div className='w-full'>
            {isDesktop && columns.length > 0 && (
                <div
                    className='p2p-v2-table__header'
                    ref={headerRef}
                    style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
                >
                    {table.getFlatHeaders().map(header => (
                        <Text className='p2p-v2-table__header-items' key={header.id} size='sm' weight='bold'>
                            {headerRender(header.column.columnDef.header as string)}
                        </Text>
                    ))}
                </div>
            )}
            <div
                className={clsx('p2p-v2-table__content', tableClassname)}
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}
                style={{ height: isDesktop && columns.length > 0 ? `calc(${height}px - 3.6rem)` : '100%' }}
            >
                {table.getRowModel().rows.map(row => (
                    <div className='p2p-v2-table__content-row' key={row.id}>
                        {rowRender(row.original)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(Table);

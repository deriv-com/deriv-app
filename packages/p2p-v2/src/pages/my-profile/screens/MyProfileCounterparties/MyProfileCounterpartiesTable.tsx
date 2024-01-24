import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ColumnDef, getCoreRowModel, getGroupedRowModel, GroupingState, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './MyProfileCounterpartiesTable.scss';

type TProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    isFetching: boolean;
    isLoading: boolean;
    loadMoreAdvertisers: () => void;
    rowRender: (data: T) => JSX.Element;
};

//TODO: rewrite the implementation in accordance with @deriv-com/ui table component
const MyProfileCounterpartiesTable = <T,>({
    columns,
    data,
    isFetching,
    isLoading,
    loadMoreAdvertisers,
    rowRender,
}: TProps<T>) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel<T>(),
        getGroupedRowModel: getGroupedRowModel<T>(),
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { clientHeight, scrollHeight, scrollTop } = containerRefElement;
                //once the user has scrolled within 200px of the bottom of the table, fetch more data if we can
                if (scrollHeight - scrollTop - clientHeight < 200 && !isFetching) {
                    loadMoreAdvertisers();
                }
            }
        },
        [loadMoreAdvertisers, isFetching]
    );

    //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    if (!isFetching && data.length === 0) {
        return <Text weight='bold'>There are no matching name</Text>;
    }

    if (isLoading) {
        return <Loader className='p2p-v2-my-profile-counterparties-table__loader' isFullScreen={false} />;
    }

    return (
        <div
            className='p2p-v2-my-profile-counterparties-table'
            onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        >
            {table.getRowModel().rows.map((row, index) => (
                <div className='p2p-v2-my-profile-counterparties-table__row' key={row.id}>
                    {rowRender(row.original)}
                    {index === table.getRowModel().rows.length - 1 && isFetching && (
                        <Loader className='p2p-v2-my-profile-counterparties-table__row-loader' />
                    )}
                </div>
            ))}
        </div>
    );
};

export default memo(MyProfileCounterpartiesTable);

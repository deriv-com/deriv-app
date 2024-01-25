import React, { useCallback, useEffect, useRef } from 'react';
import { ColumnDef, getCoreRowModel, getGroupedRowModel, useReactTable } from '@tanstack/react-table';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './MyProfileCounterpartiesTable.scss';

type TProps<T> = {
    //below prop not used here, add if header is needed for table
    columns?: ColumnDef<T>[];
    data: T[];
    isFetching: boolean;
    isLoading: boolean;
    loadMoreAdvertisers: () => void;
    rowRender: (data: T) => JSX.Element;
};

//TODO: rewrite the implementation in accordance with @deriv-com/ui table component
const MyProfileCounterpartiesTable = <T,>({
    data,
    isFetching,
    isLoading,
    loadMoreAdvertisers,
    rowRender,
}: TProps<T>) => {
    const table = useReactTable({
        columns: [], // set to empty array since no header is needed for table
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
            ref={tableContainerRef}
        >
            {table.getRowModel().rows.map(row => (
                <div className='p2p-v2-my-profile-counterparties-table__row' key={row.id}>
                    {rowRender(row.original)}
                </div>
            ))}
        </div>
    );
};

export default MyProfileCounterpartiesTable;

import React, { useMemo } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './MyProfileCounterpartiesTable.scss';
import { ColumnDef, getCoreRowModel, getGroupedRowModel, GroupingState, useReactTable } from '@tanstack/react-table';
import './MyProfileCounterpartiesTable.scss';

type TProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    groupBy?: GroupingState;
    rowGroupRender: (data: T) => JSX.Element;
    rowRender: (data: T) => JSX.Element;
};

const MyProfileCounterpartiesTable = <T,>({ columns, data, groupBy, rowGroupRender, rowRender }: TProps<T>) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel<T>(),
        getGroupedRowModel: getGroupedRowModel<T>(),
        state: { grouping: useMemo(() => groupBy, [groupBy]) },
    });

    if('no list') {
        return (
            <Text weight='bold'>
                There are no matching name
            </Text>
        )
    }

    return (
        <div className='wallets-transactions-table'>
            {table.getRowModel().rows.map(rowGroup => (
                <div className='wallets-transactions-table__row' key={rowGroup.id}>
                    {rowGroupRender(rowGroup.original)}
                    {rowGroup.subRows.map(row => (
                        <div key={row.id}>{rowRender(row.original)}</div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MyProfileCounterpartiesTable;

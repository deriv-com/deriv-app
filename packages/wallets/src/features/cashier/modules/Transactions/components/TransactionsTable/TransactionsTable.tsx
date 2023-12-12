import React, { useMemo } from 'react';
import { ColumnDef, getCoreRowModel, getGroupedRowModel, GroupingState, useReactTable } from '@tanstack/react-table';
import './TransactionsTable.scss';

type TProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    groupBy?: GroupingState;
    rowGroupRender: (data: T) => JSX.Element;
    rowRender: (data: T) => JSX.Element;
};

const TransactionsTable = <T,>({ columns, data, groupBy, rowGroupRender, rowRender }: TProps<T>) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel<T>(),
        getGroupedRowModel: getGroupedRowModel<T>(),
        state: { grouping: useMemo(() => groupBy, [groupBy]) },
    });

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

export default TransactionsTable;

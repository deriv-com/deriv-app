import React from 'react';
import classNames from 'classnames';
import Head from './table-head';
import Header from './table-header';
import Body from './table-body';
import Row from './table-row';
import Cell from './table-cell';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars';

type TTable = {
    className: string;
    fixed: boolean;
    scroll_width: string;
    scroll_height: string;
};

// TODO: update the <Table /> component to fit with the DataTable in Trader
const Table = ({
    className,
    fixed,
    children,
    scroll_width,
    scroll_height,
}: React.PropsWithChildren<Partial<TTable>>) => (
    <div
        role='table'
        className={classNames('dc-table', className, {
            'dc-table--scroll': fixed,
        })}
    >
        {fixed ? (
            <ThemedScrollbars
                has_horizontal
                width={scroll_width || '100%'}
                height={scroll_height}
                className={'dc-table--scrollbar'}
            >
                {children}
            </ThemedScrollbars>
        ) : (
            children
        )}
    </div>
);

Table.Head = Head;
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
// TODO add footer

export default Table;

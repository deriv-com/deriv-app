import classNames from 'classnames';
import React from 'react';

type TableCellProps = {
    children: React.ReactNode;
    col_index: string;
};

const TableCell = ({ col_index, children }: TableCellProps) => (
    <div className={classNames('table__cell', col_index)}>{children}</div>
);

export default TableCell;

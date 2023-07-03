import classNames from 'classnames';
import React from 'react';

type TTableCell = {
    col_index: string;
};

const TableCell = ({ col_index, children }: React.PropsWithChildren<TTableCell>) => (
    <div className={classNames('table__cell', col_index)}>{children}</div>
);

export default TableCell;

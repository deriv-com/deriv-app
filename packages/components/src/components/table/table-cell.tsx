import React from 'react';
import classNames from 'classnames';

type CellProps = {
    align: unknown;
    children: React.ReactNode;
    className: string;
    fixed: boolean;
};

const Cell = ({ children, align = 'left', className, fixed }: CellProps) => (
    <div
        role='cell'
        className={classNames('dc-table__cell', className, {
            'dc-table__cell--right': align === 'right',
            'dc-table__cell--fixed': fixed,
        })}
    >
        {children}
    </div>
);

export default Cell;

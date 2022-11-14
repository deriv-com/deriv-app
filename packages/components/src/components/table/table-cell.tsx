import React from 'react';
import classNames from 'classnames';

export type TCell = {
    align: 'left' | 'right';
    className: string;
    fixed: boolean;
};

const Cell = ({ children, align = 'left', className, fixed }: React.PropsWithChildren<Partial<TCell>>) => (
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

import React from 'react';
import classNames from 'classnames';
import { TCell } from './table-cell';

const Head = ({ children, align, className, fixed }: React.PropsWithChildren<Partial<TCell>>) => (
    <div
        role='columnheader'
        className={classNames('dc-table__head', className, {
            'dc-table__cell--right': align === 'right',
            'dc-table__cell--fixed': fixed,
        })}
    >
        {children}
    </div>
);

export default Head;

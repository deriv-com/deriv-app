import React from 'react';
import classNames from 'classnames';
import { TCell } from './table-cell';

const Head = ({ children, align, className, fixed }: React.PropsWithChildren<Partial<TCell>>) => (
    <div
        role='columnheader'
        className={classNames('dc-table2__head', className, {
            'dc-table2__cell--right': align === 'right',
            'dc-table2__cell--fixed': fixed,
        })}
    >
        {children}
    </div>
);

export default Head;

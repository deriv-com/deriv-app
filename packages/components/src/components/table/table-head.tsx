import React from 'react';
import classNames from 'classnames';

type HeadProps = {
    align: unknown;
    children: React.ReactNode;
    className: string;
    fixed: boolean;
};

const Head = ({ children, align, className, fixed }: HeadProps) => (
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

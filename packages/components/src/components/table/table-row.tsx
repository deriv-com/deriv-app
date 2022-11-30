import React from 'react';
import classNames from 'classnames';

type TRow = {
    children: React.ReactNode;
    className?: string;
    has_hover?: boolean;
};

const Row = ({ children, className, has_hover }: TRow) => {
    return (
        <div
            role='row'
            className={classNames('dc-table__row', className, {
                'dc-table__row--hover': has_hover,
            })}
        >
            {children}
        </div>
    );
};

export default Row;

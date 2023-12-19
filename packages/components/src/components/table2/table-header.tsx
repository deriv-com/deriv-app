import React from 'react';
import classNames from 'classnames';

type THeader = {
    children: React.ReactNode;
    className?: string;
};

const Header = ({ children, className }: THeader) => (
    <div role='rowgroup' className={classNames('dc-table2__header', className)}>
        {children}
    </div>
);

export default Header;

import React from 'react';
import classNames from 'classnames';

type HeaderProps = {
    children: React.ReactNode;
    className: string;
};

const Header = ({ children, className }: HeaderProps) => (
    <div role='rowgroup' className={classNames('dc-table__header', className)}>
        {children}
    </div>
);

export default Header;

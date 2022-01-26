import classNames from 'classnames';
import React from 'react';

type HeaderProps = {
    children: React.ReactNode;
    className: string;
};

const Header = ({ className, children }: HeaderProps) => (
    <div className={classNames('dc-mobile-drawer__subheader', className)}>{children}</div>
);

export default Header;

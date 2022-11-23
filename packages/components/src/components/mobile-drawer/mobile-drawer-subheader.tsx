import classNames from 'classnames';
import React from 'react';

type THeader = {
    className?: string;
};

const Header = ({ className, children }: React.PropsWithChildren<THeader>) => (
    <div className={classNames('dc-mobile-drawer__subheader', className)}>{children}</div>
);

export default Header;

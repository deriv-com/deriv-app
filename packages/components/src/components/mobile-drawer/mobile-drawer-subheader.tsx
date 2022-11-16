import classNames from 'classnames';
import React from 'react';

type THeader = React.PropsWithChildren<{
    className: string;
}>;

const Header = ({ className, children }: THeader) => (
    <div className={classNames('dc-mobile-drawer__subheader', className)}>{children}</div>
);

export default Header;

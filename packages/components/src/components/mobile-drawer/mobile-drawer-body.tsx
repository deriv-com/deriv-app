import classNames from 'classnames';
import React from 'react';

type TBody = React.PropsWithChildren<{
    className: string;
}>;

const Body = ({ children, className }: TBody) => (
    <div className={classNames('dc-mobile-drawer__body', className)}>{children}</div>
);

export default Body;

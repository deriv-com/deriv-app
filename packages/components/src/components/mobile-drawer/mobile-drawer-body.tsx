import classNames from 'classnames';
import React from 'react';

type TBody = {
    className?: string;
};

const Body = ({ children, className }: React.PropsWithChildren<TBody>) => (
    <div className={classNames('dc-mobile-drawer__body', className)}>{children}</div>
);

export default Body;

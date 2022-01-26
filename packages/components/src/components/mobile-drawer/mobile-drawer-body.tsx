import classNames from 'classnames';
import React from 'react';

type BodyProps = {
    children: React.ReactNode;
    className: string;
};

const Body = ({ children, className }: BodyProps) => (
    <div className={classNames('dc-mobile-drawer__body', className)}>{children}</div>
);

export default Body;

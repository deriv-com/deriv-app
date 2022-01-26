import React from 'react';
import classNames from 'classnames';

type BodyProps = {
    children: React.ReactNode;
    className: string;
};

const Body = ({ children, className }: BodyProps) => (
    <div className={classNames('dc-modal-body', className)}>{children}</div>
);

export default Body;

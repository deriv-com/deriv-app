import React from 'react';
import classNames from 'classnames';

type TBody = {
    className: string;
};

const Body = ({ children, className }: React.PropsWithChildren<Partial<TBody>>) => (
    <div className={classNames('dc-modal-body', className)}>{children}</div>
);

export default Body;

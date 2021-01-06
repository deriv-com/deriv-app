import React from 'react';
import classNames from 'classnames';

const Body = ({ children, className }) => (
    <div
        className={classNames('dc-modal-body', {
            [`dc-modal-body--${className}`]: className,
        })}
    >
        {children}
    </div>
);

export default Body;

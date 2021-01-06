import classNames from 'classnames';
import React from 'react';

const Footer = ({ children, className, has_separator, is_bypassed }) => {
    if (is_bypassed) return children;
    return (
        <div
            className={classNames('dc-modal-footer', {
                'dc-modal-footer--separator': has_separator,
                [`dc-modal-footer--${className}`]: className,
            })}
        >
            {children}
        </div>
    );
};

export default Footer;

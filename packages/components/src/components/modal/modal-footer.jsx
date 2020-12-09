import classNames from 'classnames';
import React from 'react';

const Footer = ({ children, has_separator, is_bypassed }) => {
    if (is_bypassed) return children;
    return (
        <div className={classNames('dc-modal-footer', { 'dc-modal-footer--separator': has_separator })}>{children}</div>
    );
};

export default Footer;

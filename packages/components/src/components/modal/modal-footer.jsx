import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ children, className, has_separator, is_bypassed }) => {
    if (is_bypassed) return children;
    return (
        <div
            className={classNames(
                'dc-modal-footer',
                {
                    'dc-modal-footer--separator': has_separator,
                },
                className
            )}
        >
            {children}
        </div>
    );
};

Footer.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    has_separator: PropTypes.bool,
    is_bypassed: PropTypes.bool,
};

export default Footer;

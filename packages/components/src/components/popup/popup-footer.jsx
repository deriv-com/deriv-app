import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Footer = ({ children, className, has_separator }) => {
    return (
        <div
            className={classNames('dc-popup__footer', {
                'dc-popup__footer--separator': has_separator,
                className,
            })}
        >
            {children}
        </div>
    );
};

Footer.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    has_separator: PropTypes.bool,
};

export default Footer;

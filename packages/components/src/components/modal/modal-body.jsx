import React from 'react';
import PropTypes from 'prop-types';
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

Body.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Body;

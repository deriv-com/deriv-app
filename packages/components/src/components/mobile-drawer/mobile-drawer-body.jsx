import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Body = ({ children, className }) => (
    <div className={classNames('dc-mobile-drawer__body', className)}>{children}</div>
);

Body.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Body;

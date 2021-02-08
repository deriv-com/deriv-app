import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Body = ({ children, className }) => <div className={classNames('dc-modal-body', className)}>{children}</div>;

Body.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    className: PropTypes.string,
};

export default Body;

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Body = ({ children, className }) => <div className={classNames('dc-modal-body', className)}>{children}</div>;

Body.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    className: PropTypes.string,
};

export default Body;

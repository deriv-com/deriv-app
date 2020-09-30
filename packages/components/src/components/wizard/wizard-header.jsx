import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Header = ({ children, className }) => (
    <div className={classNames('wizard__main-header', className)}>{children}</div>
);

Header.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Header;

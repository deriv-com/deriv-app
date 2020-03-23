import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ className, children }) => (
    <div className={classNames('dc-mobile-drawer__subheader', className)}>{children}</div>
);

Header.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Header;

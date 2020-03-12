import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Header = ({ children, className }) => (
    <div role='rowgroup' className={classNames('dc-table__header', className)}>
        {children}
    </div>
);

Header.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Header;

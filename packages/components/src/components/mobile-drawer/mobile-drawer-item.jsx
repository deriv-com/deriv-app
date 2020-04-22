import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const Item = ({ className, children, onClick }) => (
    <div className={classNames('dc-mobile-drawer__item', className)} onClick={onClick}>
        {children}
    </div>
);

Item.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Item;

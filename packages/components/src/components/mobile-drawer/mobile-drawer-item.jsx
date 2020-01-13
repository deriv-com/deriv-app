import classNames from 'classnames';
import React      from 'react';

const Item = ({ className, children, onClick }) => (
    <div
        className={classNames('dc-mobile-drawer__item', className)}
        onClick={onClick}
    >
        {children}
    </div>
);

export default Item;

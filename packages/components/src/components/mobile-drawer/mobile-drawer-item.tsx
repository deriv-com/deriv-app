import classNames from 'classnames';
import React from 'react';

type ItemProps = {
    children: React.ReactNode;
    className: string;
    onClick: () => void;
};

const Item = ({ className, children, onClick }: ItemProps) => (
    <div className={classNames('dc-mobile-drawer__item', className)} onClick={onClick}>
        {children}
    </div>
);

export default Item;

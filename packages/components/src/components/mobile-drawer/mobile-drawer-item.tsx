import classNames from 'classnames';
import React from 'react';

type TItem = {
    className?: string;
    onClick: () => void;
};

const Item = ({ className, children, onClick }: React.PropsWithChildren<TItem>) => (
    <div className={classNames('dc-mobile-drawer__item', className)} onClick={onClick}>
        {children}
    </div>
);

export default Item;

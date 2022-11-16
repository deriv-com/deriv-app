import classNames from 'classnames';
import React from 'react';

type TItem = React.PropsWithChildren<{
    className: string;
    onClick: () => void;
}>;

const Item = ({ className, children, onClick }: TItem) => (
    <div className={classNames('dc-mobile-drawer__item', className)} onClick={onClick}>
        {children}
    </div>
);

export default Item;

import React from 'react';
import classNames from 'classnames';
import { TReactChildren } from 'Types';

type TProps = {
    className: string;
    children: TReactChildren;
    item_count: number;
};

const WalletRadioButtonGroup: React.FC<TProps> = ({ className, children, item_count }) => {
    return (
        <div className={className}>
            <div
                className={classNames('wallet-list__items', {
                    'wallet-list__items__center': item_count < 5,
                })}
            >
                {children}
            </div>
        </div>
    );
};

export default WalletRadioButtonGroup;

import React from 'react';
import classNames from 'classnames';

const WalletContentDivider = ({ is_demo_divider }: { is_demo_divider?: boolean }) => (
    <div
        className={classNames('wallet-content__divider', {
            'wallet-content__divider-demo': is_demo_divider,
        })}
    />
);

export default WalletContentDivider;

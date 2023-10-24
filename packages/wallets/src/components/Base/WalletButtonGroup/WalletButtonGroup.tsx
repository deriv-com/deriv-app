import React, { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import './WalletButtonGroup.scss';

type TWalletButtonGroupProps = {
    isFlex?: boolean;
    isVertical?: boolean;
};

const WalletButtonGroup: FC<PropsWithChildren<TWalletButtonGroupProps>> = ({ children, isFlex, isVertical }) => {
    return (
        <div
            className={classNames('wallets-button-group', {
                'wallets-button-group--vertical': isVertical,
                'wallets-button-group--flex': isFlex,
            })}
        >
            {children}
        </div>
    );
};

export default WalletButtonGroup;

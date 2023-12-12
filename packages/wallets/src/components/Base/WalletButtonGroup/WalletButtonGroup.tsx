import React, { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import './WalletButtonGroup.scss';

type TWalletButtonGroupProps = {
    isFlex?: boolean;
    isFullWidth?: boolean;
    isVertical?: boolean;
};

const WalletButtonGroup: FC<PropsWithChildren<TWalletButtonGroupProps>> = ({
    children,
    isFlex,
    isFullWidth,
    isVertical,
}) => {
    return (
        <div
            className={classNames('wallets-button-group', {
                'wallets-button-group--flex': isFlex,
                'wallets-button-group--full-width': isFullWidth,
                'wallets-button-group--vertical': isVertical,
            })}
        >
            {children}
        </div>
    );
};

export default WalletButtonGroup;

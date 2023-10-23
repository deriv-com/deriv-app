import React from 'react';
import { type WalletButton } from '../WalletButton';
import './WalletButtonGroup.scss';
import classNames from 'classnames';

type TWalletButtonGroupProps = {
    isVertical?: boolean;
};

const WalletButtonGroup: React.FC<React.PropsWithChildren<TWalletButtonGroupProps>> = ({ children, isVertical }) => {
    return (
        <div
            className={classNames('wallets-button-group', {
                'wallets-button-group--vertical': isVertical,
            })}
        >
            {Children.map(children, child => (
                <div className='wallets-button-group__item'>{child}</div>
            ))}
        </div>
    );
};

export default WalletButtonGroup;

import React from 'react';
import Icon from '../icon';
import './wallet-icon.scss';
import classNames from 'classnames';

type TWalletIcon = {
    currency: string;
    dark?: string;
    rounded?: string;
    size: 'small' | 'medium' | 'large';
};
/* TODO: Handle icon loading, gradient background, dark mode */
const WalletIcon = ({ currency, dark, rounded, size }: TWalletIcon) => {
    return (
        <div
            className={classNames('wallet-icon', {
                'wallet-icon--dark': dark,
                [`wallet-icon--${size}`]: size,
            })}
        >
            <Icon
                icon={currency}
                className={classNames('wallet-icon__icon', {
                    'wallet-icon__icon--rounded': rounded,
                })}
            />
        </div>
    );
};

export default WalletIcon;

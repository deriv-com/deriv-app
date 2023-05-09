import React, { CSSProperties } from 'react';
import Icon from '../icon';
import { GradientBackgroundWalletIcon } from '../gradient-background-wallet-icon';
import './wallet-icon.scss';
import classNames from 'classnames';

type TWalletIcon = {
    colors: {
        primary: CSSProperties['backgroundColor'];
        secondary: CSSProperties['backgroundColor'];
    };
    icon: string;
    rounded?: string;
    size: 'small' | 'medium' | 'large';
};

const getBlurRadius = (size: string) => {
    switch (size) {
        case 'small':
            return 16;
        case 'medium':
            return 24;
        case 'large':
            return 48;
        default:
            return undefined;
    }
};

const WalletIcon = ({ colors, icon, rounded, size }: TWalletIcon) => {
    return (
        <div
            className={classNames('wallet-icon', {
                [`wallet-icon--${size}`]: size,
            })}
        >
            <div className='wallet-icon__background'>
                <GradientBackgroundWalletIcon
                    blurRadius={getBlurRadius(size)}
                    color='var(--general-main-2)'
                    primary={colors.primary}
                    secondary={colors.secondary}
                />
            </div>
            <Icon
                icon={icon}
                className={classNames('wallet-icon__icon', {
                    'wallet-icon__icon--rounded': rounded,
                })}
            />
        </div>
    );
};

export default WalletIcon;

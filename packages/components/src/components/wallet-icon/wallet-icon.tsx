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
    dark?: string;
    icon: string;
    rounded?: string;
    size: 'small' | 'medium' | 'large';
};

const WalletIcon = ({ colors, dark, icon, rounded, size }: TWalletIcon) => {
    return (
        <div
            className={classNames('wallet-icon', {
                'wallet-icon--dark': dark,
                [`wallet-icon--${size}`]: size,
            })}
        >
            <GradientBackgroundWalletIcon
                color='var(--general-main-2)'
                primary={colors.primary}
                secondary={colors.secondary}
                size={size}
            >
                <Icon
                    icon={icon}
                    className={classNames('wallet-icon__icon', {
                        'wallet-icon__icon--rounded': rounded,
                    })}
                />
            </GradientBackgroundWalletIcon>
        </div>
    );
};

export default WalletIcon;

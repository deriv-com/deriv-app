import React, { CSSProperties } from 'react';
import Icon from '../icon';
import { GradientBackgroundTwoPoint } from '../gradient-background-two-point';
import './wallet-icon.scss';
import classNames from 'classnames';

type TWalletIcon = {
    icon: string;
    iconSize: number | string;
    primaryColor: CSSProperties['backgroundColor'];
    secondaryColor: CSSProperties['backgroundColor'];
    rounded?: string;
    size: 'small' | 'medium' | 'large';
};

const getBlurRadius = (size: string) => {
    if (size === 'small') return 16;
    if (size === 'medium') return 24;

    return 48;
};

const WalletIcon = ({ icon, iconSize = 24, primaryColor, secondaryColor, rounded, size = 'medium' }: TWalletIcon) => {
    return (
        <div className={`wallet-icon wallet-icon--${size}`}>
            <div className='wallet-icon__background'>
                <GradientBackgroundTwoPoint
                    blurRadius={getBlurRadius(size)}
                    backgroundColor='var(--general-main-2)'
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />
            </div>
            <Icon
                icon={icon}
                size={iconSize}
                className={classNames('wallet-icon__icon', {
                    'wallet-icon__icon--rounded': rounded,
                })}
            />
        </div>
    );
};

export default WalletIcon;

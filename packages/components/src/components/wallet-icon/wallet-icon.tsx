import React, { CSSProperties } from 'react';
import Icon from '../icon';
import { GradientBackgroundTwoPoint } from '../gradient-background-two-point';
import './wallet-icon.scss';

type TWalletIcon = {
    icon: string;
    iconSize: number | string;
    primaryColor: CSSProperties['backgroundColor'];
    secondaryColor: CSSProperties['backgroundColor'];
    size?: 'small' | 'medium' | 'large';
};

const getBlurRadius = (size: string) => {
    if (size === 'small') return 16;
    if (size === 'medium') return 24;

    return 48;
};

const WalletIcon = ({ icon, iconSize = 24, primaryColor, secondaryColor, size = 'medium' }: TWalletIcon) => {
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
            <Icon icon={icon} size={iconSize} className='wallet-icon__icon' />
        </div>
    );
};

export default WalletIcon;
